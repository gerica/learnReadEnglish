import { createSelector } from 'reselect';

const storeBolsaAcoes = state => state.bolsaAcoes;
const storeForm = state => state.form;

const selectorListaCotacaoDia = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.listaCotacaoDia
  );
const selectorLoading = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.loading
  );
const selectorError = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.error
  );
const selectorMessage = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.message
  );
const selectorListaPapeis = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.listaPapeis
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
  selectorListaCotacaoDia,
  selectorListaPapeis
};
