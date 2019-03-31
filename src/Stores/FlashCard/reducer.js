import { createReducer } from 'reduxsauce';
import { FlashCardTypes } from './actions';

const INITIAL_STATE = {
  loading: false,
  error: null,
  message: null,
  showAnswer: false,
  listFlasCard: null,
  selectedCard: null
};

// Geral
export const request = (state = INITIAL_STATE) => {
  return { ...state, loading: true };
};

export const success = (state = INITIAL_STATE, { message }) => ({
  ...state,
  loading: false,
  message
});
export const failure = (state = INITIAL_STATE, { error }) => ({
  ...state,
  loading: false,
  error
});

// Reset
export const resetRedux = (state = INITIAL_STATE) => ({
  ...state,
  error: null,
  message: null,
  listFlasCard: null
});

// Reset
export const toggleShowAnswer = (state = INITIAL_STATE) => {
  const { showAnswer } = state;
  return {
    ...state,
    showAnswer: !showAnswer
  };
};

export const fetchFlashCardForUserSuccess = (
  state = INITIAL_STATE,
  { listFlasCard }
) => {
  let selected;
  if (listFlasCard && listFlasCard.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    selected = listFlasCard[0];
  }
  return {
    ...state,
    error: null,
    loading: false,
    message: null,
    listFlasCard,
    selectedCard: selected,
    showAnswer: false
  };
};

export const answerFlashCardSuccess = (state = INITIAL_STATE) => {
  const { listFlasCard, selectedCard } = state;

  const result = [];
  listFlasCard.forEach(e => {
    if (e.word.id !== selectedCard.word.id) {
      result.push(e);
    }
  });

  let selected;
  if (result && result.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    selected = result[0];
  }

  return {
    ...state,
    error: null,
    loading: false,
    message: null,
    listFlasCard: result,
    selectedCard: selected
  };
};

const localReducer = createReducer(INITIAL_STATE, {
  // RESET
  [FlashCardTypes.RESET_REDUX]: resetRedux,
  [FlashCardTypes.SUCCESS]: success,
  [FlashCardTypes.FAILURE]: failure,
  [FlashCardTypes.TOGGLE_SHOW_ANSWER]: toggleShowAnswer,

  [FlashCardTypes.FETCH_FLASH_CARD_FOR_USER_REQUEST]: request,
  [FlashCardTypes.FETCH_FLASH_CARD_FOR_USER_SUCCESS]: fetchFlashCardForUserSuccess,

  [FlashCardTypes.ANSWER_FLASH_CARD_REQUEST]: request,
  [FlashCardTypes.ANSWER_FLASH_CARD_SUCCESS]: answerFlashCardSuccess
});

export default localReducer;
