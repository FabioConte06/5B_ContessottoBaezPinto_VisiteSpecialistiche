let giornoglobale;

const Aggiorna =(booking,database,table)=>{
    console.log(database,booking)
        database.add(booking).then(r=>{
          console.log(r)
          if (r.result==="ok"){
             database.load().then((result_get) => {
                console.log("genera")
                console.log(result_get)
                let lista_diz=crea_lista_diz(result_get)
                let giorno = giorno_iniziale();
                let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
                table.creaheader(giornoglobale)
                table.crea(lista_diz, hours,giornoglobale);
            })
          }
       })
 }
 
const formatTime = (time) => {
    // Converti il numero in una stringa per poterlo manipolare
    let timeStr = time.toString();
  
    // Aggiungi uno zero davanti se la stringa ha una lunghezza inferiore a 4
    if (timeStr.length === 3) {
      timeStr = '0' + timeStr;
    }
  
    // Inserisci i due punti tra le ore e i minuti
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2);
};

const giorno_iniziale = () => {
    let oggi = new Date();
    let giorno_settimanale = oggi.getDay();
    
    if (giorno_settimanale === 6){
        oggi.setDate(oggi.getDate() + 2);
    } else if (giorno_settimanale === 0){
        oggi.setDate(oggi.getDate() + 1);
    } else if (giorno_settimanale === 2){
        oggi.setDate(oggi.getDate() - 1);
    } else if (giorno_settimanale === 3){
        oggi.setDate(oggi.getDate() - 2);
    } else if (giorno_settimanale === 4){
        oggi.setDate(oggi.getDate() - 3);
    } else if (giorno_settimanale === 5){
        oggi.setDate(oggi.getDate() - 4);
    }
    console.log(oggi,giorno_settimanale)
    return oggi;
};

//creazione del componente tabella
const createTable = (parentElement) => {
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
            let rep;
            let nom_rep = document.querySelector(".active").textContent.trim()
            giornoglobale=lunedi
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
                        let ora =formatTime(prenotazione[3])
                        if (nom_rep===prenotazione[1] && prenotazione[2].split("T")[0]===dayString && ora===hour){
                            console.log("giorno e ora uguale")
                            paziente=prenotazione[4]
                        }
                    })
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

const createSpecialtyTabs = (parentElement,reparti,table,database) => {
    let activeIndex = 0; 
    console.log(parentElement)
    console.log(reparti)
    return {
      //funzione che crea i bottoni
      build: () => {
        return reparti.map((item,index) => {
          let buttonClass = 'specialty-tab';
          if (index === activeIndex) {
            buttonClass += ' active';
          }
          return `<button class="${buttonClass}" data-index="${index}">
            ${item}
          </button>`;
        }).join('');
      },
      render: function() {
        parentElement.innerHTML = this.build();
        //per ogni bottone creo un funzione che se il bottone viene schiacciato gli da la classe active e aggiorna la tabella
        Array.from(parentElement.querySelectorAll("button")).forEach(button => {
          button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index")); 
            this.setActive(index);
            let giorno = giorno_iniziale();
            database.load().then(res => {
                console.log(res)
                let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
                let lista_diz=crea_lista_diz(res)
                table.creaheader(giorno)
                table.crea(lista_diz, hours,giorno);
            }) 
          });
        });
      },
      setActive: function(index) {
        activeIndex = index;
        this.render();
      }
    };
  };

const createBookButton = (parentElement,form) => {
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

  const createMiddleware = () => {
    return {
        load: async () => {
            const response = await fetch("http://localhost:5600/bookings");
            const json = await response.json();
            return json;
        },
        loadByDate: async (date) => {
            const response = await fetch("http://localhost:5600/bookings/date/" + date);
            const json = await response.json();
            return json;
        },
        delete: async (id) => {
            const response = await fetch("http://localhost:5600/delete-booking/" + id, {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        add: async (booking) => {
            const response = await fetch("http://localhost:5600/insert-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ booking: booking }),
            });
            const json = await response.json();
            return json;
        },
        truncateTables: async () => {
            const response = await fetch("http://localhost:5600/truncate-tables", {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        dropTables: async () => {
            const response = await fetch("http://localhost:5600/drop-tables", {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        addType: async (nametype) => {
            const response = await fetch("http://localhost:5600/insert-type", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: nametype }),
            });
            return await response.json();
        },
        loadTypes: async () => {
            const response = await fetch("http://localhost:5600/types");
            return await response.json();
        }
    };
};


const crea_lista_diz = (result) => {
    let lista_diz = result.map(d => Object.values(d));
    console.log(lista_diz);
    return lista_diz;
  };
  
const createForm = (database,table) => {
    let data;
    let callback = null;

    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const openModal = () => {
        modal.style.display = "block";
    };

    const renderModalContent = () => {
        // Aggiunge il contenuto HTML alla modale, compreso il form e i pulsanti
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="closeButton"></span>
                <div id="formContent"></div>
                <div id="Message"></div>
                <button type="button" class="btn btn-primary" id="submit">PRENOTA</button>
                <button type="button" class="btn btn-secondary" id="cancel">ANNULLA</button>
            </div>
        `;

        document.getElementById("Message").onclick = closeModal;
        document.getElementById("closeButton").onclick = closeModal;
        document.getElementById("cancel").onclick = closeModal;

        const submitButton = document.getElementById("submit");
        submitButton.onclick = () => {
            const result = {};
            let rep;
            console.log(data)
            data.forEach((index,i) => {
                if (i===0){
                    result["date"]=document.getElementById(index[0]).value
                }
                if (i===1){
                    result["hour"]=document.getElementById(index[0]).value.replace(":","")
                }
                if (i===2){
                    result["name"]=document.getElementById(index[0]).value
                }
            });
            let nom_rep = document.querySelector(".active").textContent.trim();
            console.log(nom_rep)
            const reparti = {
                "Cardiologia": 1,
                "Psicologia": 2,
                "Oncologia": 3,
                "Ortopedia": 4,
                "Neurologia": 5
            };
            
            if (reparti[nom_rep] !== undefined) {
                rep = reparti[nom_rep];
                console.log("rep",rep)
            }
            result["idType"] = rep;
            console.log(result)
            Aggiorna(result,database,table);
            document.getElementById("Message").innerText = "Prenotazione eseguita con successo";
            if (callback) {
                console.log(result);
                callback(result);
            }
        };
    };

  return {
      // Components
      setlabels: (labels) => { data = labels; },
      submit: (callbackinput) => { callback = callbackinput; },
      render: () => {
          renderModalContent();
          const formContent = document.getElementById("formContent");
          formContent.innerHTML = data.map((index) => {
              if (index[1] === "dropdown") {
                  return `
                  <div class="form-group">
                      ${index[0]}
                      <select id="${index[0]}" class="form-control">
                          ${index[2].map(option => `<option value="${option}">${option}</option>`).join('')}
                      </select>
                  </div>`;
              }
              return `
              <div class="form-group">
                  ${index[0]}
                  <input type="${index[1]}" id="${index[0]}" class="form-control"/>
              </div>`;
          }).join("\n");

          openModal();
      },
  };
};

const Booking = (result) => {
  let available = [...lista_dizionario_giorni];
  console.log(available);
  let controllo = false;

  available.forEach((giorno) => {
      if (giorno["Data"] == result.Data) {
          for (chiave_dizionario in result) {
              if (chiave_dizionario != "Data") {
                  if ((giorno[chiave_dizionario] - result[chiave_dizionario]) < 0) {
                      controllo = true;
                  }
              }
          }
      }
  });

  if (controllo) {
      alert("Errore");
  } else {
      console.log("stai aggiornando");
      Aggiorna(result);
  }
};

export {
    giorno_iniziale,
    createTable,
    createBookButton,
    createSpecialtyTabs,
    createMiddleware,
    createForm,
    crea_lista_diz,
    Booking,
    formatTime
}