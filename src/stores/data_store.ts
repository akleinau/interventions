import {defineStore} from 'pinia'

export const useDataStore = defineStore({
    id: 'data',
    state: () => ({
        address: "https://pred.hbcptools.org/api/" as string,
        //address: "http://localhost:5000/" as string,
        input_params: {} as { [key: string]: any },
        input_interventions: {} as { [key: string]: any },
        input_spec: {} as { [key: string]: any },
        prediction: {} as { [key: string]: any },
        control_prediction: {} as { [key: string]: any },
        base_prediction: {} as { [key: string]: any },
        stored_predictions: [] as { [key: string]: any }[],
        labels: {} as { [key: string]: { label: string, group: string, featurename: string, explanation: string } },
        max_weight: 0 as number,
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

        async predict_group(input: any) {
            let gResponse = null
            gResponse = await fetch(this.address + "predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"input": input})
            });
            let response = await gResponse.json();

             let rules_cleaned = response.rules.map((rule: any) => {
                let string = rule[0].map((a: any) => this.label(a.trim())).join(" & ")

                // check if string is already in control
                return {
                    "terms": rule[0].map((a: any) => a.trim()), "weight": rule[1].toFixed(2),
                    "string": string
                }
            })

            let prediction = response.rules.reduce((acc: number, curr: any) => {
                return acc + curr[1]
            }, 0)

            // sort rules by weight
            rules_cleaned.sort((a: any, b: any) => {
                return Math.abs(b.weight) - Math.abs(a.weight)
            })

            return {prediction: response.fit, rules: rules_cleaned, pure_prediction: prediction, base: response.fit-prediction}
        },

        async predict_control() {

            let response = await this.predict_group(this.input_params)
            console.log(response)

            this.control_prediction = response
        },

        async predict_intervention() {

            // combine input_params and input_interventions
            let combined_input = {...this.input_params, ...this.input_interventions}

            console.log("Combined input for intervention prediction:", combined_input)

            let response = await this.predict_group(combined_input)

            console.log("Intervention prediction response:", response)

            this.prediction = response
        },

        determine_base_rules() {

            // get rules in all rule sets
            let base_rules = [] as any[]
            let rule_strings = [] as string[]
            this.control_prediction.rules.forEach((rule: any) => {
                if (this.prediction.rules.find((r: any) => r.string === rule.string) !== undefined) {
                    base_rules.push(rule)
                    rule_strings.push(rule.string)
                }
            })

            this.base_prediction = {rules: base_rules, prediction: this.control_prediction.base}
            console.log("Base rules:", this.base_prediction)

            // set for each rule of each rule set, if it is "new" aka not in the base rule set
            this.control_prediction.rules.forEach((rule: any) => {
                rule.new = !rule_strings.includes(rule.string)
            })
            this.prediction.rules.forEach((rule: any) => {
                rule.new = !rule_strings.includes(rule.string)
            })
        },

        set_max_weight() {
            // get max weight of both rule sets
            this.max_weight = Math.max(...this.control_prediction.rules.map((rule: any) => Math.abs(rule.weight)),
                                        ...this.base_prediction.rules.map((rule: any) => Math.abs(rule.weight)),
                                                ...this.prediction.rules.map((rule: any) => Math.abs(rule.weight)))
        },

        async predict() {
            console.log(this.input_params)

            await this.predict_control()
            await this.predict_intervention()

            this.determine_base_rules()
            this.set_max_weight()

        }
    }

})
