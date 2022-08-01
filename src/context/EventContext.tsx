import { EventInput } from '@fullcalendar/react';
import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';

let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
// const INITIAL_EVENTS = [
//   {
//     id: '0',
//     title: 'All-day event',
//     start: todayStr,
//   },
//   {
//     id: '1',
//     title: 'Event from context',
//     start: todayStr + 'T12:00:00',
//   },
// ];

// @todo helps know what is in an event, remove in prod
interface TEvent extends EventInput {}
const event1: TEvent = {};

interface IEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor: string;
  url: string;
}

type IEventNew = Omit<IEvent, 'id'>;

interface IEventResponse {
  data: IEvent[];
  limit: number;
  total: number;
  skip: number;
}

export interface IEventContext {
  events: Array<IEvent>;
  setEvents?: React.Dispatch<React.SetStateAction<IEvent[]>>;
  addEvent?: (event: IEventNew) => void;
  removeEvent: (eventId: number) => void;
  initializeEvents: () => void;
}

export const EventContext = createContext<IEventContext>({
  events: [],
  setEvents: () => {},
  addEvent: (event: IEventNew) => {},
  removeEvent: (eventId: number) => {},
  initializeEvents: () => {},
});

export const EventProvider: FC<{ children: ReactNode }> = props => {
  const [events, setEvents] = React.useState<IEvent[]>([]);
  const EventService = feathersClient.service('event');

  function addEvent(event: IEventNew) {
    console.log('fuck yeah', event);
    EventService.create(event);
  }

  function removeEvent(eventId: number) {
    EventService.remove(eventId);
  }

  function fetchEvents() {
    console.log('fetchEvents');
    EventService.find().then((events: IEventResponse) => {
      console.log(events);
      setEvents(events.data);
    });
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
    <EventContext.Provider value={{ events, setEvents, addEvent, removeEvent, initializeEvents }}>
      {props.children}
    </EventContext.Provider>
  );
};
