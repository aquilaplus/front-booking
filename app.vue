<template>
    <NuxtPage v-if="bookingStore.restaurantData"/>
</template>

<script setup>
import {useBookingStore} from "~/stores";

const bookingStore = useBookingStore();
await bookingStore.getData();
</script>