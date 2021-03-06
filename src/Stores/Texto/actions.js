import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  // GERAL
  resetRedux: [],
  success: ['message'],
  failure: ['error'],

  // CADASTRAR PET PARA DOAÇÃO
  compileTextWordsRequest: ['payload'],
  compileTextWordsSuccess: ['listWords', 'texto'],

  doneTextWordsRequest: ['payload'],
  doneTextWordsSuccess: ['word'],

  fetchAllWordsForUserRequest: ['payload'],
  fetchAllWordsForUserSuccess: ['listWordsForUser', 'message'],

  forgetWordRequest: ['payload'],
  addFlashCardRequest: ['payload'],
  removeFlashCardRequest: ['payload'],

  filterListWords: ['filter']
});

export const TextoTypes = Types;
export default Creators;
