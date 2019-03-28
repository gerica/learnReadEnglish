/* eslint-disable no-plusplus */
import { takeLatest, all, call, put } from 'redux-saga/effects';
import TextoActions, { TextoTypes } from './actions';
import FbTextoService from '../../Service/FbTextoService';
import FbTextoUsuarioService from '../../Service/FbTextoUsuarioService';
// import FbListaDoacaoService from '../../Service/FbListaDoacaoService';
// import { MSG_001 } from '../../Utils/constants';

const sourceLang = 'auto';
const targetLang = 'pt';

function* gravarBaseTexto(textObj) {  
  yield call([FbTextoService, FbTextoService.save], textObj);  
}

/**
 * Recuperar pet por usuário
 * @param {user} param0
 */
function* translateWords({ payload }) {
  try {
    const { values:{ texto }} = payload;
    const words =texto.split(' ');
    
    const result = [];
    const baseTexto = yield call([FbTextoService, FbTextoService.fetchAll]);
    const palavrasConchecidas = yield call([FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser], payload);  
    
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < words.length; index++) {
      const element = words[index];      
      if(palavrasConchecidas && palavrasConchecidas.length>0){
        const jaSabe = palavrasConchecidas.find(e=>e.word.origin === element);
        if(jaSabe){
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      
      const textExist = baseTexto.find(t=> t.origin === element);
      
      if(!textExist) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(element)}`;
        
        // eslint-disable-next-line no-undef
        const ReadableStream = yield call(fetch, url);
        const response = yield ReadableStream.json();
        
        if(response && response.length>0){
          const textObj = {
            origin:response[0][0][1],
            translate: response[0][0][0]
          };

          yield* gravarBaseTexto(textObj);    
          result.push(textObj);        
        }
      } else {
        result.push(textExist);
      }
    }
  
    yield put(TextoActions.compileTextWordsSuccess(result, texto));
  } catch (err) {
    console.log({err});
    yield put(TextoActions.failure(err));
  }
}

function* doneTextWordsRequest({ payload }) {
  try {
    const { word, user } = payload;
    const obj = {
      word: {...word},
      user: user.uid
    };

    yield call([FbTextoUsuarioService, FbTextoUsuarioService.save], obj);  
  
    yield put(TextoActions.doneTextWordsSuccess(word));
  } catch (err) {
    yield put(TextoActions.failure(err));
  }
}

export function* watchTranslateWords() {
  yield takeLatest(TextoTypes.COMPILE_TEXT_WORDS_REQUEST, translateWords);
}

export function* watchDoneTextWordsRequest() {
  yield takeLatest(TextoTypes.DONE_TEXT_WORDS_REQUEST, doneTextWordsRequest);
}

export default function* saga() {
  yield all([
    watchTranslateWords(),    
    watchDoneTextWordsRequest(),    
  ]);
}
