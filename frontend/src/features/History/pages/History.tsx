import { useAppDispatch, useAppSelector } from "main/store/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Table } from "../components/Table";
import { EventDTO } from "../store/dto";

import {
  clearEvents,
  getEventsDataRequest,
  getEventsListRequest,
} from "../store/reducer";

export const History = () => {
  const dispatch = useAppDispatch();
  const { eventsList, eventsData } = useAppSelector((state) => state.history);

  const [events, setEvents] = useState<EventDTO[]>([]);
  const [page, setPage] = useState(0);

  const lastRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    dispatch(getEventsListRequest());

    return () => {
      dispatch(clearEvents());
    };
  }, []);

  useEffect(() => {
    if (eventsList.list.length !== 0) {
      setEvents(eventsList.list.slice(0, 15));
    }
  }, [eventsList.list]);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    const observedRef = lastRef.current;

    let observer = new IntersectionObserver((event) => {
      if (event[0].isIntersecting && page * 15 < eventsList.list.length) {
        setEvents(eventsList.list.slice(0, events.length + 15));
        setPage((page) => {
          return page + 1;
        });
      }
    }, options);

    if (lastRef && observedRef) {
      observer.observe(observedRef);
    }

    return () => {
      if (lastRef && observedRef) {
        observer.unobserve(observedRef);
      }
    };
  }, [events, page, eventsList.list, dispatch]);

  useEffect(() => {
    if (events.length !== 0) {
      const ids = events
        .slice(page * 15)
        .map((event) => `${event.resource}/${event.id}`);
      dispatch(getEventsDataRequest({ ids }));
    }
  }, [page, events, dispatch]);

  return (
    <Table
      eventsData={eventsData}
      eventsList={{
        status: eventsList.status,
        list: events,
        errorText: eventsList.errorText,
        groupedEvents: eventsList.groupedEvents,
      }}
      lastRef={lastRef}
    />
  );
};
