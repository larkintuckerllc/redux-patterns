/* eslint no-console: "off" */
// import { createStore, combineReducers } from 'redux';
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';
import { List, Map } from 'immutable';

const itemSchema = new schema.Entity('items');
const itemsSchema = new schema.Array(itemSchema);
// REDUCERS
const byId = ( /* state = {} */ state = Map({}), action) => {
  switch (action.type) {
    case 'FETCH':
    case 'ADD':
    case 'UPDATE':
      /*
      return {
        ...state,
        ...action.value.entities.items,
      };
      */
      return state.merge(action.value.entities.items);
    case 'REMOVE':
      /*
      const newState = { ...state };
      delete newState[action.value.result];
      return newState;
      */
      return state.delete(action.value.result);
    default:
      return state;
  }
};
const ids = ( /* state = [] */ state = List([]), action) => {
  switch (action.type) {
    case 'FETCH':
      // return action.value.result;
      return List(action.value.result);
    case 'ADD':
      // return [...state, action.value.result];
      return state.push(action.value.result);
    case 'REMOVE':
      /*
      const newState = [...state];
      newState.splice(state.indexOf(action.value.result), 1);
      return newState;
      */
      return state.delete(state.indexOf(action.value.result));
    default:
      return state;
  }
};
const myReducer = combineReducers({
  byId,
  ids,
});
// SELECTORS
// const getItem = (state, id) => state.byId[id];
const getItem = (state, id) => state.get('byId').get(id);
// const getItemsIds = state => state.ids;
const getItemsIds = state => state.get('ids');
// const getItemsById = state => state.byId;
const getItemsById = state => state.get('byId');
const getItems = createSelector(
  [getItemsIds, getItemsById],
  // (itemsIds, itemsById) => itemsIds.map(id => itemsById[id]),
  (itemsIds, itemsById) => itemsIds.map(id => itemsById.get(id)),
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
// mango.description = 'Sweet and super sticky';
mango = mango.set('description','Sweet and super sticky');
// store.dispatch(update(mango));
store.dispatch(update(mango.toJS()));
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER UPDATE ACTION');
console.log(mango);
// EXERCISING - UPDATE IMPROPER
// mango.description = 'Unripe and sour';
mango = mango.set('description','Unripe and sour');
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER IMPROPER UPDATE');
console.log(mango);
