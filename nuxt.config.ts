export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ['@pinia/nuxt', '@nuxt/image'],
    css: ['bootstrap/dist/css/bootstrap.min.css'],
    app: {
        pageTransition: {name: 'page', mode: 'out-in'},
        head: {
            link: [
                {rel: 'stylesheet', href: 'https://cdn.digityser.com/fa6_2/css/all.min.css'},
            ]
        }
    }
})
