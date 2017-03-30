/* eslint no-console: "off" */
import { combineReducers, createStore } from 'redux';
import { normalize, schema } from 'normalizr';

const itemSchema = new schema.Entity('items');
const itemsSchema = new schema.Array(itemSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH':
    case 'ADD':
    case 'UPDATE': {
      return {
        ...state,
        ...action.value.entities.items,
      };
    }
    case 'REMOVE': {
      const newState = { ...state };
      delete newState[action.value.result];
      return newState;
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case 'FETCH':
      return action.value.result;
    case 'ADD':
      return [...state, action.value.result];
    case 'REMOVE': {
      const newState = [...state];
      newState.splice(state.indexOf(action.value.result), 1);
      return newState;
    }
    default:
      return state;
  }
};
const myReducer = combineReducers({
  byId,
  ids,
});
// ACTION CREATORS
const fetch = items => ({
  type: 'FETCH',
  value: normalize(items, itemsSchema),
});
const update = item => ({
  type: 'UPDATE',
  value: normalize(item, itemSchema),
});
// MISC
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
store.dispatch(fetch(
  [{
    id: 'm',
    name: 'mango',
    description: 'Sweet and sticky',
  }, {
    id: 'n',
    name: 'nectarine',
    description: 'Crunchy goodness',
  }],
));
store.dispatch(update(
  {
    id: 'm',
    name: 'mango',
    description: 'Sweet and super sticky',
  },
));
