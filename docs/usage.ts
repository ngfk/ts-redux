import { createReducer, combineReducers, createStore } from '../src';

// 1. Define state
interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

enum Filter {
    All, Completed, Active
}

interface State {
    readonly todos: Todo[];
    readonly filter: Filter;
}

// 2. Map actions
interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_TOGGLE': number;
    'TODO_REMOVE': number;
}

interface FilterActions {
    'FILTER_SET': Filter;
}

interface Actions extends TodoActions, FilterActions { }

// 3. Create reducers
const todoReducer = createReducer<Todo[], TodoActions>([], {
    'TODO_ADD': (state, payload) => [
        ...state,
        { id: payload.id, text: payload.text, completed: false }
    ],
    'TODO_TOGGLE': (state, payload) => {
        return state.map(todo => todo.id === payload
            ? { ...todo, completed: !todo.completed }
            : todo);
    },
    'TODO_REMOVE': (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    }
});

const filterReducer = createReducer<Filter, FilterActions>(Filter.All, {
    'FILTER_SET': (_, payload) => payload
});

const reducer = combineReducers<State>({
    todos: todoReducer,
    filter: filterReducer
});

// 4. Create store
const store = createStore<State, Actions>(reducer);

// No type safety
store.dispatch({ type: 'ANYTHING' });

// Type safe
store.action('TODO_ADD').dispatch({ id: 1, text: 'My first TODO!' });
store.action('TODO_TOGGLE').dispatch(1);
