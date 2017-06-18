# Ailurus TS-Redux

Typescript wrapper for [Redux](https://github.com/reactjs/redux). Type safety and intellisense when creating reducers and dispatching actions.

[![npm version](https://img.shields.io/npm/v/@ailurus/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)

## Installation
```
npm install --save @ailurus/ts-redux
```

## Usage

1. Define state structure
2. Map actions
3. Create reducers
4. Create store

### 1. Define state structure
Using TS-Redux starts with defining the state structure. The state structure is a simple interface holding the state properties. An immutable state can be accomplished in typescript by making all the properties `readonly`.

```typescript
interface Todo {
    readonly id: number,
    readonly text: string,
    readonly completed: boolean
}

enum Filter {
    All, Completed, Active
}

interface State {
    readonly todos: Todo[],
    readonly filter: Filter
}
```

### 2. Map actions
After defining the state you need to map the actions in an interface. This mapping has the action type as key and the payload type as value.

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
With the state and the actions defined we can create our reducers. TS-Redux provides a ReducerBuilder to enforce type safety. The reducer builder takes the state/sub-state type and the corresponding action mapping. With this information the builder knows which types are available and what the corresponding payload is.

```typescript
const todosReducer = new ReducerBuilder<Todo[], TodoActions>()
    .init([])
    .case('TODO_ADD', (state, payload) => [
        ...state,
        { id: payload.id, text: payload.text, completed: false }
    ])
    .case('TODO_TOGGLE', (state, payload) => {
        return state.map(todo => todo.id === payload
            ? { ...todo, completed: !todo.completed }
            : todo);
    })
    .case('TODO_REMOVE', (state, payload) => {
        return state.filter(todo => todo.id !== payload);
    })
    .build();

const filterReducer = new ReducerBuilder<Filter, FilterActions>()
    .init(Filter.All)
    .case('FILTER_SET', (_, payload) => payload)
    .build();

const reducer = combineReducers<State>({
    todos: todosReducer,
    filter: filterReducer
});

```

After creating the todos reducer and the filter reducer we combine them with the combineReducers function. Because we specify the state type this function knows that it requires a reducer mapping with the properties `todos` and `filter`.

> If for some reason you wish to handle an unmapped action you can use the `.external` method of the ReducerBuilder. Note that this disables type checking.

### 4. Create store
With the root reducer we can finally create our store. We provide the state type and the action mapping while creating our store so that the store knows which action types can be dispatched, and what the corresponding payload type is.

The resulting store is a TS-Redux store which implements the default Redux store. This means that the `.dispatch` method can still be used. However, to ensure type safety the store provides an `.action` method to select one of the mapped actions which can then be dispatched with the corresponding payload.

```typescript
const store = createStore<State, Actions>(reducer);

// Not type safe
store.dispatch({ type: '', payload: undefined });

// Type safe
store.action('TODO_ADD').dispatch({ id: 1, text: 'My first TODO!' });
store.action('TODO_TOGGLE').dispatch(1);
```

## Intellisense
To see or experiment with intellisense, click on one of the links below:

* [web demo](https://ngfk.github.io/ailurus-ts-redux)
* [video](https://ngfk.github.io/ailurus-ts-redux/intellisense-demo.mp4)

> The web demo uses Microsoft's [Monaco Editor](https://microsoft.github.io/monaco-editor/). In [Visual Studio Code](https://code.visualstudio.com) you can press `ctrl+space` at `builder.case('` and `store.action('` for the correct intellisense, this does not work in the web demo.

## Examples
* [TodoMVC Angular](https://github.com/ngfk/todomvc-angular-ts-redux)
* [TodoMVC React](https://github.com/ngfk/todomvc-react-ts-redux)
