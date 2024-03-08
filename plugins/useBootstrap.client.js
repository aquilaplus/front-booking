import * as bootstrap from 'bootstrap'
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            bootstrap: bootstrap
        }
    }
})