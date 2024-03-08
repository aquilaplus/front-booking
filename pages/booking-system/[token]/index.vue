<template>
    <div class="container d-flex" style="height:100vh">
        <div class="row m-auto" :data-bs-theme="mode" style="max-width: 100%; width: 600px">
            <div class="col-12">
                <div class="card p-3 border-0 overflow-hidden" style="transition: all 0.5s ease">
                    <!-- Wizard Div -->
                    <div id="wizardDiv" v-show="bookingStore.currentStage === 'wizard'" class="row position-relative">
                        <div class="col-12 d-flex flex-column text-center">
                            <h2 class="fs-6 fw-bold">{{ bookingStore.restaurantData.name }}</h2>
                            <h3 class="fs-6 my-3">Pour toutes réservations de plus de 10 personnes, contactez-nous au <a :href="'tel:' + bookingStore.restaurantData.phone" class="text-primary text-decoration-none">{{ bookingStore.restaurantData.phone }}</a></h3>
                            <h3 class="fs-6">À très bientôt !</h3>
                        </div>

                        <div class="accordion accordion-flush px-0" id="accordionFlushExample" :data-bs-theme="mode">
                            <!-- Choix du nombre de clients -->
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                        <i class="fas fa-fork-knife" style="font-size: 1rem"></i>
                                        <span class="ms-2 fs-6">{{ customer }} couvert<span v-if="customer > 1">s</span></span>
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body d-flex flex-wrap gap-2">
                                        <div class="btn btn-primary btn-sm rounded-3 py-3 px-4 fw-bold"
                                             style="min-width: 4rem"
                                             @click="customerChoice(customer)"
                                             data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo"
                                             v-for="customer in customers">{{ customer }}
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
                                        <span class="ms-2 fs-6">{{ date.toLocaleDateString('fr-FR', {month: 'long', day: 'numeric'}) }}</span>
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
                                            :is-dark="mode === 'dark'"
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
                                            <span v-else>{{ time }}</span>
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
                            <button class="btn btn-primary w-100 rounded-3 my-2" :class="{disabled: !time}" @click="moveToForm">Réserver</button>
                        </div>
                    </div>
                    <!-- Wizard Div -->

                    <!-- Form Div -->
                    <div id="formDiv" v-show="bookingStore.currentStage === 'form'" class="row position-relative">
                        <h2 class="fs-6 fw-bold text-center">{{ bookingStore.restaurantData.name }}</h2>

                        <!-- Résumé de la réservation -->
                        <div class="col-12 d-flex justify-content-between align-items-center mt-3">
                            <div class="d-flex align-items-center gap-1" style="max-width: max-content" @click="moveToWizard">
                                <i class="fas fa-chevron-left text-primary"></i>
                                <span class="fs-6 text-primary">Modifier</span>
                            </div>

                            <div>
                                <i class="fas fa-fork-knife" style="font-size: 1rem"></i><span class="ms-1 fs-6">{{ bookingStore.form.customers }}</span>
                                <i class="far fa-calendar ms-3" style="font-size: 1rem"></i><span class="ms-2 fs-6">{{ bookingStore.form.date.toLocaleDateString('fr-FR', {month: 'numeric', day: 'numeric'}) }}</span>
                                <i class="far fa-clock ms-3" style="font-size: 1rem"></i><span class="ms-2 fs-6">{{ bookingStore.form.time }}</span>
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
                    <!-- Form Div -->

                    <!-- Confirmation Div -->
                    <div id="confirmationDiv" v-show="bookingStore.currentStage === 'confirmation'" class="row position-relative">
                        <div class="col-12">
                            <div class="text-center">
                                <i class="fas fa-circle-check fa-4x my-3 text-success"></i>
                                <h2 class="fs-5 fw-bold text-success">Réservation envoyé</h2>
                                <p class="fw-bold" v-if="!bookingStore.restaurantData.autoConfirm">Vous recevrez un mail de confirmation prochainement</p>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="card p-3 border-0">
                                        <h6 class="fs-6 fw-bold">Informations de réservation</h6>
                                        <ul class="list-group">
                                            <li class="list-group-item fs-6"><i class="far fa-calendar me-2"></i>Le {{ date.toLocaleDateString('fr-FR', {month: 'numeric', day: 'numeric'}) }} à {{ time }}</li>
                                            <li class="list-group-item fs-6"><i class="fas fa-fork-knife me-2"></i>Pour {{ customer }} couvert<span v-if="customer > 1">s</span></li>
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
                    <!-- Confirmation Div -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
const color = ref(bookingStore.restaurantData.color);
const mode = ref('light');

let wizardElement = HTMLElement;
let formElement = HTMLElement;
let confirmationElement = HTMLElement;

const customers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const customer = ref(2);
const date = ref(new Date());
const time = ref(new Date());
const timeSelected = ref(false);

const customerChoice = (customerForm: number) => {
    customer.value = customerForm;
};
const timeChoice = (hour: string) => {
    time.value = hour;
    timeSelected.value = true;
};

const checkHour = (hour: string) => {
    if (bookingStore.form.date.getDate() === new Date().getDate()) {
        return new Date().getHours().toString() + ':' + new Date().getMinutes().toString() < hour;
    } else {
        return true;
    }
};

function confirmBooking() {
    bookingStore.checkForm();
    if (bookingStore.form.errors.length === 0) {
        bookingStore.postBooking();
        moveToConfirmation();
    }
}

onMounted(() => {
    wizardElement = document.getElementById('wizardDiv');
    formElement = document.getElementById('formDiv');
    confirmationElement = document.getElementById('confirmationDiv');
});

const moveToForm = () => {
    bookingStore.form.customers = customer.value;
    bookingStore.form.date = date.value;
    bookingStore.form.time = time.value;

    wizardElement.style.animation = 'slide-out-left 0.5s ease-in-out';
    setTimeout(() => {
        bookingStore.currentStage = 'form';
        formElement.style.animation = 'slide-in-right 0.5s ease-in-out';
    }, 500);
};
const moveToWizard = () => {
    formElement.style.animation = 'slide-out-right 0.5s ease-in-out';
    setTimeout(() => {
        bookingStore.currentStage = 'wizard';
        wizardElement.style.animation = 'slide-in-left 0.5s ease-in-out';
    }, 500);
};
const moveToConfirmation = () => {
    formElement.style.animation = 'slide-out-left 0.5s ease-in-out';
    setTimeout(() => {
        bookingStore.currentStage = 'confirmation';
        confirmationElement.style.animation = 'slide-in-right 0.5s ease-in-out';
    }, 500);
};
</script>

<style lang="scss">
.text-primary {
    color: v-bind(color) !important;
}

.btn-primary {
    --bs-btn-bg: v-bind(color);
    --bs-btn-border-color: v-bind(color);

    --bs-btn-hover-bg: v-bind(color);
    --bs-btn-hover-border-color: white;

    --bs-btn-active-bg: v-bind(color);
    --bs-btn-active-border-color: transparent;
}

.btn.disabled {
    background-color: v-bind(color);
    border-color: v-bind(color);
    opacity: 0.5;
}

.vc-dark .vc-attr, .vc-light .vc-attr {
    --vc-highlight-solid-bg: v-bind(color);
}

.vc-dark, .vc-light {
    --vc-focus-ring: 0 0 0 2px v-bind(color);
}

.vc-nav-item.is-active {
    background-color: v-bind(color);
}

.vc-nav-item.is-current {
    color: v-bind(color);
}

.accordion-button:not(.collapsed), .accordion-button:focus {
    color: v-bind(color);
    background-color: transparent;
    box-shadow: unset;
}

[data-bs-theme=dark] .accordion-button::after {
    --bs-accordion-btn-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
    --bs-accordion-btn-active-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");

}

.fs-label {
    font-size: 0.7rem;
}

.form-control, .accordion-button, .accordion-item, .vc-container {
    transition: all 0.5s ease;
}

@keyframes slide-out-left {
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
}

@keyframes slide-in-right {
    0% {
        opacity: 0;
        transform: translateX(100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slide-out-right {
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(100%);
    }
}

@keyframes slide-in-left {
    0% {
        opacity: 0;
        transform: translateX(-100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>