import { EventInput } from '@fullcalendar/react';
import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
import { isIdInArray } from 'src/Types/helpers';
import { IUser } from 'src/Types/TUser';

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
  organizationId: number;
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
  eventsFiltered: (idArray: number[]) => Array<IEvent>;
}

export const EventContext = createContext<IEventContext>({
  events: [],
  setEvents: () => {},
  addEvent: (event: IEventNew) => {},
  removeEvent: (eventId: number) => {},
  initializeEvents: () => {},
  eventsFiltered: (idArray: number[]) => [],
});

export const EventProvider: FC<{ children: ReactNode }> = props => {
  const [events, setEvents] = React.useState<IEvent[]>([]);
  const EventService = feathersClient.service('event');

  function addEvent(event: IEventNew) {
    EventService.create(event);
  }

  function removeEvent(eventId: number) {
    EventService.remove(eventId);
  }

  function fetchEvents() {
    EventService.find().then((events: IEventResponse) => {
      setEvents(events.data);
    });
  }

  function eventsFiltered(idArray: number[]) {
    let eventsList: IEvent[] = [];
    events.map((ev: IEvent) => {
      console.log('eventid');
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
    <EventContext.Provider value={{ events, setEvents, addEvent, removeEvent, initializeEvents, eventsFiltered }}>
      {props.children}
    </EventContext.Provider>
  );
};
