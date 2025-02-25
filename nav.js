let specialtyTabs;
let chiave;
export const createSpecialtyTabs = (parentElement,reparti) => {
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
//crea il bottone di prenota
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


//fa la fetch del json e crea il nav
GetData().then(()=>{
  let specialtyTabs = createSpecialtyTabs(document.getElementById("specialty-tabs"),config.tipologie);
  chiave = config.cacheToken
  const bookButton = createBookButton(document.getElementById("controls"));
  specialtyTabs.render();
  bookButton.render();
  GET(chiave).then((result_get)=>{
    lista_diz=crea_lista_diz(result_get)
  })
  }
)