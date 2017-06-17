# Ailurus TS-Redux

[![npm version](https://img.shields.io/npm/v/@ailurus/ts-redux.svg)](https://www.npmjs.com/package/@ailurus/ts-redux)

Typescript wrapper for [Redux](https://github.com/reactjs/redux).

### Installation
```
npm install --save @ailurus/ts-redux
```

### Usage
```ts
// Define state
interface Todo {
    readonly id: number,
    readonly text: string,
    readonly completed: boolean
}

interface TodoState extends Array<Todo> { }

// Define actions, key = action type, value = payload type
interface TodoActions {
    'TODO_ADD': { id: number, text: string };
    'TODO_TOGGLE': number;
    'TODO_REMOVE': number;
}

// Create reducer
const todos = new ReducerBuilder<TodoState, TodoActions>()
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
    .case('TODO_REMOVE', (state, payload)  => {
        return state.filter(todo => todo.id !== payload);
    })
    .build();

// Create Store
const store = createStore<TodoState, TodoActions>(todos);

// Dispatch Actions
store.action('TODO_ADD').dispatch({ id: 0, text: 'My first TODO!' });
```

### Intellisense

Try the [Demo](https://ngfk.github.io/ailurus-ts-redux)  

Note: This web demo uses Microsoft's [Monaco Editor](https://microsoft.github.io/monaco-editor/). In [Visual Studio Code](https://code.visualstudio.com) you can press ctrl+space at `builder.case('` and `store.action('` for the correct intellisense (line 26 and 44 in the gif below), this however does not work in the web demo.

#### VS Code experience
![intellisense-demo](images/intellisense-demo.gif)

### Examples
* [TodoMVC Angular](https://github.com/ngfk/todomvc-angular-ts-redux)
* [TodoMVC React](https://github.com/ngfk/todomvc-react-ts-redux)
