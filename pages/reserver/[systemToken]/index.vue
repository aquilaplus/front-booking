<template>
    <div class="col-12 m-auto">
        <div class="card p-3 border-0 overflow-hidden" style="transition: all 0.5s ease">
            <div class="row position-relative">
                <div class="col-12 d-flex flex-column text-center">
                    <h2 class="fs-6 fw-bold">{{ bookingStore.restaurantData.name }}</h2>
                    <h3 class="fs-6 my-3">Pour toutes réservations de plus de 10 personnes, contactez-nous au <a :href="'tel:' + bookingStore.restaurantData.phone" class="text-primary text-decoration-none">{{ bookingStore.restaurantData.phone }}</a></h3>
                    <h3 class="fs-6">À très bientôt !</h3>
                </div>

                <div class="accordion accordion-flush px-0" id="accordionFlushExample" :data-bs-theme="bookingStore.mode">
                    <!-- Choix du nombre de clients -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                <i class="fas fa-fork-knife" style="font-size: 1rem"></i>
                                <span class="ms-2 fs-6">{{ bookingStore.form.customers }} couvert<span v-if="bookingStore.form.customers > 1">s</span></span>
                            </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body d-flex flex-wrap gap-2">
                                <div class="btn btn-primary btn-sm rounded-3 py-3 px-4 fw-bold"
                                     style="min-width: 4rem"
                                     @click="customerChoice(customer)"
                                     data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo"
                                     v-for="customer in bookingStore.customers">{{ customer }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Choix du nombre de clients -->

                    <!-- Choix de la date -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                <i class="far fa-calendar" style="font-size: 1rem"></i>
                                <span class="ms-2 fs-6" v-if="bookingStore.form.date">{{ bookingStore.form.date.toLocaleDateString('fr-FR', {month: 'long', day: 'numeric'}) }}</span>
                                <span class="ms-2 fs-6" v-else>Date de réservation</span>
                            </button>
                        </h2>
                        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                                <VDatePicker
                                    :attributes="attributes"
                                    :timezone="'UTC'"
                                    :disabled-dates="disabledDays"
                                    v-model="bookingStore.form.date"
                                    mode="date"
                                    expanded
                                    borderless
                                    title-position="left"
                                    :min-date="new Date()"
                                    :is-dark="bookingStore.mode === 'dark'"
                                />
                            </div>
                        </div>
                    </div>
                    <!-- Choix de la date -->

                    <!-- Choix de l'heure -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button"
                                    ref="accordionCollapse" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                    aria-expanded="false" aria-controls="flush-collapseThree"
                            >
                                <i class="far fa-clock" style="font-size: 1rem"></i>
                                <span class="ms-2 fs-6">
                                    <span v-if="bookingStore.form.time">{{ bookingStore.form.time.getUTCHours().toString().padStart(2, '0') }}:{{ bookingStore.form.time.getMinutes().toString().padStart(2, '0') }}</span>
                                    <span v-else>Horaire</span>
                                </span>
                            </button>
                        </h2>

                        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="row accordion-body overflow-auto" style="max-height: 300px">
                                <div class="col-12 d-flex align-items-center flex-column gap-1 mb-5">
                                    <div class="row text-center mb-4">
                                        <template v-if="bookingStore.form.date && updateHours(bookingStore.form.date)">
                                            <template v-for="bookingService in updateHours(bookingStore.form.date).bookingServices">
                                                <h6 class="fw-bold">{{ bookingService.name }}</h6>
                                                <template v-for="hourSlot in bookingService.bookingHours">
                                                    <template v-if="checkHour(hourSlot.hour)">
                                                        <div class="col-4 mb-3">
                                                            <div class="btn btn-primary btn-sm rounded-3 px-3 py-2 fs-6 fw-bold"
                                                                 @click="timeChoice(hourSlot.hour)"
                                                                 data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                                                 v-if="checkHour(hourSlot.hour)">
                                                                {{ hourSlot.hour }}
                                                            </div>
                                                        </div>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <h6 class="fw-bold">Aucun créneaux disponible</h6>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Choix de l'heure -->
                </div>

                <div class="col-12">
                    <NuxtLink :to="'/reserver/' + route.params.systemToken +  '/form'" class="btn btn-primary w-100 rounded-3 my-2" :class="{disabled: !bookingStore.form.date || !bookingStore.form.time}">Réserver</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useBookingStore} from '~/stores';

const {$bs} = useNuxtApp();
const route = useRoute();
const bookingStore = useBookingStore();
const systemDays = bookingStore.restaurantData.bookingSystemDays;
const systemCustomDays = bookingStore.restaurantData.bookingSystemCustomDays;

// VCalendar //
const customDays = ref([]);
const disabledDays = ref<Array<Date>>([]);
const availableDays = ref<Array<Date>>([]);
const attributes = ref([
    {
        content: 'red',
        dates: {
            repeat: {weekdays: disabledDays},
        },
        order: 1,
    },
    {
        content: 'green',
        dates: {
            repeat: {weekdays: availableDays},
        },
        order: 2,
    },
    {
        content: 'green',
        dates: customDays,
        order: 3,
    },
    {
        dot: 'blue',
        dates: new Date(),
        order: 4,
    }
]);
// VCalendar //

// Time selection //
const currentDay = ref();
// Time selection //

const customerChoice = (customerForm: number) => {
    bookingStore.form.customers = customerForm;
};
const checkHour = (hour: string) => {
    if (bookingStore.form.date && bookingStore.form.date.getDate() === new Date().getDate()) {
        return new Date().getHours().toString() + ':' + new Date().getMinutes().toString() < hour;
    } else {
        return true;
    }
};
const timeChoice = (hour: string) => {
    bookingStore.form.time = new Date();
    bookingStore.form.time.setUTCHours(parseInt(hour.split(':')[0]));
    bookingStore.form.time.setUTCMinutes(parseInt(hour.split(':')[1]));
};
const toggleCollapse = () => {
    try {
        const accordion = new $bs.Collapse('#flush-collapseThree', {toggle: true});
    } catch (e) {
        // console.error(e); FIX THIS
    }
};

function updateDates() {
    const dayMapping = {
        sunday: 1,
        monday: 2,
        tuesday: 3,
        wednesday: 4,
        thursday: 5,
        friday: 6,
        saturday: 7,
    }

    for (let i = 0; i < systemDays.length; i++) {
        if (!systemDays[i].isActive) {
            const dayNumber = dayMapping[systemDays[i].slug];
            if (dayNumber) {
                disabledDays.value.push(dayNumber);
            }
        } else {
            const dayNumber = dayMapping[systemDays[i].slug];
            if (dayNumber) {
                availableDays.value.push(dayNumber);
            }
        }
    }

    for (let i = 0; i < systemCustomDays.length; i++) {
        if (systemCustomDays[i].isActive) {
            customDays.value.push(systemCustomDays[i].date);
        }
    }
}

function updateHours(date: Date) {
    if (date) {
        const dayName = date.toLocaleDateString("en-US", {weekday: "long"}).toLowerCase(); // monday, tuesday, etc.
        const systemCustomDay = systemCustomDays.find(day => new Date(day.date).toLocaleDateString() === date.toLocaleDateString() && day.isActive);

        if (systemCustomDay) {
            toggleCollapse();
            currentDay.value = systemCustomDay;
            return systemCustomDay;
        } else if (systemDays.find(day => day.slug === dayName && day.isActive)) {
            toggleCollapse();
            currentDay.value = systemDays.find(day => day.slug === dayName);
            return systemDays.find(day => day.slug === dayName);
        } else {
            bookingStore.form.date = null;
            bookingStore.form.time = null;
        }
    }
}

updateDates();
</script>