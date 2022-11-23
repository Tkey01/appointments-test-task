import historySaga from "features/History/store/sagas";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([historySaga()]);
}
