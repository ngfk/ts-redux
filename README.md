# Ailurus TS-Redux

Typescript wrapper for [Redux](https://github.com/reactjs/redux).

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

![intellisense-demo](images/intellisense-demo.gif)

### Examples
* [TodoMVC Angular](https://github.com/ngfk/todomvc-angular-ts-redux)
* TodoMVC React
