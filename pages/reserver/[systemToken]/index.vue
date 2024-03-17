<template>
    <div class="col-12 m-auto" style="max-width: 100%; width: 600px">
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
                                <span class="ms-2 fs-6">{{ bookingStore.form.date.toLocaleDateString('fr-FR', {month: 'long', day: 'numeric'}) }}</span>
                            </button>
                        </h2>
                        <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                                <VDatePicker
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
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                <i class="far fa-clock" style="font-size: 1rem"></i>
                                <span class="ms-2 fs-6">
                                            <span v-if="!timeSelected">Horaire</span>
                                            <span v-else>{{ bookingStore.form.time.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) }}</span>
                                        </span>
                            </button>
                        </h2>

                        <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="row accordion-body overflow-auto" style="max-height: 300px">
                                <div class="col-12 d-flex align-items-center flex-column gap-1 mb-5">
                                    <template v-if="checkHour(bookingStore.afternoonHours[bookingStore.afternoonHours.length - 1])">
                                        <h6 class="fw-bold">Journée</h6>
                                        <div class="row text-center mb-4">
                                            <template v-for="hour in bookingStore.afternoonHours">
                                                <div class="col-4 mb-3">
                                                    <div class="btn btn-primary btn-sm rounded-3 px-3 py-2 fs-6 fw-bold"
                                                         @click="timeChoice(hour)"
                                                         data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                                         v-if="checkHour(hour)">
                                                        {{ hour }}
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </template>

                                    <h6 class="fw-bold" v-if="checkHour(bookingStore.eveningHours[bookingStore.eveningHours.length - 1])">Soirée</h6>
                                    <div class="row text-center">
                                        <template v-for="hour in bookingStore.eveningHours">
                                            <div class="col-4 mb-3">
                                                <div class="btn btn-primary btn-sm rounded-3 px-3 py-2 fs-6 fw-bold"
                                                     @click="timeChoice(hour)"
                                                     data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                                     v-if="checkHour(hour)">
                                                    {{ hour }}
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Choix de l'heure -->
                </div>

                <div class="col-12">
                    <NuxtLink :to="'/reserver/' + route.params.systemToken +  '/form'" class="btn btn-primary w-100 rounded-3 my-2" :class="{disabled: !timeSelected}">Réserver</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
const route = useRoute();

const timeSelected = ref(false);

const customerChoice = (customerForm: number) => {
    bookingStore.form.customers = customerForm;
};

const checkHour = (hour: string) => {
    if (bookingStore.form.date.getDate() === new Date().getDate()) {
        return new Date().getHours().toString() + ':' + new Date().getMinutes().toString() < hour;
    } else {
        return true;
    }
};

const timeChoice = (hour: string) => {
    bookingStore.form.time = new Date();
    bookingStore.form.time.setHours(parseInt(hour.split(':')[0]));
    bookingStore.form.time.setMinutes(parseInt(hour.split(':')[1]));
    timeSelected.value = true;
};
</script>