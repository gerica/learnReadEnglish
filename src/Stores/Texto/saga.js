/* eslint-disable no-plusplus */
import { takeLatest, all, call, put } from 'redux-saga/effects';
import TextoActions, { TextoTypes } from './actions';
import FbTextoService from '../../Service/FbTextoService';
import FbTextoUsuarioService from '../../Service/FbTextoUsuarioService';
import { YANDEX_KEY, MSG_001 } from '../../Utils/constants';

const sourceLang = 'auto';
const targetLang = 'pt';
const COUNT_TEXT = 1000;

function* addRemoveFlashCard(payload, addOrRemove) {
  try {
    const { word, user } = payload;
    const list = yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser],
      payload
    );
    const wordsKnows = list[0];
    const changeWord = wordsKnows.words.find(w => w.origin === word.origin);
    changeWord.addFlashCards = addOrRemove;
    yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.update],
      wordsKnows
    );
    yield put(
      TextoActions.fetchAllWordsForUserRequest({
        user,
        msg: MSG_001
      })
    );
  } catch (err) {
    console.log({ err });
    yield put(TextoActions.failure(err));
  }
}

function* saveOrUpdateBaseTexto(payload) {
  if (payload.id) {
    yield call([FbTextoService, FbTextoService.update], payload);
  } else {
    yield call([FbTextoService, FbTextoService.save], payload);
  }
}

function toCleanWord(element) {
  let str = element.replace(/[ÀÁÂÃÄÅ]/g, 'A');
  str = str.replace(/[àáâãäå]/g, 'a');
  str = str.replace(/[ÈÉÊË]/g, 'E');
  str = str.replace(/[^a-z0-9]/gi, '');
  const elementClean = str.toLocaleLowerCase();
  return elementClean;
}

function* translateGoogle(element) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(
      element
    )}`;
    // eslint-disable-next-line no-undef
    const ReadableStream = yield call(fetch, url);
    const response = yield ReadableStream.json();

    let textObj;
    if (response && response.length > 0) {
      textObj = {
        origin: response[0][0][1],
        translate: response[0][0][0]
      };
    }
    return textObj;
  } catch (err) {
    console.error(err);
    return null;
  }
}
function* translateYandex(element) {
  try {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_KEY}&text=${encodeURI(
      element
    )}&lang=${targetLang}`;
    // eslint-disable-next-line no-undef
    const ReadableStream = yield call(fetch, url);
    const response = yield ReadableStream.json();
    let textObj;
    if (response && response.text) {
      textObj = {
        origin: element,
        translate: response.text[0]
      };
    }
    return textObj;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Recuperar pet por usuário
 * @param {user} param0
 */
function* translateWords({ payload }) {
  try {
    const {
      values: { texto }
    } = payload;
    const words = texto.split(' ');

    const result = [];
    let resultNews;
    const baseTexto = yield call([FbTextoService, FbTextoService.fetchAll]);

    const palavrasConchecidas = yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser],
      payload
    );

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < words.length; index++) {
      const element = words[index];
      // const elementClean = yield* cleanElement(element);
      const elementClean = toCleanWord(element);
      if (elementClean.length === 0) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (palavrasConchecidas && palavrasConchecidas.length > 0) {
        const jaSabe = palavrasConchecidas[0].words.find(
          e => e.origin === elementClean
        );
        if (jaSabe) {
          if (jaSabe.addFlashCards) {
            result.push(jaSabe);
          }
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      let textExist = null;
      for (let x = 0; x < baseTexto.length; x++) {
        if (textExist) {
          break;
        }
        const baseTextoElemento = baseTexto[x];

        if (baseTextoElemento && baseTextoElemento.texts) {
          textExist = baseTextoElemento.texts.find(
            t => t.origin === elementClean
          );
          if (textExist) {
            break;
          }
        }
      }

      if (!textExist) {
        if (resultNews && resultNews.texts.length >= COUNT_TEXT) {
          yield* saveOrUpdateBaseTexto(resultNews);
          resultNews = null;
        }

        if (!resultNews && baseTexto && baseTexto.length > 0) {
          resultNews = baseTexto.find(b => b.texts.length < COUNT_TEXT);
        }

        if (!resultNews) {
          resultNews = { texts: [] };
        }

        let textObj = yield* translateYandex(elementClean);
        if (!textObj) {
          textObj = yield* translateGoogle(elementClean);
        }

        if (textObj) {
          resultNews.texts.push(textObj);
          result.push(textObj);
        }
      } else {
        result.push(textExist);
      }
    }

    // console.log({ resultNews });
    // yield* saveOrUpdateBaseTexto(resultNews);
    if (resultNews) {
      yield* saveOrUpdateBaseTexto(resultNews);
    }

    yield put(TextoActions.compileTextWordsSuccess(result, texto));
  } catch (err) {
    console.log({ err });
    // console.trace();
    yield put(TextoActions.failure(err));
  }
}

function* fetchAllWordsForUserRequest({ payload }) {
  try {
    const wordsKnows = yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser],
      payload
    );
    const { msg } = payload;
    yield put(TextoActions.fetchAllWordsForUserSuccess(wordsKnows, msg));
  } catch (err) {
    console.log({ err });
    yield put(TextoActions.failure(err));
  }
}

function* forgetWordRequest({ payload }) {
  try {
    const { word, user } = payload;

    yield call([FbTextoUsuarioService, FbTextoUsuarioService.delete], word);
    yield put(
      TextoActions.fetchAllWordsForUserRequest({
        user,
        msg: MSG_001
      })
    );
  } catch (err) {
    console.log({ err });
    yield put(TextoActions.failure(err));
  }
}

function* addFlashCardRequest({ payload }) {
  yield* addRemoveFlashCard(payload, true);
}

function* removeFlashCardRequest({ payload }) {
  yield* addRemoveFlashCard(payload, false);
}

function* doneTextWordsRequest({ payload }) {
  try {
    const { word, user } = payload;
    const list = yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser],
      payload
    );

    const wordsKnows = list[0];

    if (!wordsKnows) {
      const obj = {
        words: [
          {
            ...word,
            addFlashCards: word.addFlashCards || false
          }
        ],
        user: user.uid
      };
      yield call([FbTextoUsuarioService, FbTextoUsuarioService.save], obj);
    } else {
      wordsKnows.words.push({
        ...word,
        addFlashCards: word.addFlashCards || false
      });
      yield call(
        [FbTextoUsuarioService, FbTextoUsuarioService.update],
        wordsKnows
      );
    }

    yield put(TextoActions.doneTextWordsSuccess(word));
  } catch (err) {
    console.log({ err });
    yield put(TextoActions.failure(err));
  }
}

export function* watchTranslateWords() {
  yield takeLatest(TextoTypes.COMPILE_TEXT_WORDS_REQUEST, translateWords);
}

export function* watchDoneTextWordsRequest() {
  yield takeLatest(TextoTypes.DONE_TEXT_WORDS_REQUEST, doneTextWordsRequest);
}

export function* watchFetchAllWordsForUserRequest() {
  yield takeLatest(
    TextoTypes.FETCH_ALL_WORDS_FOR_USER_REQUEST,
    fetchAllWordsForUserRequest
  );
}

export function* watchForgetWordRequest() {
  yield takeLatest(TextoTypes.FORGET_WORD_REQUEST, forgetWordRequest);
}

export function* watchAddFlashCardRequest() {
  yield takeLatest(TextoTypes.ADD_FLASH_CARD_REQUEST, addFlashCardRequest);
}

export function* watchRemoveFlashCardRequest() {
  yield takeLatest(
    TextoTypes.REMOVE_FLASH_CARD_REQUEST,
    removeFlashCardRequest
  );
}

export default function* saga() {
  yield all([
    watchTranslateWords(),
    watchDoneTextWordsRequest(),
    watchFetchAllWordsForUserRequest(),
    watchForgetWordRequest(),
    watchAddFlashCardRequest(),
    watchRemoveFlashCardRequest()
  ]);
}
