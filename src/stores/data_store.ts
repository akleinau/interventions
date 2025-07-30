import {defineStore} from 'pinia'
import {type Rule, type Prediction} from "../interfaces.ts"

export const useDataStore = defineStore({
    id: 'data',
    state: () => ({
        address: "https://pred.hbcptools.org/api/" as string,
        //address: "http://localhost:5000/" as string,
        input_params: {} as { [key: string]: any },
        input_interventions: {} as { [key: string]: any },
        input_spec: {} as { [key: string]: any },
        prediction: {} as Prediction,
        control_prediction: {} as Prediction,
        base_prediction: {} as Prediction,
        base_rule_strings: [] as string[],
        base: 0 as number,
        stored_predictions: [] as Prediction[],
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

        // main prediction function communicating with the backend
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
            }) as Rule[]

            // sort rules by weight
            rules_cleaned.sort((a: any, b: any) => {
                return Math.abs(b.weight) - Math.abs(a.weight)
            })



            return {value: response.fit, rules: rules_cleaned}
        },

        async predict_control() {

            let response = await this.predict_group(this.input_params)
            console.log(response)

            this.control_prediction = response
        },

        async predict_random_intervention() {

            // first get some random intervention
            let first_intervention = this.input_spec.interventions[0]
            // then get first choice and set it as value
            let first_choice = first_intervention.choices[0]
            let random_intervention = {} as { [key: string]: any }
            random_intervention[first_intervention.id] = [first_choice]


            // combine input_params and input_interventions
            let combined_input = {...this.input_params, ...random_intervention}

            return await this.predict_group(combined_input)
        },

        async predict_intervention() {

            // combine input_params and input_interventions
            let combined_input = {...this.input_params, ...this.input_interventions}

            console.log("Combined input for intervention prediction:", combined_input)

            let response = await this.predict_group(combined_input)

            this.set_if_rules_are_new(response)

            console.log("Intervention prediction response:", response)

            this.prediction = response
        },

        async determine_base_rules() {

            let random_intervention =  await this.predict_random_intervention()

            // determine base value
            let pure_prediction = this.control_prediction.rules.reduce((acc: number, curr: any) => {
                return acc + +curr.weight
            }, 0)
            this.base = this.control_prediction.value - pure_prediction

            // get rules in all rule sets
            let base_rules = [] as Rule[]
            this.base_rule_strings = [] as string[]
            this.control_prediction.rules.forEach((rule: any) => {
                if (random_intervention.rules.find((r: any) => r.string === rule.string) !== undefined) {
                    base_rules.push(rule)
                    this.base_rule_strings.push(rule.string)
                }
            })

            let prediction = base_rules.reduce((acc: number, curr: any) => {
                return acc + +curr.weight
            }, this.base)
            this.base_prediction = {rules: base_rules, value: prediction} as Prediction

            this.set_if_rules_are_new(this.control_prediction)

        },

        set_if_rules_are_new(prediction: Prediction) {
            // set for each rule of each rule set, if it is "new" aka not in the base rule set
            prediction.rules.forEach((rule: any) => {
                rule.new = !this.base_rule_strings.includes(rule.string)
            })
        },

        set_max_weight() {
            // get max weight of both rule sets
            this.max_weight = Math.max(...this.control_prediction.rules.map((rule: any) => Math.abs(rule.weight)),
                                        ...this.base_prediction.rules.map((rule: any) => Math.abs(rule.weight)),
                                                ...this.prediction.rules.map((rule: any) => Math.abs(rule.weight)))
        },

        async parameter_predict() {
            console.log(this.input_params)

            await this.predict_control()

            await this.determine_base_rules()

            this.prediction = this.control_prediction
            this.set_max_weight()
        },

        async predict() {
            console.log(this.input_params)

            await this.predict_intervention()

            this.set_max_weight()

        }
    }

})
