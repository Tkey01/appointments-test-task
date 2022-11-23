import { call, delay, put, takeEvery } from "redux-saga/effects";
import {
  getEventsListRequest,
  getEventsListFailed,
  getEventsListSucceed,
  getEventsDataFailed,
  getEventsDataRequest,
  getEventsDataSucceed,
} from "./reducer";
import { ApiClient, ApiResponse } from "main/network/apiClient";
import { EventDataDTO, EventDTO } from "./dto";
import { Status } from "shared/types";
import { PayloadAction } from "@reduxjs/toolkit";

function* getEventsList() {
  const res: ApiResponse<EventDTO[]> = yield call(ApiClient.getEventsList);
  if (res.status === Status.succeed) {
    yield put(getEventsListSucceed(res.data));
  } else {
    yield put(getEventsListFailed(res.errorText));
  }
}

function* getEventsData(action: PayloadAction<{ ids: string[] }>) {
  const { ids } = action.payload;
  yield delay(1000);
  const res: ApiResponse<EventDataDTO[]> = yield call(
    ApiClient.getEventsData,
    ids
  );
  if (res.status === Status.succeed) {
    yield put(getEventsDataSucceed({ ids, list: res.data }));
  } else {
    yield put(getEventsDataFailed({ ids, errorText: res.errorText }));
  }
}

function* historySaga() {
  yield takeEvery(getEventsListRequest.type, getEventsList);
  yield takeEvery(getEventsDataRequest.type, getEventsData);
}

export default historySaga;
