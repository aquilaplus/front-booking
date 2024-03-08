import {defineStore} from "pinia";
// @ts-ignore
import {v4 as uuidv4} from "uuid";

export const useBookingStore = defineStore("booking", {
    state: () => ({
        // url: 'http://localhost:8000',
        url: 'https://platform-v2.digityser.com',
        currentStage: 'wizard',
        restaurantData: {
            id: '',
            name: '',
            description: '',
            email: '',
            phone: '',
            localisationLink: '',
            color: '',
            logoName: '',
            needConfirm: false,
            autoConfirm: false,
        },
        customerData: {
            token: '',
            firstname: '',
            lastname: '',
            phone: '',
            email: '',
            comment: '',
            customers: 0,
            date: new Date(),
            time: '',
            bookingStatus: {
                id: 1,
                name: '',
                slug: '',
                icon: '',
                color: '',
            },
        },
        form: {
            firstname: '',
            lastname: '',
            phone: '',
            email: '',
            comment: '',
            customers: 0,
            date: new Date(),
            time: '',
            errors: [] as string[],
            nameDigifense: null,
            emailDigifense: null,
        },
        afternoonHours: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
        eveningHours: ['15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'],
    }),

    actions: {
        // Get the data for the booking system.
        async getData() {
            try {
                const route = useRoute();
                const dataFetch = useFetch(this.url + '/api/booking_systems/' + route.params.token + '.json');
                await dataFetch.execute();
                // @ts-ignore
                this.restaurantData = dataFetch.data ? dataFetch.data : null;
            } catch (err) {
                throw err;
            }
        },

        // Get the data of the client reservation.
        async getBooking() {
            try {
                const route = useRoute();
                const bookingFetch = useFetch(this.url + '/api/bookings/' + route.params.token + '.json')
                await bookingFetch.execute();
                // @ts-ignore
                this.customerData = bookingFetch.data ? bookingFetch.data : null;
            } catch (err) {
                throw err;
            }
        },

        // Create a new reservation for the restaurant.
        async postBooking() {
            const route = useRoute();
            if (!this.form.nameDigifense || !this.form.emailDigifense) {
                if (this.checkForm()) {
                    if (this.restaurantData.autoConfirm) {
                        this.customerData.bookingStatus.id = 2;
                    }
                    try {
                        const customerPost = await useFetch(this.url + '/api/bookings', {
                            method: 'POST',
                            body: JSON.stringify({
                                token: uuidv4(),
                                firstname: this.form.firstname,
                                lastname: this.form.lastname,
                                phone: this.form.phone,
                                email: this.form.email,
                                customers: this.form.customers,
                                comment: this.form.comment,
                                date: this.form.date,
                                time: this.form.time,
                                bookingStatus: this.url + '/api/booking_statuses/' + this.customerData.bookingStatus.id,
                                bookingSystem: this.url + '/api/booking_systems/' + route.params.token,
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        });
                        // @ts-ignore
                        this.customerData = customerPost.data;
                    } catch (err) {
                        throw err;
                    }
                }
            }
        },

        // Cancel a reservation for the restaurant.
        async cancelBooking() {
            try {
                await useFetch(this.url + '/api/bookings/' + this.customerData.token, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        bookingStatus: this.url + '/api/booking_statuses/' + 3,
                    }),
                    headers: {
                        'Content-type': 'application/merge-patch+json; charset=UTF-8',
                    },
                });
                await this.getBooking();
            } catch (err) {
                throw err;
            }
        },

        // Check the form.
        checkForm() {
            this.form.errors = [];

            if (!this.form.firstname) {
                this.form.errors.push('Prénom requis.');
            } else if (!this.form.lastname) {
                this.form.errors.push('Nom requis.');
            } else if (!this.form.phone) {
                this.form.errors.push('Téléphone requis.');
            } else if (!this.validTel(this.form.phone)) {
                this.form.errors.push('Téléphone valide requis.');
            } else if (!this.form.email) {
                this.form.errors.push('Email requis.');
            } else if (!this.validEmail(this.form.email)) {
                this.form.errors.push('Email valide requis');
            } else if (!this.form.date) {
                this.form.errors.push('Date requise.');
            } else if (!this.form.time) {
                this.form.errors.push('Heure requise.');
            } else {
                return true;
            }
        },

        // Check the email input.
        validEmail(email: string) {
            let re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        // Check the tel input.
        validTel(tel: string) {
            let re = /^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
            return re.test(tel)
        },
    }
});