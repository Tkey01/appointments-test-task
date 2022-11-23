import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "shared/types";
import { EventDataDTO, EventDTO } from "./dto";
import {
  EventsData,
  EventsListModel,
  SortedGroupedEvents,
} from "./models/EventsListModel";

export type HistoryState = {
  eventsList: {
    status: Status;
    errorText?: string;
    list: SortedGroupedEvents;
    groupedEvents: EventsData;
  };
  eventsData: {
    [key: string]: { status: Status; data?: EventDataDTO; errorText?: string };
  };
};

const initialState: HistoryState = {
  eventsList: {
    status: Status.initial,
    list: [],
    groupedEvents: {},
    errorText: "",
  },
  eventsData: {},
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    getEventsListRequest: (state) => {
      state.eventsList.status = Status.loading;
      state.eventsList.list = [];
    },
    getEventsListFailed: (state, action: PayloadAction<string>) => {
      state.eventsList.status = Status.failed;
      state.eventsList.errorText = action.payload;
    },
    getEventsListSucceed: (state, action: PayloadAction<EventDTO[]>) => {
      state.eventsList.status = Status.succeed;
      const { list, groupedEvents } = EventsListModel.fromDTO(action.payload);

      state.eventsList.list = list;
      state.eventsList.groupedEvents = groupedEvents;
    },

    getEventsDataRequest: (state, action: PayloadAction<{ ids: string[] }>) => {
      const { ids } = action.payload;
      ids.forEach((id) => {
        const correctId = id.split("/")[1];
        state.eventsData[correctId] = {
          status: Status.loading,
        };
      });
    },
    getEventsDataFailed: (
      state,
      action: PayloadAction<{ ids: string[]; errorText: string }>
    ) => {
      const { ids, errorText } = action.payload;
      ids.forEach((id) => {
        const correctId = id.split("/")[1];
        state.eventsData[correctId] = {
          status: Status.failed,
          errorText,
        };
      });
    },
    getEventsDataSucceed: (
      state,
      action: PayloadAction<{ ids: string[]; list: EventDataDTO[] }>
    ) => {
      const { ids, list } = action.payload;
      ids.forEach((id) => {
        const index = list.findIndex((eventData) => eventData.id === id);
        const correctId = id.split("/")[1];

        if (index !== -1) {
          state.eventsData[correctId] = {
            status: Status.succeed,
            data: list[index],
          };
        }
      });
    },
  },
});

export const {
  getEventsListRequest,
  getEventsListFailed,
  getEventsListSucceed,
  getEventsDataRequest,
  getEventsDataFailed,
  getEventsDataSucceed,
} = historySlice.actions;
