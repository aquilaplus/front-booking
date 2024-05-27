<template>
    <div class="container" style="max-width: 100vw; width: 600px">
        <div class="row" :data-bs-theme="bookingStore.mode">
            <slot/>
        </div>
    </div>
</template>

<script setup>
import {useBookingStore} from '~/stores';

const bookingStore = useBookingStore();
</script>

<style lang="scss">
.text-primary {
    color: var(--custom-color) !important;
}

.btn-primary {
    --bs-btn-bg: var(--custom-color);
    --bs-btn-border-color: var(--custom-color);

    --bs-btn-hover-bg: var(--custom-color);
    --bs-btn-hover-border-color: white;

    --bs-btn-active-bg: var(--custom-color);
    --bs-btn-active-border-color: transparent;
}

.btn.disabled {
    background-color: var(--custom-color);
    border-color: var(--custom-color);
    opacity: 0.5;
}

.vc-dark .vc-attr, .vc-light .vc-attr {
    --vc-highlight-solid-bg: #d0d0d0;
}

.vc-dark, .vc-light {
    --vc-focus-ring: 0 0 0 2px #d2d2d2;
}

.vc-nav-item.is-active {
    background-color: var(--custom-color);
}

.vc-nav-item.is-current {
    color: var(--custom-color);
}

.accordion-button:not(.collapsed), .accordion-button:focus {
    color: var(--custom-color);
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