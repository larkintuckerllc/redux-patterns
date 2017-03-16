/* eslint no-console: "off" */
import { combineReducers, createStore } from 'redux';

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD':
    case 'UPDATE': {
      const entry = {};
      entry[action.value.id] = action.value;
      return {
        ...state,
        ...entry,
      };
    }
    case 'REMOVE': {
      const newState = { ...state };
      delete newState[action.value.id];
      return newState;
    }
    case 'FETCH': {
      const entry = {};
      for (let i = 0; i < action.value.length; i += 1) {
        const item = action.value[i];
        entry[item.id] = item;
      }
      return {
        ...state,
        ...entry,
      };
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value.id];
    case 'REMOVE': {
      const newState = [...state];
      newState.splice(state.indexOf(action.value.id), 1);
      return newState;
    }
    case 'FETCH':
      return [...state, ...action.value.map(o => o.id)];
    default:
      return state;
  }
};
const myReducer = combineReducers({
  byId,
  ids,
});
const store = createStore(myReducer);
const state = store.getState();
let lastById = state.byId;
let lastIds = state.ids;
store.subscribe(() => {
  const newState = store.getState();
  console.log(newState);
  console.log(newState.byId === lastById);
  console.log(newState.ids === lastIds);
  lastById = newState.byId;
  lastIds = newState.ids;
});
store.dispatch({
  type: 'FETCH',
  value: [{
    id: 'm',
    name: 'mango',
    description: 'Sweet and sticky',
  }, {
    id: 'n',
    name: 'nectarine',
    description: 'Crunchy goodness',
  }],
});
store.dispatch({
  type: 'UPDATE',
  value: {
    id: 'm',
    name: 'mango',
    description: 'Sweet and super sticky',
  },
});
