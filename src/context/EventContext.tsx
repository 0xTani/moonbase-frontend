import { EventInput } from '@fullcalendar/react';
import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
import { isIdInArray } from 'src/Types/helpers';

// @todo helps know what is in an event, remove in prod
interface TEvent extends EventInput {}
const event1: TEvent = {};

export interface IEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  description: string;
  backgroundColor: string;
  url: string;
  uuid: string;
  organizationId: number;
}

export type IEventNew = Omit<IEvent, 'id'>;

export const EVENT_NEW_BLANK: IEventNew = {
  title: '',
  start: '',
  end: '',
  description: '',
  backgroundColor: '#3788d8',
  url: '',
  uuid: '',
  organizationId: -1,
};

export const EVENT_BLANK: IEvent = {
  id: '',
  title: '',
  start: '',
  end: '',
  description: '',
  uuid: '',
  backgroundColor: '#3788d8',
  url: '',
  organizationId: -1,
};

interface IEventResponse {
  data: IEvent[];
  limit: number;
  total: number;
  skip: number;
}

export interface IEventContext {
  events: Array<IEvent>;
  setEvents?: React.Dispatch<React.SetStateAction<IEvent[]>>;
  addEvent: (event: IEventNew) => Promise<void>;
  removeEvent: (eventId: number) => void;
  eventChanged: (event: IEvent) => void;
  initializeEvents: () => void;
  eventsFiltered: (idArray: number[]) => Array<IEvent>;
  getEventById: (id: string) => IEvent | null;
  getEventByUUID: (UUID: string) => IEvent | null;
}

export const EventContext = createContext<IEventContext>({
  events: [],
  setEvents: () => {},
  addEvent: (event: IEventNew) => new Promise(() => {}),
  eventChanged: (event: IEvent) => {},
  removeEvent: (eventId: number) => {},
  initializeEvents: () => {},
  eventsFiltered: (idArray: number[]) => [],
  getEventById: (id: string) => null,
  getEventByUUID: (UUID: string) => null,
});

export const EventProvider: FC<{ children: ReactNode }> = props => {
  const [events, setEvents] = React.useState<IEvent[]>([]);
  const EventService = feathersClient.service('event');

  const addEvent = (event: IEventNew) =>
    new Promise<void>((resolve, reject) => {
      EventService.create(event).then(resolve).catch(reject);
    });

  function removeEvent(eventId: number) {
    EventService.remove(eventId);
  }

  function fetchEvents() {
    EventService.find().then((events: IEventResponse) => {
      setEvents(events.data);
    });
  }

  function eventChanged(event: IEvent) {
    EventService.patch(event.id, event);
  }

  function getEventByUUID(UUID: string): IEvent | null {
    let event = null;
    events.forEach((e: IEvent) => {
      if (e.uuid === UUID) event = e;
    });
    return event;
  }

  function getEventById(id: string): IEvent | null {
    let event = null;
    events.forEach((e: IEvent) => {
      if (parseInt(e.id) === parseInt(id)) event = e;
    });
    return event;
  }

  function eventsFiltered(idArray: number[]) {
    let eventsList: IEvent[] = [];
    events.map((ev: IEvent) => {
      if (isIdInArray(ev.organizationId, idArray)) eventsList.push(ev);
    });

    return eventsList;
  }

  function initializeEvents() {
    console.log('initializeEvents');
    fetchEvents();
    EventService.on('created', () => {
      fetchEvents();
    });

    EventService.on('patched', () => {
      fetchEvents();
    });

    EventService.on('removed', () => {
      fetchEvents();
    });
  }

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        addEvent,
        getEventById,
        eventChanged,
        removeEvent,
        initializeEvents,
        eventsFiltered,
        getEventByUUID,
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
};
