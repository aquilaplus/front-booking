<template>
    <div class="col-12 position-relative" v-if="customerData">
        <div class="row ">
            <!-- Statut de la réservation -->
            <div class="col-12 d-flex justify-content-center align-items-center p-0">
                <div class="banner w-100">
                    <div class="overlay w-100"></div>
                </div>
                <a :href="restaurantData.localisationLink" target="_blank" class="position-absolute text-light itinerary"><i class="fa-regular fa-share m-auto me-2"></i>Itinéraire</a>
                <a :href="'tel:'+restaurantData.phone" class="position-absolute text-light phone"><i class="fa-solid fa-phone m-auto me-2"></i>Telephone</a>

                <h1 class="position-absolute text-light" style="font-size: 3rem; margin-top: -30px;font-family: Verdana,sans-serif">{{ restaurantData.name }}</h1>
                <div class="position-absolute d-flex bg-white border border-5 rounded-circle shadow"
                     :class="[`border-${bookingStatus.color}`]"
                     style="margin-bottom: -190px; width: 130px; height: 130px">
                    <i class="fa-5x m-auto" :class="[bookingStatus.icon, `text-${bookingStatus.color}`]"></i>
                </div>
            </div>
            <div class="col-12 mt-4 text-center">
                <p class="fw-bold fs-5 m-0" :class="[`text-${bookingStatus.color}`]">{{ bookingStatus.name }}</p>
            </div>
            <!-- Statut de la réservation -->

            <!-- Détails de la réservation -->
            <div class="col-12 mt-5 text-center animate__animated animate__fadeIn">
                <div class="row">
                    <div class="col-md-7 mx-auto" style="max-width: 400px">
                        <div class="card border-0">
                            <h6 class="fs-6 fw-bold">Informations de réservation</h6>
                            <ul class="list-group text-start">
                                <li class="list-group-item fs-6"><i class="far fa-calendar me-2"></i>Le {{ dateFormat(customerData.date) }} à {{ timeFormat(customerData.time) }}</li>
                                <li class="list-group-item fs-6"><i class="fas fa-fork-knife me-2"></i>Pour {{ customerData.customers }} couvert<span v-if="customerData.customers > 1">s</span></li>
                            </ul>

                            <h6 class="fs-6 fw-bold mt-3">Informations personnelles</h6>
                            <ul class="list-group text-start">
                                <li class="list-group-item fs-6"><i class="fas fa-user me-2"></i>{{ customerData.firstname }} {{ customerData.lastname }}</li>
                                <li class="list-group-item fs-6"><i class="fas fa-phone me-2"></i>{{ customerData.phone }}</li>
                                <li class="list-group-item fs-6"><i class="fas fa-envelope me-2"></i>{{ customerData.email }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Détails de la réservation -->

            <!-- Annulation -->
            <div class="col-12 mb-4 mt-5 text-center" v-if="!['cancel_client', 'cancel_restaurant', 'no_show'].includes(bookingStatus.slug)">
                <button class="btn btn-danger btn-sm rounded-3" data-bs-toggle="modal" data-bs-target="#cancelModal">Annuler</button>
            </div>

            <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="modal-title" style="font-size: 0.9rem" id="cancelModal">Êtes-vous sûr d'annuler votre réservation ?</p>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body d-flex justify-content-around">
                            <a href="" class="btn btn-danger btn-sm rounded-3" data-bs-dismiss="modal" @click="bookingStore.cancelBooking()">Oui</a>
                            <a href="" class="btn btn-secondary btn-sm rounded-3" data-bs-dismiss="modal">Non</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Annulation -->
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
await bookingStore.getBooking();

const restaurantData = computed(() => bookingStore.restaurantData);
const customerData = computed(() => bookingStore.customerData)
const bookingStatus = computed(() => customerData.value.bookingStatus);

const timeFormat = (time: Date) => {
    return new Date(time).getUTCHours().toString().padStart(2, '0') + ':' + new Date(time).getUTCMinutes().toString().padStart(2, '0');
}
const dateFormat = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {month: 'numeric', day: 'numeric'});
}
</script>

<style>
.container {
    //background-color: v-bind(color);
}

.banner {
    //background-image: url("./assets/restaurant-3-62a74e1f1b45e874524234.jpg");
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 300px;
    clip-path: circle(150% at 50% -88%);
}

.overlay {
    min-height: 300px;
    clip-path: circle(150% at 50% -88%);
    background-color: rgba(0, 0, 0, .55)
}

.itinerary {
    text-decoration: none;
    font-size: 1rem;
    padding: 14px;
    top: 0;
    right: 0;
    border-bottom-left-radius: 10px;
    background-color: black;
}

.phone {
    text-decoration: none;
    font-size: 1rem;
    padding: 14px;
    top: 0;
    left: 0;
    border-bottom-right-radius: 10px;
    background-color: black;
}
</style>