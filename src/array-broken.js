/* eslint no-console: "off" */
import { createStore } from 'redux';

const adder = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      state.push(action.value); // BREAKS PURE FUNCTION
      return state; // BREAKS PURE FUNCTION
    default:
      return state;
  }
};
const store = createStore(adder);
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
