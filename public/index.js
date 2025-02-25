import { giorno_iniziale, createTable, createBookButton, createSpecialtyTabs, createMiddleware, createForm, crea_lista_diz, Booking } from './componenti.js';

// Bottoni per le settimane precedenti e successive
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva");

// Funzione per aggiornare la tabella con i giorni della settimana precedente
precedente.onclick = () => {
    console.log(giorno);
    giorno.setDate(giorno.getDate() - 7);
    table.creaheader(giorno);
    table.crea(lista_diz, hours, giorno);
};

// Funzione per aggiornare la tabella con i giorni della settimana successiva
successivo.onclick = () => {
    giorno.setDate(giorno.getDate() + 7);
    table.creaheader(giorno);
    table.crea(lista_diz, hours, giorno);
};


let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale();
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
lista_diz=crea_lista_diz([])
table.build( ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
let lunedi = giorno_iniziale()
table.creaheader(lunedi);
table.crea(lista_diz, hours,lunedi);

// Creazione dei tab di specialità
let specialtyTabs;
let chiave;
// Creazione dei tab di specialità e del bottone di prenota
specialtyTabs = createSpecialtyTabs(document.getElementById("specialty-tabs"), config.tipologie);
const bookButton = createBookButton(document.getElementById("controls"));
specialtyTabs.render();
bookButton.render();

const form = createForm(document.getElementById("form"));
form.setlabels([["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); // Imposta le etichette e i campi del form

form.submit = ((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    Booking(formData); // Esegue la funzione di prenotazione con i dati inviati
});