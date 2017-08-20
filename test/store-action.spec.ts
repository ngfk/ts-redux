import { expect } from 'chai';

import { Store, StoreAction } from '../src/store';

interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_REMOVE': number;
}

describe('StoreAction', () => {

    it('forward StoreAction.dispatch to Store.dispatch', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);

        let triggered = false;
        const originalDispatch = store.dispatch;
        store.dispatch = (action: any) => {
            triggered = true;
            return originalDispatch(action);
        };

        new StoreAction<Todo[], TodoActions, 'TODO_ADD'>(store, 'TODO_ADD')
            .dispatch({ id: 0, text: '' });

        expect(triggered).eq(true);
    });

    it('dispatch the correct action', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        type  Type = 'TODO_ADD';
        const type = 'TODO_ADD';
        const id   = 23;
        const text = 'Some Todo text';

        const originalDispatch = store.dispatch;
        store.dispatch = (action: any) => {
            // tslint:disable no-unused-expression
            expect(action.type).exist;
            expect(action.payload).exist;
            expect(action.payload.id).exist;
            expect(action.payload.text).exist;
            // tslint:enable no-unused-expression

            expect(action.type).eq(type);
            expect(action.payload).eql({ id, text });

            return originalDispatch(action);
        };

        new StoreAction<Todo[], TodoActions, Type>(store, type)
            .dispatch({ id, text });
    });

    it('return the action on dispatch', () => {
        const store = new Store<Todo[], TodoActions>((s: Todo[]) => s);
        const dispatcher = new StoreAction<Todo[], TodoActions, 'TODO_ADD'>(store, 'TODO_ADD');
        const action = dispatcher.dispatch({ id: 0, text: '' });

        // tslint:disable no-unused-expression
        expect(action.type).exist;
        expect(action.payload).exist;
        // tslint:enable no-unused-expression
    });
});
