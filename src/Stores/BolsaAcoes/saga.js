import { takeLatest, all, call, put } from 'redux-saga/effects';
import BolsaAcoesActions, { BolsaAcoesTypes } from './actions';
// import FbListaDoacaoService from '../../Service/FbListaDoacaoService';
import { MSG_001 } from '../../Utils/constants';
import { GLOBAL_QUOTE, KEY } from '../../Utils/alphavantage';
import FbPapelService from '../../Service/FbPapelService';

/**
 * Recuperar pet por usuário
 * @param {user} param0
 */
function* fetchCotacaoRequest({ papel }) {
  try {
    const url = `${GLOBAL_QUOTE}&symbol=${papel}&apikey=${KEY}`;
    // const url =
    //   'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo';
    // eslint-disable-next-line no-undef
    const ReadableStream = yield call(fetch, url);
    const response = yield ReadableStream.json();

    yield put(BolsaAcoesActions.fetchCotacaoSuccess(response));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Recuperar  por usuário
 * @param {user} param0
 */
function* fetchPapeisPorUserRequest({ user }) {
  try {
    const values = yield call(
      [FbPapelService, FbPapelService.getByIdUser],
      user
    );
    yield put(BolsaAcoesActions.fetchPapeisPorUserSuccess(values));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Salvar papel do usuário
 */
function* savePapelRequest({ payload }) {
  try {
    // console.log(payload);
    const dados = { ...payload };
    if (!payload.papel.toUpperCase().endsWith('.SA')) {
      dados.papel = `${payload.papel.toUpperCase()}.SA`;
    } else {
      dados.papel = payload.papel.toUpperCase();
    }
    yield call([FbPapelService, FbPapelService.save], dados);

    yield put(
      BolsaAcoesActions.fetchPapeisPorUserRequest({ uid: payload.user })
    );
    yield put(BolsaAcoesActions.success(MSG_001));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Apagar Papel
 */
function* deletePapelRequest({ payload }) {
  try {
    yield call([FbPapelService, FbPapelService.delete], payload);

    yield put(
      BolsaAcoesActions.fetchPapeisPorUserRequest({ uid: payload.user })
    );
    yield put(BolsaAcoesActions.success(MSG_001));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

export function* watchFetchCotacaoRequest() {
  yield takeLatest(BolsaAcoesTypes.FETCH_COTACAO_REQUEST, fetchCotacaoRequest);
}

export function* watchSavePapelRequest() {
  yield takeLatest(BolsaAcoesTypes.SAVE_PAPEL_REQUEST, savePapelRequest);
}

export function* watchDeletePapelRequest() {
  yield takeLatest(BolsaAcoesTypes.DELETE_PAPEL_REQUEST, deletePapelRequest);
}

export function* watchfetchPapeisPorUserRequest() {
  yield takeLatest(
    BolsaAcoesTypes.FETCH_PAPEIS_POR_USER_REQUEST,
    fetchPapeisPorUserRequest
  );
}

export default function* petSaga() {
  yield all([watchFetchCotacaoRequest()]);
  yield all([watchSavePapelRequest()]);
  yield all([watchfetchPapeisPorUserRequest()]);
  yield all([watchDeletePapelRequest()]);
}
