/* eslint-disable no-plusplus */
import { takeLatest, all, call, put } from 'redux-saga/effects';
import moment from 'moment';
import FlashCardActions, { FlashCardTypes } from './actions';
import FbFlashCardUsuarioService from '../../Service/FbFlashCardUsuarioService';
import FbTextoService from '../../Service/FbTextoService';
import FbTextoUsuarioService from '../../Service/FbTextoUsuarioService';
// import { YANDEX_KEY, MSG_001 } from '../../Utils/constants';

function* criarFlashCardsPalavrasConhecidas(payload, blackList) {
  try {
    const { user } = payload;
    const palavrasConchecidas = yield call(
      [FbTextoUsuarioService, FbTextoUsuarioService.fetchByUser],
      payload
    );

    const listCard = [];
    if (palavrasConchecidas.length === 0) {
      return listCard;
    }

    let wordsKnows = palavrasConchecidas[0].words;

    wordsKnows = wordsKnows.filter(p => {
      const existe = blackList.find(b => b.word.id === p.id);
      if (existe) {
        return false;
      }
      return true;
    });

    const palavrasPodeSerAdicionada = wordsKnows.filter(p => p.addFlashCards);

    if (
      palavrasPodeSerAdicionada.length > 0 &&
      palavrasPodeSerAdicionada.length <= 10
    ) {
      palavrasPodeSerAdicionada.forEach(p =>
        listCard.push({
          word: { ...p },
          user: user.uid,
          nextCheck: new Date(),
          times: 0,
          lastsNote: []
        })
      );
    } else if (palavrasPodeSerAdicionada.length > 10) {
      while (listCard.length < 10) {
        const item =
          palavrasPodeSerAdicionada[
            Math.floor(Math.random() * palavrasPodeSerAdicionada.length)
          ];
        const jaExisi = listCard.find(e => e.word.id === item.word.id);
        if (!jaExisi) {
          listCard.push({
            word: { ...item.word, id: item.id },
            user: user.uid,
            nextCheck: new Date(),
            times: 0,
            lastsNote: []
          });
        }
      }
    }

    return listCard;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

function* criarFlashCardsBaseTexto(payload, blackList) {
  try {
    const { user } = payload;
    let baseTexto = yield call([FbTextoService, FbTextoService.fetchAll]);
    const listCard = [];
    baseTexto.forEach(base => {
      // baseTexto = baseTexto.filter(p => {
      //   const existe = blackList.find(b => b.word.id === p.id);
      //   if (existe) {
      //     return false;
      //   }
      //   return true;
      // });
      if (base.texts.length <= 10) {
        base.texts.forEach(b =>
          listCard.push({
            word: { ...b },
            user: user.uid,
            nextCheck: new Date(),
            times: 0,
            lastsNote: []
          })
        );
      } else {
        while (listCard.length < 10) {
          const item =
            base.texts[Math.floor(Math.random() * base.texts.length)];
          const jaExisi = listCard.find(e => e.word.id === item.id);
          if (!jaExisi) {
            listCard.push({
              word: { ...item },
              user: user.uid,
              nextCheck: new Date(),
              times: 0,
              lastsNote: []
            });
          }
        }
      }
    });

    return listCard;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

function* fetchFlashCardForUserRequest({ payload }) {
  try {
    let cards = yield call(
      [FbFlashCardUsuarioService, FbFlashCardUsuarioService.fetchByUser],
      payload
    );
    let result = [];
    let blackList = [];

    if (cards && cards.length > 0) {
      const toDay = moment(new Date());
      cards = cards.filter(c => {
        if (toDay.isAfter(moment(c.nextCheck))) {
          return true;
        }
        blackList.push(c);
        return false;
      });
    }

    blackList = blackList.concat(cards);

    if (!cards || cards.length === 0 || cards.length <= 20) {
      // const baseTexto = yield call([FbTextoService, FbTextoService.fetchAll]);

      result = result.concat(
        yield* criarFlashCardsPalavrasConhecidas(payload, blackList)
      );
      blackList = blackList.concat(result);
      result = result.concat(
        yield* criarFlashCardsBaseTexto(payload, blackList)
      );
    }

    yield put(FlashCardActions.fetchFlashCardForUserSuccess(result));
  } catch (err) {
    console.log({ err });
    yield put(FlashCardActions.failure(err));
  }
}

function* answerFlashCardRequest({ payload }) {
  try {
    const { answer, card } = payload;
    const notes = card.lastsNote;
    notes.push(answer);

    const cardSave = {
      ...card,
      lastsNote: notes,
      times: card.times + 1,
      nextCheck: moment(card.nextCheck)
        .add(answer.peso, 'days')
        .toDate()
    };

    yield call(
      [FbFlashCardUsuarioService, FbFlashCardUsuarioService.save],
      cardSave
    );

    yield put(FlashCardActions.toggleShowAnswer());
    yield put(FlashCardActions.answerFlashCardSuccess());
  } catch (err) {
    console.log({ err });
    yield put(FlashCardActions.failure(err));
  }
}

export function* watchFetchFlashCardForUserRequest() {
  yield takeLatest(
    FlashCardTypes.FETCH_FLASH_CARD_FOR_USER_REQUEST,
    fetchFlashCardForUserRequest
  );
}

export function* watchAnswerFlashCardRequest() {
  yield takeLatest(
    FlashCardTypes.ANSWER_FLASH_CARD_REQUEST,
    answerFlashCardRequest
  );
}

export default function* saga() {
  yield all([
    watchFetchFlashCardForUserRequest(),
    watchAnswerFlashCardRequest()
  ]);
}
