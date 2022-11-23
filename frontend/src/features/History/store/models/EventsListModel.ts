import { combineGroupBy, getMilliseconds } from "shared/utils";
import { EventDTO } from "../dto";

export type EventsData = {
  [appointmentId: string]: {
    [day: string]: {
      [eventType: string]: EventDTO[];
    };
  };
};

export type SortedGroupedEvents = EventDTO[];

type RecursiveTuple<T> = [number, T] | [number, RecursiveTuple<T>[]];

type CallbacksType = {
  sort: (
    a: EventDTO | RecursiveTuple<EventDTO>,
    b: EventDTO | RecursiveTuple<EventDTO>
  ) => number;
  timestamp: ({
    sortedArray,
    eventsDto,
    id,
  }: {
    sortedArray: EventDTO[] | RecursiveTuple<EventDTO>[];
    eventsDto: EventDTO[];
    id?: string;
  }) => number;
}[];

export class EventsListModel {
  private static getEventsGroupedBy(eventsDto: EventDTO[]): EventsData {
    return combineGroupBy<EventDTO>(eventsDto, [
      (event) => event.appointmentId ?? event.id,
      (appointmentEvent) => appointmentEvent.date.slice(0, 10),
      (event) => event.name,
    ]) as EventsData;
  }

  private static getEventsSortedArray(
    entity: RecursiveTuple<EventDTO> | EventsData,
    callbacks: CallbacksType,
    count: number,
    eventsDto: EventDTO[]
  ): RecursiveTuple<EventDTO>[] {
    const res = Object.entries(entity)
      .map<[number, RecursiveTuple<EventDTO>[]]>(([key, value]) => {
        const sortedArray = Array.isArray(value)
          ? value.sort(callbacks[count + 1].sort)
          : EventsListModel.getEventsSortedArray(
              value,
              callbacks,
              count + 1,
              eventsDto
            );
        const timestamp = Array.isArray(value)
          ? callbacks[count + 1].timestamp({ sortedArray, eventsDto })
          : callbacks[count].timestamp({ sortedArray, eventsDto, id: key });
        return [timestamp, sortedArray];
      })
      .sort(callbacks[count].sort);
    return res as RecursiveTuple<EventDTO>[];
  }

  private static getFlatSortedEvents(
    events: EventsData,
    eventsDto: EventDTO[]
  ): EventDTO[] {
    return EventsListModel.getEventsSortedArray(
      events,
      [
        {
          sort: (a: RecursiveTuple<EventDTO>, b: RecursiveTuple<EventDTO>) =>
            b[0] - a[0],
          timestamp: ({ eventsDto, id }) => {
            return getMilliseconds(
              eventsDto.find((item) => item.id === id)!.date
            );
          },
        },
        {
          sort: (a: RecursiveTuple<EventDTO>, b: RecursiveTuple<EventDTO>) =>
            b[0] - a[0],
          timestamp: ({
            sortedArray,
          }: {
            sortedArray: RecursiveTuple<EventDTO>[];
          }) => sortedArray[sortedArray.length - 1][0],
        },
        {
          sort: (a: RecursiveTuple<EventDTO>, b: RecursiveTuple<EventDTO>) =>
            a[0] - b[0],
          timestamp: ({
            sortedArray,
          }: {
            sortedArray: RecursiveTuple<EventDTO>[];
          }) => sortedArray[sortedArray.length - 1][0],
        },
        {
          sort: (a: EventDTO, b: EventDTO) =>
            getMilliseconds(b.date) - getMilliseconds(a.date),
          timestamp: ({ sortedArray }: { sortedArray: EventDTO[] }) =>
            getMilliseconds(sortedArray[sortedArray.length - 1].date),
        },
      ] as CallbacksType,
      0,
      eventsDto
    )
      .flat(7)
      .filter((item) => !Number.isInteger(item)) as EventDTO[];
  }

  private static raiseAppointmentEvents(sortedEvents: EventDTO[]): EventDTO[] {
    const res = [...sortedEvents];

    for (let i = 0; i < res.length; i++) {
      const elem = res[i];
      if (elem.name === "Appointment") {
        let j = i - 1;
        while (j >= 0 && res[j].appointmentId === elem.id) {
          j--;
        }
        res.splice(j + 1, 0, elem);
        res.splice(i + 1, 1);
      }
    }

    return res;
  }

  public static fromDTO(dto: EventDTO[]): {
    list: SortedGroupedEvents;
    groupedEvents: EventsData;
  } {
    const groupedEvents = EventsListModel.getEventsGroupedBy(dto);
    const sortedEvents = EventsListModel.getFlatSortedEvents(
      groupedEvents,
      dto
    );

    const list = EventsListModel.raiseAppointmentEvents(sortedEvents);

    return { list, groupedEvents };
  }
}
