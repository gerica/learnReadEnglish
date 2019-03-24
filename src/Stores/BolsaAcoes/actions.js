import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  // GERAL
  resetRedux: [],
  success: ['message'],
  failure: ['error'],

  fetchCotacaoRequest: ['papel'],
  fetchCotacaoSuccess: ['listaCotacaoDia'],

  savePapelRequest: ['payload'],

  deletePapelRequest: ['payload'],

  fetchPapeisPorUserRequest: ['user'],
  fetchPapeisPorUserSuccess: ['listaPapeis']
});

export const BolsaAcoesTypes = Types;
export default Creators;
