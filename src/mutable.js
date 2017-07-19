/* eslint no-console: "off" */
import { combineReducers, createStore } from 'redux';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';

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
// SELECTORS
const getItem = (state, id) => state.byId[id];
const getItemsIds = state => state.ids;
const getItemsById = state => state.byId;
const getItems = createSelector(
  [getItemsIds, getItemsById],
  (itemsIds, itemsById) => itemsIds.map(id => itemsById[id]),
);
// ACTION CREATORS
const fetch = items => ({
  type: 'FETCH',
  value: normalize(items, itemsSchema),
});
const update = item => ({
  type: 'UPDATE',
  value: normalize(item, itemSchema),
});
// STORE
const store = createStore(myReducer);
let state = store.getState();
let lastItems = getItems(state);
store.subscribe(() => {
  const newState = store.getState();
  const newItems = getItems(newState);
  console.log(newItems === lastItems);
  lastItems = newItems;
});
// EXERCISING - FETCH
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
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
let mango = getItem(state, 'm');
console.log('BEFORE UPDATE ACTION');
console.log(mango);
// EXERCISING - UPDATE PROPER
mango.description = 'Sweet and super sticky';
store.dispatch(update(mango));
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER UPDATE ACTION');
console.log(mango);
// EXCERCISING - UPDATE IMPROPER
mango.description = 'Unripe and sour';
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER IMPROPER UPDATE');
console.log(mango);
