const giorno_iniziale = () => {
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
const createSpecialtyTabs = (parentElement,reparti) => {
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
            table.creaheader(giorno)
            table.crea(lista_diz, hours,giorno);
          });
        });
      },
      setActive: function(index) {
        activeIndex = index;
        this.render();
      }
    };
  };

const createBookButton = (parentElement) => {
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
        const response = await fetch("/accidents");
        const json = await response.json();
        return json;
      },
      delete: async (id) => {
        const response = await fetch("/delete/" + id, {
          method: 'DELETE',
        });
        const json = await response.json();
        return json;
      },
      add: async (accident) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                accident: accident
            })
        });
        const json = await response.json();
        return json;        
      }
    }
}


export {
    giorno_iniziale,
    createTable,
    createBookButton,
    createSpecialtyTabs,
    createMiddleware
}