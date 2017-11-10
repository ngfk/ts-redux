import { expect } from 'chai';

import { Store } from '../src/store';

interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

interface TodoActions {
    TODO_ADD: { id: number; text: string };
    TODO_REMOVE: number;
}

describe('Store', () => {
    it('respect the initial state', () => {
        // Initial state set by reducer
        const store1 = new Store<Todo[], TodoActions>((s: any) => s);
        expect(store1.getState()).eq(undefined);

        const initial2 = [] as Todo[];
        const store2 = new Store<Todo[], TodoActions>((s = initial2) => s);
        expect(store2.getState()).eq(initial2);

        const initial3 = [{ id: 0, text: 'abc', completed: false }];
        const store3 = new Store<Todo[], TodoActions>((s = initial3) => s);
        expect(store3.getState()).eq(initial3);

        // Initial state set when creating store
        const initial4 = [] as Todo[];
        const store4 = new Store<Todo[], TodoActions>((s: any) => s, initial4);
        expect(store4.getState()).eq(initial4);
    });
});
