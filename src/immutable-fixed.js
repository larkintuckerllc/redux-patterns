/* eslint no-console: "off" */
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
// import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';
// import { List, Map } from 'immutable';
import { fromJS, List, Map } from 'immutable';

/*
const itemSchema = new schema.Entity('items');
const itemsSchema = new schema.Array(itemSchema);
*/
// REDUCERS
const byId = ( state = Map({}), action) => {
  switch (action.type) {
    case 'FETCH': {
      const entry = {}; // INTERNALLY NOT USING IMMUTABLE.JS
      for (let i = 0; i < action.value.size; i += 1) {
        const item = action.value.get(i);
        entry[item.get('id')] = item;
      }
      return state.merge(entry);
    }
    case 'ADD':
    case 'UPDATE': {
      // return state.merge(action.value.entities.items);
      const entry = {};
      entry[action.value.get('id')] = action.value;
      return state.merge(entry);
    }
    case 'REMOVE':
      // return state.delete(action.value.result);
      return state.delete(action.value.get('id'));
    default:
      return state;
  }
};
const ids = (state = List([]), action) => {
  switch (action.type) {
    case 'FETCH':
      // return List(action.value.result);
      return action.value.map(o => o.get('id'));
    case 'ADD':
      // return state.push(action.value.result);
      return state.push(action.value.get('id'));
    case 'REMOVE':
      // return state.delete(state.indexOf(action.value.result));
      return state.delete(state.indexOf(action.value.get('id')));
    default:
      return state;
  }
};
const myReducer = combineReducers({
  byId,
  ids,
});
// SELECTORS
const getItem = (state, id) => state.get('byId').get(id);
const getItemsIds = state => state.get('ids');
const getItemsById = state => state.get('byId');
const getItems = createSelector(
  [getItemsIds, getItemsById],
  (itemsIds, itemsById) => itemsIds.map(id => itemsById.get(id)),
);
// ACTION CREATORS
const fetch = items => ({
  type: 'FETCH',
  // value: normalize(items, itemsSchema),
  value: items,
});
const update = item => ({
  type: 'UPDATE',
  // value: normalize(item, itemSchema),
  value: item,
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
// store.dispatch(fetch(
store.dispatch(fetch(fromJS(
  [{
    id: 'm',
    name: 'mango',
    description: 'Sweet and sticky',
  }, {
    id: 'n',
    name: 'nectarine',
    description: 'Crunchy goodness',
  }],
// ));
)));
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
let mango = getItem(state, 'm');
console.log('BEFORE UPDATE ACTION');
console.log(mango);
// EXERCISING - UPDATE PROPER
mango = mango.set('description','Sweet and super sticky');
// store.dispatch(update(mango.toJS()));
store.dispatch(update(mango));
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER UPDATE ACTION');
console.log(mango);
// EXERCISING - UPDATE IMPROPER
mango = mango.set('description','Unripe and sour');
// EXERCISING - OUTPUT CURRENT VALUE
state = store.getState();
mango = getItem(state, 'm');
console.log('AFTER IMPROPER UPDATE');
console.log(mango);
