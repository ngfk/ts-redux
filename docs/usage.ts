import { ActionFactory } from '../src/action-factory';
import { combineReducers } from '../src/combine-reducers';
import { createReducer } from '../src/create-reducer';
import { createStore } from '../src/create-store';

// 1. Define state
interface Todo {
    readonly id: number;
    readonly text: string;
    readonly completed: boolean;
}

enum Filter {
    All,
    Completed,
    Active
}

interface State {
    readonly todos: Todo[];
    readonly filter: Filter;
}

// 2. Map actions
interface TodoActionMap {
    TODO_ADD: { id: number; text: string };
    TODO_TOGGLE: number;
    TODO_REMOVE: undefined;
}

interface FilterActionMap {
    FILTER_SET: Filter;
}

interface ActionMap extends TodoActionMap, FilterActionMap {}

// Optionally, define action creators for use with react-redux
// Example react project at https://github.com/ngfk/todomvc-react-ts-redux
const todoFactory = new ActionFactory<TodoActionMap>();
const todoActionCreators = {
    todoAdd: todoFactory.creator('TODO_ADD'),
    todoToggle: todoFactory.creator('TODO_TOGGLE'),
    todoRemove: todoFactory.creator('TODO_REMOVE')
};

const filterFactory = new ActionFactory<FilterActionMap>();
const filterActionCreators = {
    setFilter: filterFactory.creator('FILTER_SET')
};

// 3. Create reducers
const todoReducer = createReducer<Todo[], TodoActionMap>([], {
    TODO_ADD: (state, payload) => [...state, { id: payload.id, text: payload.text, completed: false }],
    TODO_TOGGLE: (state, payload) => {
        return state.map(todo => (todo.id === payload ? { ...todo, completed: !todo.completed } : todo));
    },
    TODO_REMOVE: (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    }
});

const filterReducer = createReducer<Filter, FilterActionMap>(Filter.All, {
    FILTER_SET: (_, payload) => payload
});

const reducer = combineReducers<State>({
    todos: todoReducer,
    filter: filterReducer
});

// 4. Create store
const store = createStore<State, ActionMap>(reducer);

// No type safety
store.dispatch({ type: 'ANYTHING' });

// Type safe
store.action('TODO_ADD').dispatch({ id: 1, text: 'My first TODO!' });
store.action('TODO_TOGGLE').dispatch(1);
