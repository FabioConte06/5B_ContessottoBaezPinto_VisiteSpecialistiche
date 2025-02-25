import { giorno_iniziale, createTable, createBookButton, createSpecialtyTabs } from './componenti.js';

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

// Funzione per il calcolo del giorno di partenza, ossia lunedì e toglie sabati e domeniche
export const giorno_iniziale = () => {
    let oggi = new Date();
    let giorno_settimanale = oggi.getDay();

    if (giorno_settimanale === 6) {
        oggi.setDate(oggi.getDate() + 2);
    } else if (giorno_settimanale === 0) {
        oggi.setDate(oggi.getDate() + 1);
    }
    console.log(oggi);
    return oggi;
};

// Creazione del componente tabella
export const createTable = (parentElement) => {
    let data = null;
    let header;
    let newrow = [];

    return {
        build: (dati) => {
            data = dati;
        },

        creaheader: (lunedi) => {
            header = "<table class='table table-bordered'><thead>";
            header += "<th>ORE</th>";
            let tempDate = new Date(lunedi);
            header += data.map(day => {
                const formato = day + " " + tempDate.toLocaleDateString("it-IT");
                tempDate.setDate(tempDate.getDate() + 1);
                return `<th>${formato}</th>`;
            }).join("");
            header += "</thead><tbody>";

            parentElement.innerHTML = header;
        },

        crea: (listadata, hours, lunedi) => {
            let Row = "";
            let nom_rep = document.querySelector(".active").textContent.trim();
            const currentWeek = [];
            console.log(lunedi);
            // Creiamo un'altra copia di `lunedi`
            let tempDate = new Date(lunedi);

            // Genera l'array delle date per i giorni della settimana
            for (let i = 0; i < 5; i++) {
                currentWeek.push(new Date(tempDate));
                tempDate.setDate(tempDate.getDate() + 1);
            }

            // Crea una riga per ogni ora
            hours.forEach(hour => {
                Row += `<tr><td>${hour}</td>`;

                // Crea una cella per ogni giorno della settimana
                currentWeek.forEach(day => {
                    let paziente = "";
                    const dayString = day.toISOString().split("T")[0];
                    // Controllo dati e prenotazioni
                    listadata.forEach((prenotazione) => {
                        if (nom_rep === prenotazione[0] && prenotazione[1] === dayString && prenotazione[2] === hour) {
                            console.log("giorno e ora uguale");
                            paziente = prenotazione[3];
                        }
                    });
                    console.log(paziente);
                    // Se ha trovato il paziente o inserisce altrimenti la casella rimane vuota
                    if (paziente != "") {
                        Row += `<td>${paziente}</td>`;
                    } else {
                        Row += `<td></td>`;
                    }
                });

                Row += "</tr>";
            });
            parentElement.innerHTML = header + Row + "</tbody></table>";
        }
    };
};

let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale();
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

// Creazione dei tab di specialità
let specialtyTabs;
let chiave;
export const createSpecialtyTabs = (parentElement, reparti) => {
    let activeIndex = 0;
    console.log(parentElement);
    console.log(reparti);
    return {
        // Funzione che crea i bottoni
        build: () => {
            return reparti.map((item, index) => {
                let buttonClass = 'specialty-tab';
                if (index === activeIndex) {
                    buttonClass += ' active';
                }
                return `<button class="${buttonClass}" data-index="${index}">
                    ${item}
                </button>`;
            }).join('');
        },
        render: function () {
            parentElement.innerHTML = this.build();
            // Per ogni bottone creo una funzione che se il bottone viene schiacciato gli da la classe active e aggiorna la tabella
            Array.from(parentElement.querySelectorAll("button")).forEach(button => {
                button.addEventListener("click", () => {
                    const index = parseInt(button.getAttribute("data-index"));
                    this.setActive(index);
                    table.creaheader(giorno);
                    table.crea(lista_diz, hours, giorno);
                });
            });
        },
        setActive: function (index) {
            activeIndex = index;
            this.render();
        }
    };
};

// Creazione del bottone di prenota
export const createBookButton = (parentElement) => {
    return {
        render: () => {
            parentElement.innerHTML = `
                <button class="book-button" id="openModalButton">Prenota<i class="fa-solid fa-arrow-right"></i></button>
            `;
            document.getElementById("openModalButton").onclick = () => {
                form.render();
            };
        }
    };
};

// Creazione dei tab di specialità e del bottone di prenota
specialtyTabs = createSpecialtyTabs(document.getElementById("specialty-tabs"), config.tipologie);
const bookButton = createBookButton(document.getElementById("controls"));
specialtyTabs.render();
bookButton.render();