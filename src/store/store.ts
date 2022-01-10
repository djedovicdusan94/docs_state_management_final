export class Store {

    // Niz subscriber-a ce zapravo biti niz funkcija.
    private subscribers: Function[];

    /* 
    * reducer ce imati kljuc tipa string, a vrednost kljuca ce biti funkcija
    * koja ce se pozivati prilikom dispatch-a akcije
    * konkretno na liniji -> newState[prop] = this.reducers[prop](state[prop], action);
    */

    private reducers: { [key: string]: Function };

    /* 
    * state ce imati kljuc tipa string,
    * a vrednost kljuca ce moci da bude bilo koji tip podatka
    * kao na primer niz, objekat, broj, string, itd..
    */

    private state: { [key: string]: any }

    /*
    * Ukoliko se neki od parametara konstruktora ne prosledi,
    * taj parametar ce biti inicijalizovan na definisanu default-nu vrednost,
    * a to je ovde kao sto vidimo prazan objekat.
    */

    constructor(reducers = {}, initialState = {}) {

        console.log('Store.ts -> Postavljam sledece reducer-e: ', reducers);
        console.log('Store.ts -> Postavljam sledeci initialState: ', initialState);

        // Prilikom instanciranja klase postavljamo vrednost za reducer-e.
        this.reducers = reducers;

        // Prilikom instanciranja klase postavljamo vrednost za state.
        this.state = this.reduce(initialState, {});

        // Subscriber-e inicijalizujem na vrednost praznog niz.
        this.subscribers = [];

    }

    /*
    * Typescript omogucava koriscenje get property-a
    * pomocu koga cemo vratiti trenutnu vrednost state-a.
    *
    * Kada budemo kreirali instancu klase store,
    * vrednostima trenutnog state-a cemo moci da pristupimo sa 
    * na primer, console.log(store.value).
    */

    get value() {
        return this.state;
    }

    subscribe(fn) {

        /*
        * Takodje i ovde koristimo spread operator pomocu koga
        * kopiramo vrednosti iz starog niza u novi. Pored toga
        * prosledjujemo i novog subscriber-a reprezentovanog
        * u obliku funkcije.
        */

        this.subscribers = [...this.subscribers, fn];

        /*
        * Funkcija koju pozivamo svaki put kada zelimo da obavestimo
        * subscriber-e da je store izmenjen.
        */

        this.notify();

        /*
        * Naravno kada se subscribe zavrsi, tj. sve vrednosti budu
        * emitovane svim subscriber-ima, zelimo da unistimo subscribe kako
        * ne bi doslo do potencijalnog memory leak-a.
        */
        return () => {

            /*
            * filter ce sada vratiti novi niz bez funkcije nad kojom
            * smo uradili subscribe.
            */

            this.subscribers = this.subscribers.filter(sub => sub !== fn);

        }
    }

    private notify() {

        /*
        * Svaki subscriber je zapravo reprezentovan u obliku funkcije
        * kojoj prosledjujemo vrednost trenutnog state objekta.
        */

        this.subscribers.forEach(fn => fn(this.value))
    }

    dispatch(action) {

        /*
        * Zelimo da izvrsimo update celog state objekta pozivom
        * reduce funkcije koja ce zatim izvrsiti iteraciju nad
        * reducer-ima prosledjujuci reduceru iz Reduce.ts file-a
        * state i dispatch-ovanu akciju.
        *
        * Reducer ce zatim sastaviti novi state koji cemo ponovo povezati
        * sa this.state objektom unutar store-a.
        */

        this.state = this.reduce(this.state, action);

        /*
        * Posle dispatch-a akcije cemo zeleti da o rezultatu iste obavestimo
        * i sve subscriber-e store-a.
        */

        this.notify();
    }

    private reduce(state, action) {

        const newState = {};

        /*
        * prop('todos', itd..) ce biti string kljucevi svih reducer-a koje smo 
        * registrovali u app.ts file-u -> const store = new fromStore.Store(reducers);
        */

        for (const prop in this.reducers) {

            /*
            * Za svaki kljuc u okviru reducer-a cu dinamicki dodati
            * novi property u newState objekat.
            *
            * Iz razloga jer svaki reducer upravlja jednim delicem
            * state-a, ne zelimo da svakom reduceru prosledjujemo
            * ceo state objekat jer to ne bi imalo smisla.
            * 
            * Sintaksa ispod je ekvivalent sledecem:
            * newState.todos = this.reducers.todos(state.todos, action);
            */

            console.log("Store.ts -> Pozivam reducer funkciju.");
            newState[prop] = this.reducers[prop](state[prop], action);
            console.log("Store.ts -> Reducer funkcija uspesno izvsena.");

        }

        return newState;
    }

    /*
    * Napomena: Ceo sadrzaj ove klase ce biti
    * eksportovan ne iz store.ts, vec iz index.ts fajla.
    */
}