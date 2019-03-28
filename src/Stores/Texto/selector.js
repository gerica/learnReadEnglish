import { createSelector } from 'reselect';

const storeLocal = state => state.texto;
const storeForm = state => state.form;

const selectorLoading = () =>
  createSelector(
    storeLocal,
    store => store.loading
  );
const selectorError = () =>
  createSelector(
    storeLocal,
    store => store.error
  );
const selectorMessage = () =>
  createSelector(
    storeLocal,
    store => store.message
  );
const selectorListWords = () =>
  createSelector(
    storeLocal,
    store => store.listWords
  );
const selectorText = () =>
  createSelector(
    storeLocal,
    store => store.text
  );

const selectorForm = () =>
  createSelector(
    storeForm,
    form => form
  );

export {
  selectorForm,
  selectorLoading,
  selectorError,
  selectorMessage,
  selectorListWords,
  selectorText,
};
