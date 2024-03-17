<template>
    <NuxtLayout>
        <NuxtPage v-if="bookingStore.restaurantData && bookingStore.loaded"/>
    </NuxtLayout>
</template>

<script setup>
import {onMounted} from 'vue';
import {useBookingStore} from "~/stores";

const bookingStore = useBookingStore();

onMounted(async () => {
    if (window.location.hostname === 'localhost') {
        bookingStore.apiUrl = 'https://localhost:8000';
    }

    await bookingStore.getData();
    document.documentElement.style.setProperty('--custom-color', bookingStore.restaurantData.color);
});
</script>

<style>
:root {
    --custom-color: #000;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.5s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateY(3rem);
}
</style>
