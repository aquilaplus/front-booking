// @ts-ignore
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'
import {defineNuxtPlugin} from '#app'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('bs', bootstrap);
})