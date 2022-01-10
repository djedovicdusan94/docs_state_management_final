import { renderTodos } from './utils';

const input = document.querySelector('input') as HTMLInputElement;
const button = document.querySelector('button') as HTMLButtonElement;
const destroy = document.querySelector('.unsubscribe') as HTMLButtonElement;
const todoList = document.querySelector('.todos') as HTMLLIElement;

// Importujemo store
import * as fromStore from './store';

console.log("App.ts -> Aplikacija inicijalizovana.");

const reducers = {
  // Ovo nece direktno pozvati niti ce izvrsiti reducer funkciju iz reducers.ts file-a.
  todos: fromStore.reducer
};

/*
* Kreiramo novu instancu store klase cijem konstruktoru
* prosledjujemo reducers objekat.
*/

const store = new fromStore.Store(reducers);
console.log("App.ts -> Uspesno registrovani niz reducer-a i state u store-u.");

// Ispis prilikom rendera aplikacije.
/*
* App.ts -> Aplikacija inicijalizovana.
* Store.ts -> Postavljam sledece reducer-e:  
*                        todos: ƒ reducer(state, action)
*                              name: "reducer"
* Store.ts -> Postavljam sledeci initialState:  {}
* Store.ts -> Pozivam reducer funkciju.
* Reducers.ts -> Nijedan case nije pronadjen. Izlazim iz reducer funkcije.
* Store.ts -> Reducer funkcija uspesno izvsena.
* App.ts -> Uspesno registrovani niz reducer-a i state u store-u.
*/


// add EventListener
button.addEventListener(

  'click',

  () => {

    // Ukoliko je input prazan - prekini izvrsavanje
    if (!input.value.trim()) return;

    // Kreiram payload
    const payload = { label: input.value, complete: false };

    /*
    * Ranije smo vec napomenuli da sve akcije imaju tip i payload.
    * Upravo cemo dispatch funkciji proslediti ta dva parametra i pokrenuti
    * proces kreiranja novog state-a.
    */

    console.log("App.ts -> Dispatch akcije zapocet.");

    store.dispatch({
      type: 'ADD_TODO',
      payload: payload
    });

    console.log("App.ts -> Dispatch akcije uspesno izvrsen. Novi state: ", store.value);
    // Ispis posle klika na dugne 'Add todo':
    /*
    * App.ts -> Dispatch akcije zapocet.
    * Store.ts -> Pozivam reducer funkciju.
    * Reducers.ts -> Pokusavam da udjem u 'ADD_TODO' case reducer funkcije.
    * Reducers.ts -> Izlazim iz 'ADD_TODO' case-a reducer funkcije.
    * Reducer funkcija uspesno izvsena.
    * App.ts -> Dispatch akcije uspesno izvrsen. Novi state:  
    *                             todos:
    *                               data: (2) [{…}, {…}]
    */

    // resetujem input
    input.value = '';
  },

  false

);

const subscription = store.subscribe(state => {

  /*
  * Kada store emituje state objekat renderovace
  * se lista button-a i label-a koji ce reprezentovati
  * sve elemente todo niza.
  */
  renderTodos(state.todos.data);

});

todoList.addEventListener('click', function (event) {

  const target = event.target as HTMLButtonElement;

  if (target.nodeName.toLowerCase() === 'button') {
    console.log(target);
  }

});
