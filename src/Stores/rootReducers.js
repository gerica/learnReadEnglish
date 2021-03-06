// eslint-disable-next-line import/no-unresolved
import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import sessionReducer from './Session/reducer';
import textoReducer from './Texto/reducer';
import flashCardReducer from './FlashCard/reducer';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer() {
  return combineReducers({
    form: reduxFormReducer,
    session: sessionReducer,
    texto: textoReducer,
    flashCard: flashCardReducer
  });
}
