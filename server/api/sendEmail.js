import {defineEventHandler, readBody} from 'h3'
import {ServerClient} from 'postmark'

const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY);

export default defineEventHandler(async (event) => {
    const {restaurantData, bookingData} = await readBody(event);

    const dateFormatted = new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(bookingData.date));
    const timeFormatted = new Intl.DateTimeFormat('fr-FR', {hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC'}).format(new Date(bookingData.time));

    let htmlBody = "";
    if (restaurantData.clientConfirm) {
        htmlBody = `
        <html lang="fr">
            <body>
                <h1>Réservation chez ${restaurantData.name}</h1>
                <p>Bonjour ${bookingData.firstname} ${bookingData.lastname},</p>
                <p>Vous avez réservé une table pour ${bookingData.customers} personnes le ${dateFormatted} à ${timeFormatted}.</p>
                <p>Adresse du restaurant : ${restaurantData.localisationLink}</p>
                <hr>
                <p>Pour valider votre réservation, veuillez cliquer le lien ci-dessous.</p>
                <a href="https://booking.digichef.io/reserver/${restaurantData.token}/ma-reservation/${bookingData.token}">Valider ma réservation</a>
            </body>
        </html>
    `;
    } else if (restaurantData.restaurantConfirm) {
        htmlBody = ` 
        <html lang="fr"> 
            <body>
                <h1>Réservation chez ${restaurantData.name}</h1>
                <p>Bonjour ${bookingData.firstname} ${bookingData.lastname},</p>
                <p>Vous avez réservé une table pour ${bookingData.customers} personnes le ${dateFormatted} à ${timeFormatted}.</p>
                <p>Adresse du restaurant : ${restaurantData.localisationLink}</p>
                <hr>
                <p>Votre réservation est en attente de validation par le restaurant.</p>
                <p>Vous recevrez un email de confirmation dès que votre réservation sera validée.</p>
                <a href="https://booking.digichef.io/reserver/${restaurantData.token}/ma-reservation/${bookingData.token}">Voir ma réservation</a>
            </body>
        </html>
    `;
    } else {
        htmlBody = `
        <html lang="fr">
            <body>
                <h1>Confirmation de votre réservation chez ${restaurantData.name}</h1>
                <p>Bonjour ${bookingData.firstname} ${bookingData.lastname},</p>
                <p>Votre réservation a bien été enregistrée.</p>
                <p>Vous avez réservé une table pour ${bookingData.customers} personnes le ${dateFormatted} à ${timeFormatted}.</p>
                <p>Adresse du restaurant : ${restaurantData.localisationLink}</p>
                <hr>
                <a href="https://booking.digichef.io/reserver/${restaurantData.token}/ma-reservation/${bookingData.token}">Voir ma réservation</a>
                <p>Merci pour votre réservation. Nous avons hâte de vous accueillir !</p>
            </body>
        </html>
    `;
    }

    try {
        const response = await postmarkClient.sendEmail({
            From: `${restaurantData.name}_noreply@digityser.com`,
            To: bookingData.email,
            Subject: 'Confirmation de votre réservation',
            HtmlBody: htmlBody
        });

        return {success: true, message: 'Message envoyé !', response};
    } catch (error) {
        return {success: false, message: 'Échec de l\'envoie du message...', error};
    }
})
