import {defineStore} from 'pinia'

export const useDataStore = defineStore({
    id: 'data',
    state: () => ({
        address: "https://pred.hbcptools.org/api/" as string,
        input_params: {} as { [key: string]: any },
        prediction: {} as { [key: string]: any },
        labels: {} as { [key: string]: { label: string, group: string, featurename: string, explanation: string } },
    }),
    actions: {

        reset() {

        },

        label(key: string) {
            if (this.labels[key] !== undefined) {
                return this.labels[key].label
            } else {
                return key
            }
        },

        explanation(key: string) {
            if (this.labels[key] !== undefined) {
                return this.labels[key].explanation
            } else {
                return ""
            }
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
            let ctrlprediction = response.ctrlrls.reduce((acc: number, curr: any) => {
                return acc + curr[1]
            }, 0)

            response.base = response.ctrlfit - ctrlprediction

            response.ctrlrules_cleaned = response.ctrlrls.map((rule: any) => {
                return {
                    "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2),
                    "string": rule[0].map((a: any) => this.label(a[0].trim())).join(" & ")
                }
            })

            // sort rules by weight
            response.ctrlrules_cleaned.sort((a: any, b: any) => {
                return Math.abs(b.weight) - Math.abs(a.weight)
            })

            response.testrules_cleaned = response.testrls.map((rule: any) => {
                let string = rule[0].map((a: any) => this.label(a[0].trim())).join(" & ")

                // check if string is already in control
                let is_in_control_rules = response.ctrlrules_cleaned.some((r: any) => r.string === string)
                return {
                    "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2), "new": !is_in_control_rules,
                    "string": string
                }
            })

            // sort rules by weight
            response.testrules_cleaned.sort((a: any, b: any) => {
                return Math.abs(b.weight) - Math.abs(a.weight)
            })

            // get max weight of both rule sets
            response.max_weight = Math.max(...response.ctrlrules_cleaned.map((rule: any) => Math.abs(rule.weight)),
                                                ...response.testrules_cleaned.map((rule: any) => Math.abs(rule.weight)))

            console.log(response)
            this.prediction = response
        }
    }

})
