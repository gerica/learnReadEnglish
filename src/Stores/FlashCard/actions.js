import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  // GERAL
  resetRedux: [],
  success: ['message'],
  failure: ['error'],
  toggleShowAnswer: [],

  // CADASTRAR PET PARA DOAÇÃO
  fetchFlashCardForUserRequest: ['payload'],
  fetchFlashCardForUserSuccess: ['listFlasCard'],

  answerFlashCardRequest: ['payload'],
  answerFlashCardSuccess: []
});

export const FlashCardTypes = Types;
export default Creators;
