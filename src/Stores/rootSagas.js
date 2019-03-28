import { all } from 'redux-saga/effects';
import * as sessionSaga from './Session/saga';
import * as textoSaga from './Texto/saga';

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    textoSaga.watchTranslateWords(),
    textoSaga.watchDoneTextWordsRequest(),

    sessionSaga.watchLoginRequest(),
    sessionSaga.watchSignInGoogleRequest(),
    sessionSaga.watchSignOutRequest(),
    sessionSaga.watchUpdateRequest(),
    sessionSaga.watchSignInRequest()
  ]);
}
