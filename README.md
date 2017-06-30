# Ailurus TS-Redux

Typescript wrapper for [Redux](https://github.com/reactjs/redux). Type safety and intellisense when creating reducers and dispatching actions.

[![npm version](https://img.shields.io/npm/v/@ailurus/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)
[![Downloads](https://img.shields.io/npm/dt/@ailurus/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)
[![Travis CI](https://travis-ci.org/ngfk/ts-redux.svg?branch=master)](https://travis-ci.org/ngfk/ts-redux)

## Installation
```
npm install @ailurus/ts-redux redux
```

## Usage

[TLDR](docs/usage.ts)
1. Define state structure
2. Map actions
3. Create reducers
4. Create store

### 1. Define state structure
Using TS-Redux starts with defining the state structure. An immutable state can be accomplished in typescript by making all properties `readonly`.

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
interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_TOGGLE': number;
    'TODO_REMOVE': number;
}

interface FilterActions {
    'FILTER_SET': Filter;
}

interface Actions extends TodoActions, FilterActions { }
```

The first entry in the mapping above represents an action with `TODO_ADD` as its type and a payload which holds an `id` and some `text`. Note that in order to combine mappings into a single larger mapping we can create an interface which extends the sub-mappings.

### 3. Create reducers
With the state and the actions defined we can create our reducers. TS-Redux provides a `createReducer` function, this function takes the initial state as the first parameter and a 'sub-reducer' mapping as the second parameter. A sub-reducer can be compared to one case in a standard redux reducer, the sub-reducer takes the state and the action payload and returns the new state. The compiler will only accept the mapped sub-reducers if every defined action is mapped to a sub-reducer. At this stage the state and payload types are known.

```typescript
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
```

After creating our reducers we can combine them with the `combineReducers` function. Since we specify the reducer type we wish to create the `combineReducers` function will only accept its parameter if it has all the required properties mapped to the correct reducer type.

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
const store = createStore<State, Actions>(reducer);

// Not type safe
store.dispatch({ type: 'ANYTHING' });

// Type safe
store.action('TODO_ADD').dispatch({ id: 1, text: 'My first TODO!' });
store.action('TODO_TOGGLE').dispatch(1);
```

## Examples
* [TodoMVC Angular](https://github.com/ngfk/todomvc-angular-ts-redux)
* [TodoMVC React](https://github.com/ngfk/todomvc-react-ts-redux)
