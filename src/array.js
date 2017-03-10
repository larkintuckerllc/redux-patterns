/* eslint no-console: "off" */
import { createStore } from 'redux';

const adder = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      // state.push(action.value); // BREAKS PURE FUNCTION
      // return state; // BREAKS PURE FUNCTION
      return [...state, action.value];
    default:
      return state;
  }
};
const store = createStore(adder);
store.subscribe(() => {
  console.log(store.getState());
});
store.dispatch({ type: 'ADD', value: 'apple' });
store.dispatch({ type: 'ADD', value: 'banana' });
store.dispatch({ type: 'ADD', value: 'cranberry' });
