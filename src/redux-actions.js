/* eslint no-console: "off" */
import { combineReducers, createStore } from 'redux';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';
import { combineActions, createActions, handleActions } from 'redux-actions';

const itemSchema = new schema.Entity('items');
const itemsSchema = new schema.Array(itemSchema);

// ACTION CREATORS
/*
const fetch = items => ({
  type: 'FETCH',
  value: normalize(items, itemsSchema),
});
const update = item => ({
  type: 'UPDATE',
  value: normalize(item, itemSchema),
});
*/
const actionCreators = createActions({
  FETCH: items => normalize(items, itemsSchema),
  UPDATE: item => normalize(item, itemSchema),
  ADD: item => normalize(item, itemSchema),
  REMOVE: item => normalize(item, itemSchema),
});

// REDUCERS
/*
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
*/
const byId = handleActions({
  [combineActions(
    actionCreators.fetch,
    actionCreators.update,
    actionCreators.add,
  )](state, action) {
   return { ...state, ...action.payload.entities.items };
  },
  [actionCreators.remove](state,action) {
    const newState = { ...state };
    delete newState[action.payload.result];
    return newState;
  },
}, {});
/*
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
*/
const ids = handleActions({
  [actionCreators.fetch](state, action) {
    return action.payload.result;
  },
  [actionCreators.add](state, action) {
    return [...state, action.payload.result];
  },
  [actionCreators.remove](state, action) {
    const newState = [...state];
    newState.splice(state.indexOf(action.payload.result), 1);
    return newState;
  },
}, []);
const myReducer = combineReducers({
  byId,
  ids,
});
// SELECTORS
const getItemsIds = state => state.ids;
const getItemsById = state => state.byId;
const getItems = createSelector(
  [getItemsIds, getItemsById],
  (itemsIds, itemsById) => itemsIds.map(id => itemsById[id]),
);
// STORE
const store = createStore(myReducer);
const state = store.getState();
let lastItems = getItems(state);
store.subscribe(() => {
  const newState = store.getState();
  const newItems = getItems(newState);
  console.log(newItems === lastItems);
  console.log(newItems); // ADDED FOR CLARITY
  lastItems = newItems;
});
// EXERCISING
store.dispatch(actionCreators.fetch(
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
store.dispatch(actionCreators.update(
  {
    id: 'm',
    name: 'mango',
    description: 'Sweet and super sticky',
  },
));
/*
store.dispatch({
  type: 'BOGUS',
});
*/
