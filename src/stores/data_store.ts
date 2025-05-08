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

        }
    }

})
