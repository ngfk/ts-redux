import { expect } from 'chai';
import { Reducer, ReducerBuilder } from '../src';

interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_REMOVE': number;
}

describe('ReducerBuilder', () => {

    const triggerReducer = (reducer: Reducer<any>, payload?: any) => {
        return reducer(undefined, { type: '', payload });
    };

    it('respect the initial state', () => {
        const reducer1 = new ReducerBuilder<Todo[], TodoActions>()
            .build();

        expect(triggerReducer(reducer1)).eq(undefined);

        const initial2 = [] as Todo[];
        const reducer2 = new ReducerBuilder<Todo[], TodoActions>()
            .init(initial2)
            .build();

        expect(triggerReducer(reducer2)).eq(initial2);
    });

    it('add case to reducer', () => {
        let triggeredAdd    = false;
        let triggeredRemove = false;

        const reducer = new ReducerBuilder<Todo[], TodoActions>()
            .init([])
            .case('TODO_ADD', (state, payload) => {
                triggeredAdd = true;

                // tslint:disable no-unused-expression
                expect(state).exist;
                expect(payload.id).exist;
                expect(payload.text).exist;
                // tslint:enable no-unused-expression

                expect(state).a('array');
                expect(payload.id).a('number');
                expect(payload.text).a('string');

                return [
                    ...state,
                    { ...payload, completed: false }
                ];
            })
            .case('TODO_REMOVE', (state, payload) => {
                triggeredRemove = true;

                // tslint:disable no-unused-expression
                expect(state).exist;
                expect(payload).exist;
                // tslint:enable no-unused-expression

                expect(state).a('array');
                expect(payload).a('number');

                return state.filter(todo => todo.id !== payload);
            })
            .build();

        const action1 = { type: 'TODO_ADD', payload: { id: 1, text: 'Test' } };
        const result1 = reducer(undefined as any, action1);
        expect(result1).a('array');
        expect(result1.length).eq(1);
        expect(result1[0]).eql({ id: 1, text: 'Test', completed: false });

        const action2 = { type: 'TODO_REMOVE', payload: 1 };
        const result2 = reducer(result1, action2);
        expect(result2).a('array');
        expect(result2.length).eq(0);

        expect(triggeredAdd && triggeredRemove).eq(true);
    });

    it('allow adding external case', () => {
        let triggered = false;
        const reducer = new ReducerBuilder<Todo[], TodoActions>()
            .init([])
            .external('RANDOM', (state, payload) => {
                triggered = true;

                // tslint:disable no-unused-expression
                expect(state).exist;
                expect(payload).exist;
                // tslint:enable no-unused-expression

                expect(state).eql([]);
                expect(payload).eq('test');

                return state;
            })
            .build();

        const action = { type: 'RANDOM', payload: 'test' };
        const result = reducer(undefined as any, action);

        expect(result).eql([]);
        expect(triggered).eq(true);
    });
});
