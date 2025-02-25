//bottoni per le settimane precedenti e successive
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva")

//funzione per aggiornare la tabella con i giorni della settimana precedente
precedente.onclick=()=>{
    console.log(giorno)
    giorno.setDate(giorno.getDate() - 7);
    table.creaheader(giorno)
    table.crea(lista_diz, hours,giorno);
}

//funzione per aggiornare la tabella con i giorni della settimana successiva
successivo.onclick=()=>{
    giorno.setDate(giorno.getDate() + 7);
    table.creaheader(giorno)
    table.crea(lista_diz, hours,giorno);
}

//funzione per il calcolo del giorno di partenza, ossia lunedì e toglie sabati e domeniche
export const giorno_iniziale = () => {
    let oggi = new Date();
    let giorno_settimanale = oggi.getDay();

    if (giorno_settimanale === 6){
        oggi.setDate(oggi.getDate() + 2);
    } else if (giorno_settimanale === 0){
        oggi.setDate(oggi.getDate() + 1);
    }
    console.log(oggi)
    return oggi;
};

//creazione del componente tabella
export const createTable = (parentElement) => {
    let data = null;
    let header;
    let newrow = [];

    return {
        build:(dati) => {
            data = dati;
        },
        
        creaheader:(lunedi) => {
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
            let nom_rep = document.querySelector(".active").textContent.trim()
            const currentWeek = [];
            console.log(lunedi)
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
                    let paziente = ""
                    const dayString = day.toISOString().split("T")[0];
                    //controllo dati e prenotazioni
                    listadata.forEach((prenotazione)=>{
                        if (nom_rep===prenotazione[0] && prenotazione[1]===dayString && prenotazione[2]===hour){
                            console.log("giorno e ora uguale")
                            paziente=prenotazione[3]
                        }
                    })
                    console.log(paziente)
                    //se ha trovato il paziente o inserisce altrimenti la casella rimane vuota
                    if (paziente!=""){
                        Row += `<td>${paziente}</td>`;
                    }
                    else{
                        Row += `<td></td>`
                    }
                    
                });

                Row += "</tr>";
            });
            parentElement.innerHTML = header + Row + "</tbody></table>";
        }
    }
}
let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale()
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

//fetch del json, fetch dei data per aggiornare la tabella con la render
GetData().then(()=>{
    chiave = config.cacheToken
    GET(chiave).then((result_get)=>{
        lista_diz=crea_lista_diz(result_get)
        table.build( ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
        let lunedi = giorno_iniziale()
        table.creaheader(lunedi);
        table.crea(lista_diz, hours,lunedi);
    })

    }
)

//set Interval per aggiornare i dati ogni 3 minuti
setInterval(()=>{
    GetData().then(()=>{
        chiave = config.cacheToken
        GET(chiave).then((result_get)=>{
            lista_diz=crea_lista_diz(result_get)
            table.creaheader(giorno);
            table.crea(lista_diz, hours,giorno);
        })
        }
      )
},300000)