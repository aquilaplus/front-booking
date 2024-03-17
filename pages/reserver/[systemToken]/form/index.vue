<template>
    <div class="col-12 m-auto" style="max-width: 100%; width: 600px">
        <div class="card p-3 border-0 overflow-hidden" style="transition: all 0.5s ease">
            <div class="row position-relative">
                <h2 class="fs-6 fw-bold text-center">{{ bookingStore.restaurantData.name }}</h2>

                <!-- Résumé de la réservation -->
                <div class="col-12 d-flex justify-content-between align-items-center mt-3">
                    <NuxtLink :to="'/reserver/' + route.params.systemToken +  '/'" class="d-flex align-items-center gap-1 text-decoration-none" style="max-width: max-content; cursor: pointer">
                        <i class="fas fa-chevron-left text-primary"></i>
                        <span class="fs-6 text-primary">Modifier</span>
                    </NuxtLink>


                    <div>
                        <i class="fas fa-fork-knife" style="font-size: 1rem"></i><span class="ms-1 fs-6">{{ bookingStore.form.customers }}</span>
                        <i class="far fa-calendar ms-3" style="font-size: 1rem"></i><span class="ms-2 fs-6">{{ bookingStore.form.date.toLocaleDateString('fr-FR', {month: 'numeric', day: 'numeric'}) }}</span>
                        <i class="far fa-clock ms-3" style="font-size: 1rem"></i><span class="ms-2 fs-6">{{ bookingStore.form.time.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) }}</span>
                    </div>
                </div>
                <!-- Résumé de la réservation -->

                <!-- Form -->
                <div class="col-12 my-4">
                    <h2 class="fs-5 fw-bold">Finaliser ma réservation</h2>
                    <template v-if="bookingStore.form.errors.length">
                        <div class="alert alert-danger" role="alert" v-for="error in bookingStore.form.errors">
                            {{ error }}
                        </div>
                    </template>
                    <form @submit.prevent method="post" class="row g-3">
                        <!-- Firstname & Lastname -->
                        <div class="col-md-6">
                            <label for="firstname" class="form-label fs-label">PRÉNOM</label>
                            <input type="text" class="form-control rounded-3" id="firstname" v-model="bookingStore.form.firstname">
                        </div>
                        <div class="col-md-6">
                            <label for="lastname" class="form-label fs-label">NOM</label>
                            <input type="text" class="form-control rounded-3" id="lastname" v-model="bookingStore.form.lastname">
                        </div>

                        <!-- Phone & Email -->
                        <div class="col-md-6">
                            <label for="phone" class="form-label fs-label">TÉLÉPHONE</label>
                            <input type="tel" class="form-control rounded-3" id="phone" placeholder="+33" v-model="bookingStore.form.phone">
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label fs-label">EMAIL</label>
                            <input type="email" class="form-control rounded-3" id="email" v-model="bookingStore.form.email">
                        </div>

                        <!-- Digifense -->
                        <div class="col-md-6 visually-hidden">
                            <label for="nameDigifense" class="form-label fs-label">NAMEDIGIFENSE</label>
                            <input type="text" class="form-control rounded-3" id="nameDigifense" v-model="bookingStore.form.nameDigifense">
                        </div>
                        <div class="col-md-6 visually-hidden">
                            <label for="emailDigifense" class="form-label fs-label">EMAILDIGIFENSE</label>
                            <input type="email" class="form-control rounded-3" id="emailDigifense" v-model="bookingStore.form.emailDigifense">
                        </div>

                        <!-- Comment -->
                        <div class="col-12">
                            <label for="comment" class="form-label fs-label">COMMENTAIRES, ALLERGIES ECT...</label>
                            <textarea class="form-control rounded-3" id="comment" rows="2" v-model="bookingStore.form.comment"></textarea>
                        </div>

                        <div class="col-12">
                            <button type="submit"
                                    class="btn btn-primary w-100 rounded-3 my-2"
                                    :class="{'disabled': !bookingStore.form.firstname || !bookingStore.form.lastname || !bookingStore.form.phone || !bookingStore.form.email}"
                                    @click="confirmBooking()">Valider la réservation
                            </button>
                        </div>
                    </form>
                </div>
                <!-- Form -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
const route = useRoute();

function confirmBooking() {
    bookingStore.checkForm();
    if (bookingStore.form.errors.length === 0) {
        bookingStore.postBooking();

        navigateTo('/reserver/' + route.params.systemToken + '/confirmation');
    }
}
</script>