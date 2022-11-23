import { EventDTO } from "features/History/store/dto";
import { HistoryState } from "features/History/store/reducer";
import React, { useCallback } from "react";
import { Status } from "shared/types";
import { Row } from "../Row";

import "./table.css";

export const Table = ({
  eventsData,
  eventsList,
  lastRef,
}: HistoryState & { lastRef: React.RefObject<HTMLTableRowElement> }) => {
  const isMainEvent = useCallback(
    (event: EventDTO, prevEvent: EventDTO): boolean => {
      if (prevEvent === undefined) {
        return true;
      }

      const day = event.date.slice(0, 10);
      const prevDay = prevEvent.date.slice(0, 10);

      const name = event.name;
      const prevName = prevEvent.name;

      const id = event.appointmentId ?? event.id;
      const prevId = prevEvent.appointmentId ?? prevEvent.id;

      if (day === prevDay && name === prevName && id === prevId) {
        return false;
      }
      return true;
    },
    []
  );

  if (eventsList.status === Status.loading) {
    return <div>Loading...</div>;
  }

  if (eventsList.status === Status.failed) {
    return <div>Error occurred while loading list</div>;
  }

  return (
    <div className="container">
      <Row type="header" headers={["Event type", "Details", "Code", "Date"]} />
      {eventsList.list.map(({ id, name, date }, index, arr) => {
        return (
          <Row
            key={id}
            type="basic"
            item={{
              name,
              details: eventsData[id]?.data?.details,
              date,
              values: eventsData[id]?.data?.values,
              code: eventsData[id]?.data?.code,
            }}
            status={eventsData[id]?.status}
            errorText={eventsData[id]?.errorText}
            lastRef={lastRef}
            isRef={index === arr.length - 1}
            isMainEvent={isMainEvent(arr[index], arr[index - 1])}
          />
        );
      })}
    </div>
  );
};
