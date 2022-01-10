/*
* U real-world aplikaciji tipicno nema potrebe da se prosledjuje inicjalni state
* osim ukoliko se na primer ne bavimo
* serverskim renderovanjem(SSR aplikacijama poput NEXT.js-a, Angular Universal-a, itd..)
* gde je moguce inicijalno korisniku load-ovati podatke bez da se u momentu kada se aplikacija
* konvertuje is SSR u single-page salju inicijalni http zahtevi.
*/

export const initialState = {
    loaded: false,
    loading: true,
    data: [
        { label: 'Eat pizza', complete: false }
    ],
};

export function reducer(
    state = initialState,
    action: { type: string, payload: any }
) {

    if (action.type) {

        console.log(`Reducers.ts -> Pokusavam da udjem u '${action.type}' case reducer funkcije.`)

    } else {

        console.log("Reducers.ts -> Nijedan case nije pronadjen. Izlazim iz reducer funkcije.");

    }

    switch (action.type) {

        case 'ADD_TODO': {

            // Vrednost vadimo iz payload-a akcije.
            const todo = action.payload;

            const data = [...state.data, todo];

            console.log("Reducers.ts -> Izlazim iz 'ADD_TODO' case-a reducer funkcije.");

            return {
                ...state,
                data: data
            }

        }
    }

    return state;
}