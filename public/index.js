import { giorno_iniziale, createTable, createBookButton, createSpecialtyTabs, createMiddleware, createForm, crea_lista_diz, Booking, formatTime } from './componenti.js';

// Bottoni per le settimane precedenti e successive
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva");
let lista_diz = [];
//Middleware
const database = createMiddleware();

database.loadTypes().then(res => {
    console.log(res)
})

// Funzione per aggiornare la tabella con i giorni della settimana precedente
precedente.onclick = () => {
    database.load().then((result_get) => {
        result_get.forEach(app=>{
            const date = new Date(app.date);

            const year = date.getFullYear();
            const month = date.getMonth() + 1; 
            const day = date.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            console.log(formattedDate);
            app.date=formattedDate
        })
        let lista_diz=crea_lista_diz(result_get)
        giorno.setDate(giorno.getDate() - 7);
        table.creaheader(giorno);
        table.crea(lista_diz, hours, giorno);
    })    
};

// Funzione per aggiornare la tabella con i giorni della settimana successiva
successivo.onclick = () => {
    database.load().then((result_get) => {
        result_get.forEach(app=>{
            const date = new Date(app.date);

            const year = date.getFullYear();
            const month = date.getMonth() + 1; 
            const day = date.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            app.date=formattedDate
        })
        let lista_diz=crea_lista_diz(result_get)
        giorno.setDate(giorno.getDate() + 7);
        table.creaheader(giorno);
        table.crea(lista_diz, hours, giorno);
    })  
};

// Creazione dei tab di specialità
let specialtyTabs;
let chiave;

let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale();
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

specialtyTabs = createSpecialtyTabs(document.getElementById("specialty-tabs"), ["Cardiologia", "Psicologia", "Oncologia", "Ortopedia", "Neurologia"],table,database);
specialtyTabs.render();

database.load().then(res => {
    console.log(res)
    res.forEach(app=>{
        const date = new Date(app.date);

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Aggiungi 1 perché i mesi partono da 0
        const day = date.getDate();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        console.log(formattedDate);
        app.date=formattedDate
    })
    lista_diz=crea_lista_diz(res)
    table.build( ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
    let lunedi = giorno_iniziale()
    table.creaheader(lunedi);
    table.crea(lista_diz, hours,lunedi);
})


const form = createForm(database,table);
form.setlabels([["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); // Imposta le etichette e i campi del form

form.submit = ((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    Booking(formData); // Esegue la funzione di prenotazione con i dati inviati
});
const bookButton = createBookButton(document.getElementById("controls"),form);
bookButton.render();

const ricerca_data = document.querySelector(".appdate")
ricerca_data.addEventListener("click", () => {
    let d = document.querySelector("#date-picker").value;
    database.loadByDate(d).then(res=>{
        let t="";
        console.log(res)
        res.forEach(app => {
            let template = '<li>Reparto: %R\nPaziente: %P\nOrario: %O</li>';
            template = template.replace("%R",app.type);
            template = template.replace("%P",app.name);
            template = template.replace("%O",formatTime(app.hour));
            t += template;
        });
        document.querySelector("#appointment-list").innerHTML = t;
    })
});