import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import {useNuxtApp} from "#app";

export default defineNuxtPlugin(() => {
    useNuxtApp().vueApp.use(VCalendar, {})
})