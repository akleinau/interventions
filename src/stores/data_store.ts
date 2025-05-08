import {defineStore} from 'pinia'

export const useDataStore = defineStore({
    id: 'data',
    state: () => ({
        address: "http://127.0.0.1:5000/" as string,
        input_params: {} as { [key: string]: any },
        prediction: {} as { [key: string]: any },
    }),
    actions: {

        reset() {

        },

        async predict() {
            console.log(this.input_params)
            let gResponse = null
            gResponse = await fetch(this.address + "predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"input": this.input_params})
            });
            let response = await gResponse.json();

            // add numerical predictions
            response.ctrlprediction = response.ctrlrls.reduce((acc: number, curr: any) => {
                return acc + curr[1]
            }, 0)

            response.testprediction = response.testrls.reduce((acc: number, curr: any) => {
                return acc + curr[1]
            }, 0)

            response.ctrlrules_cleaned = response.ctrlrls.map((rule: any) => {
                return {
                    "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2),
                    "string": rule[0].map((a: any) => a[0]).join(" & ")
                }
            })

            response.testrules_cleaned = response.testrls.map((rule: any) => {
                let string = rule[0].map((a: any) => a[0]).join(" & ")

                // check if string is already in control
                let is_in_control_rules = response.ctrlrules_cleaned.some((r: any) => r.string === string)
                return {
                    "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2), "new": !is_in_control_rules,
                    "string": string
                }
            })

            console.log(response)
            this.prediction = response
        }
    }

})
