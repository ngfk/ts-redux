# Ailurus TS-Redux

Typescript wrapper for [Redux](https://github.com/reactjs/redux). Type safety and intellisense when creating reducers and dispatching actions.

> This project was originally named `@ailurus/ts-redux`.

[![npm version](https://img.shields.io/npm/v/@ngfk/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)
[![Downloads](https://img.shields.io/npm/dt/@ngfk/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)
[![Travis CI](https://travis-ci.org/ngfk/ts-redux.svg?branch=master)](https://travis-ci.org/ngfk/ts-redux)

## Installation
```
npm install @ngfk/ts-redux redux
```

## Usage

[TLDR](docs/usage.ts)
1. Define state structure
2. Map actions
3. Create reducers
4. Create store

### 1. Define state structure
Using TS-Redux starts with defining the state structure. An immutable state can be accomplished in typescript by marking all properties as `readonly`.

```typescript
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
```

### 2. Map actions
After defining the state you need to create an action map. This is done using an interface with the action type as key and the payload type as value.

```typescript
interface TodoActionMap {
    'TODO_ADD': { id: number, text: string };
    'TODO_TOGGLE': number;
    'TODO_REMOVE': number;
}

interface FilterActionMap {
    'FILTER_SET': Filter;
}

interface ActionMap extends TodoActionMap, FilterActionMap { }
```

The first entry in `TodoActions` represents an action with `TODO_ADD` as its type with a payload object holding an `id` and some `text`. Note that in order to combine mappings into a single larger mapping we can create an interface that extends the other mappings.

#### Define action creators (optional)
When using Redux in combination with [React](https://facebook.github.io/react/) you may want to define action creators to use with [react-redux](https://github.com/reactjs/react-redux). To define these action creators you can use the `ActionFactory`. See the React [example project](https://github.com/ngfk/todomvc-react-ts-redux).

```typescript
const todoFactory = new ActionFactory<TodoActionMap>();
const todoActionCreators = {
    todoAdd: todoFactory.creator('TODO_ADD'),
    todoToggle: todoFactory.creator('TODO_TOGGLE'),
    todoRemove: todoFactory.creator('TODO_REMOVE'),
};

const filterFactory = new ActionFactory<FilterActionMap>();
const filterActionCreators = {
    setFilter: filterFactory.creator('FILTER_SET'),
};
```

### 3. Create reducers
With the state and the actions defined we can create our reducers. TS-Redux provides a `createReducer` function, this function takes the initial state as the first parameter and a 'sub-reducer' mapping as the second parameter. A sub-reducer can be compared to one case in a standard Redux reducer, the sub-reducer takes the state and the action payload and returns the new state. The compiler will only accept the mapped sub-reducers if every defined action is mapped to a sub-reducer. At this stage the compiler knows the state and payload types.

```typescript
const todoReducer = createReducer<Todo[], TodoActionMap>([], {
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

const filterReducer = createReducer<Filter, FilterActionMap>(Filter.All, {
    'FILTER_SET': (_, payload) => payload
});
```

After creating our reducers we can combine them with the `combineReducers` function. This function will only accept its parameter if all the required properties are mapped to the correct reducer.

```typescript
const reducer = combineReducers<State>({
    todos: todoReducer,
    filter: filterReducer
});
```

> If you need more control when creating reducers you can also use the `ReducerBuilder` class. This builder has the same type checks in place but does not require you to define an initial state or to handle every mapped action.

### 4. Create store
With the root reducer we can finally create our store. We provide the state type and the action mapping while creating our store so that the store knows which action types can be dispatched, and what the corresponding payload type is.

The resulting store is a TS-Redux store implementing the default Redux store. This means that the `dispatch` method can still be used to accept any action. However, to ensure type safety the store provides an `action` method to select one of the defined actions which can then be dispatched with the corresponding payload.

```typescript
const store = createStore<State, ActionMap>(reducer);

// No type safety
store.dispatch({ type: 'ANYTHING' });

// Type safe
store.action('TODO_ADD').dispatch({ id: 1, text: 'My first TODO!' });
store.action('TODO_TOGGLE').dispatch(1);
```

## Example projects
* [TodoMVC Angular](https://github.com/ngfk/todomvc-angular-ts-redux)
* [TodoMVC React](https://github.com/ngfk/todomvc-react-ts-redux)
