import { createReducer } from 'reduxsauce';
import { TextoTypes } from './actions';

const INITIAL_STATE = {
  loading: false,  
  error: null,
  listWords: null,
  message: null,
  text: null,
};

// Geral
export const request = (state = INITIAL_STATE) => {  
  return ({ ...state, loading: true });
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

// Cadastrar doação
export const cadastroDoacaoRequest = (state = INITIAL_STATE) => ({
  ...state,
  loading: true
});

// Reset
export const resetRedux = (state = INITIAL_STATE) => ({
  ...state,
  error: null,
  message: null,
  done: false
});

export const compileTextWordsSuccess = (state = INITIAL_STATE, { listWords, texto }) => {
  return ({
    ...state,
    error: null,
    loading: false,
    message: null,
    listWords,
    text:texto
  });
};

export const doneTextWordsSuccess = (state = INITIAL_STATE, { word }) => {
  const {listWords} = state;
  
  const result = [];
  listWords.forEach(e=> {
    if(e.origin !== word.origin){
      result.push(e);
    }
  });
  
  return ({
    ...state,
    error: null,
    loading: false,
    message: null,
    listWords: result
  });
};

const perfilReducer = createReducer(INITIAL_STATE, {
  // RESET
  [TextoTypes.RESET_REDUX]: resetRedux,
  [TextoTypes.SUCCESS]: success,
  [TextoTypes.FAILURE]: failure,

  [TextoTypes.COMPILE_TEXT_WORDS_REQUEST]: request,
  [TextoTypes.COMPILE_TEXT_WORDS_SUCCESS]: compileTextWordsSuccess,

  [TextoTypes.DONE_TEXT_WORDS_REQUEST]: request,  
  [TextoTypes.DONE_TEXT_WORDS_SUCCESS]: doneTextWordsSuccess,  

});

export default perfilReducer;
