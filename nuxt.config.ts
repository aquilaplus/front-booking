export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ['@pinia/nuxt', '@nuxt/image'],
    css: ['~/assets/styles/main.scss'],
    app: {
        head: {
            link: [
                {rel: 'stylesheet', href: 'https://cdn.digityser.com/fa6_2/css/all.min.css'},
            ]
        }
    }
})
