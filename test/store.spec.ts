import { expect } from 'chai';
import { Store } from '../src';

interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_REMOVE': number;
}

describe('Store', () => {

    it('respect the initial state', () => {
        // Initial state set by reducer
        const store1 = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        expect(store1.initialState).eq(undefined);
        expect(store1.getState()).eq(undefined);

        const initial2 = [] as Todo[];
        const store2   = new Store<Todo[], TodoActions>((s = initial2) => s);
        expect(store2.initialState).eq(initial2);
        expect(store2.getState()).eq(initial2);

        const initial3 = [{ id: 0, text: 'abc', completed: false }];
        const store3   = new Store<Todo[], TodoActions>((s = initial3) => s);
        expect(store3.initialState).eq(initial3);
        expect(store3.getState()).eq(initial3);

        // Initial state set when creating store
        const initial4 = [] as Todo[];
        const store4   = new Store<Todo[], TodoActions>((s: Todo[]) => s, initial4);
        expect(store4.initialState).eq(initial4);
        expect(store4.getState()).eq(initial4);

        // Set state after creation without modifying the current state
        const initial5 = [] as Todo[];
        const store5   = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        expect(store5.initialState).eq(undefined);
        expect(store5.getState()).eq(undefined);
        store5.initialState = initial5;
        expect(store5.initialState).eq(initial5);
        expect(store5.getState()).eq(undefined);
    });

    it('purge to the initial state', () => {
        const initial = [] as Todo[];
        const store   = new Store<Todo[], TodoActions>((s: Todo[]) => s);

        expect(store.getState()).eq(undefined);
        store.purge();
        expect(store.getState()).eq(undefined);
        store.initialState = initial;
        expect(store.getState()).eq(undefined);
        store.purge();
        expect(store.getState()).eq(initial);
    });

    it('purge to given state', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s, []);

        expect(store.getState()).eql([]);
        store.purge();
        expect(store.getState()).eql([]);
        store.purge([{ id: 0, text: 'abc', completed: false }]);
        expect(store.getState()).eql([{ id: 0, text: 'abc', completed: false }]);
    });
});
