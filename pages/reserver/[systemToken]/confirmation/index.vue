<template>
    <div class="col-12 m-auto" v-if="bookingStore.form.date">
        <div class="card p-3 border-0 overflow-hidden" style="transition: all 0.5s ease">
            <div class="row position-relative">
                <div class="col-12">
                    <div class="text-center">
                        <i class="fas fa-circle-check fa-4x my-3 text-success"></i>
                        <h2 class="fs-5 fw-bold text-success">Réservation enregistrée</h2>
                        <p class="fw-bold">Un mail à été envoyé</p>
                    </div>

                    <div class="row d-flex justify-content-center">
                        <div class="col-md-7">
                            <div class="card p-3 border-0">
                                <h6 class="fs-6 fw-bold">Informations de réservation</h6>
                                <ul class="list-group">
                                    <li class="list-group-item fs-6"><i class="far fa-calendar me-2"></i>Le {{ bookingStore.form.date.toLocaleDateString('fr-FR', {month: 'numeric', day: 'numeric'}) }} à {{ bookingStore.form.time.getUTCHours().toString().padStart(2, '0') }}:{{ bookingStore.form.time.getMinutes().toString().padStart(2, '0') }}</li>
                                    <li class="list-group-item fs-6"><i class="fas fa-fork-knife me-2"></i>Pour {{ bookingStore.form.customers }} couvert<span v-if="bookingStore.form.customers > 1">s</span></li>
                                </ul>

                                <h6 class="fs-6 fw-bold mt-3">Informations personnelles</h6>
                                <ul class="list-group">
                                    <li class="list-group-item fs-6"><i class="fas fa-user me-2"></i>{{ bookingStore.form.firstname }} {{ bookingStore.form.lastname }}</li>
                                    <li class="list-group-item fs-6"><i class="fas fa-phone me-2"></i>{{ bookingStore.form.phone }}</li>
                                    <li class="list-group-item fs-6"><i class="fas fa-envelope me-2"></i>{{ bookingStore.form.email }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
const route = useRoute();

if (!bookingStore.form.date) {
    navigateTo('/reserver/' + route.params.systemToken + '/');
}
</script>
