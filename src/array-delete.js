/* eslint no-console: "off" */
import { createStore } from 'redux';

const myReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value];
    case 'REMOVE': {
      const newState = [...state];
      newState.splice(state.indexOf(action.value), 1);
      return newState;
    }
    default:
      return state;
  }
};
const store = createStore(myReducer);
let lastState = store.getState();
store.subscribe(() => {
  const newState = store.getState();
  console.log(newState);
  console.log(newState === lastState);
  lastState = newState;
});
store.dispatch({ type: 'ADD', value: 'apple' });
store.dispatch({ type: 'ADD', value: 'banana' });
store.dispatch({ type: 'ADD', value: 'cranberry' });
store.dispatch({ type: 'REMOVE', value: 'banana' });
