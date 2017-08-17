import { expect } from 'chai';

import { ActionDispatcher, Store } from '../src';

interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_REMOVE': number;
}

describe('ActionDispatcher', () => {

    it('forward ActionDispatcher.dispatch to Store.dispatch', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);

        let triggered = false;
        store.dispatch = (action: any) => {
            triggered = true;
            return Store.prototype.dispatch.call(store, action);
        };

        new ActionDispatcher<Todo[], TodoActions, 'TODO_ADD'>(store, 'TODO_ADD')
            .dispatch({ id: 0, text: '' });

        expect(triggered).eq(true);
    });

    it('dispatch the correct action', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        type  Type = 'TODO_ADD';
        const type = 'TODO_ADD';
        const id   = 23;
        const text = 'Some Todo text';

        store.dispatch = (action: any) => {
            // tslint:disable no-unused-expression
            expect(action.type).exist;
            expect(action.payload).exist;
            expect(action.payload.id).exist;
            expect(action.payload.text).exist;
            // tslint:enable no-unused-expression

            expect(action.type).eq(type);
            expect(action.payload).eql({ id, text });

            return Store.prototype.dispatch.call(store, action);
        };

        new ActionDispatcher<Todo[], TodoActions, Type>(store, type)
            .dispatch({ id, text });
    });

    it('return the action on dispatch', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        const dispatcher = new ActionDispatcher<Todo[], TodoActions, 'TODO_ADD'>(store, 'TODO_ADD');
        const action = dispatcher.dispatch({ id: 0, text: '' });

        // tslint:disable no-unused-expression
        expect(action.type).exist;
        expect(action.payload).exist;
        // tslint:enable no-unused-expression
    });
});
