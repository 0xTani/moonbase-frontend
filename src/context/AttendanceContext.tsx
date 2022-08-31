import { EventInput } from '@fullcalendar/react';
import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
import { useUser } from 'src/Hooks/useUser';
import { isIdInArray } from 'src/Types/helpers';

export interface IAttendance {
  id: string;
  eventId: number;
  userId: number;
  privateAttendance: boolean;
  poapMinted: boolean;
}

export type IAttendanceNew = Omit<IAttendance, 'id'>;

export const EVENT_NEW_BLANK: IAttendanceNew = {
  eventId: 0,
  userId: 0,
  privateAttendance: false,
  poapMinted: false,
};

export const EVENT_BLANK: IAttendance = {
  id: '',
  eventId: 0,
  userId: 0,
  privateAttendance: false,
  poapMinted: false,
};

interface IAttendanceResponse {
  data: IAttendance[];
  limit: number;
  total: number;
  skip: number;
}

export interface IAttendanceContext {
  attendances: Array<IAttendance>;
  setAttendances?: React.Dispatch<React.SetStateAction<IAttendance[]>>;
  addAttendance: (attendance: IAttendanceNew) => Promise<void>;
  removeAttendance: (attendanceId: number) => void;
  attendanceChanged: (attendance: IAttendance) => void;
  initializeAttendances: () => void;
  attendancesFiltered: (idArray: number[]) => Array<IAttendance>;
  getAttendanceById: (id: string) => IAttendance | null;
  getAttendanceByUserIdEventId: (userId: number, eventId: number) => IAttendance | null;
  getAttendancesByUserId: (userId: number) => Array<IAttendance>;
  getAttendancesByEventId: (eventId: number) => Array<IAttendance>;
}

export const AttendanceContext = createContext<IAttendanceContext>({
  attendances: [],
  setAttendances: () => {},
  addAttendance: (attendance: IAttendanceNew) => new Promise(() => {}),
  attendanceChanged: (attendance: IAttendance) => {},
  removeAttendance: (attendanceId: number) => {},
  initializeAttendances: () => {},
  attendancesFiltered: (idArray: number[]) => [],
  getAttendanceById: (id: string) => null,
  getAttendanceByUserIdEventId: (userId: number, attendanceId: number) => null,
  getAttendancesByUserId: (userId: number) => [],
  getAttendancesByEventId: (eventId: number) => [],
});

export const AttendanceProvider: FC<{ children: ReactNode }> = props => {
  const [attendances, setAttendances] = React.useState<IAttendance[]>([]);
  const AttendanceService = feathersClient.service('attendance');

  const addAttendance = (attendance: IAttendanceNew) =>
    new Promise<void>((resolve, reject) => {
      AttendanceService.create(attendance).then(resolve).catch(reject);
    });

  function removeAttendance(attendanceId: number) {
    AttendanceService.remove(attendanceId);
  }

  function fetchAttendances() {
    AttendanceService.find().then((attendances: IAttendanceResponse) => {
      setAttendances(attendances.data);
    });
  }

  function attendanceChanged(attendance: IAttendance) {
    AttendanceService.patch(attendance.id, attendance);
  }

  function getAttendanceById(id: string): IAttendance | null {
    let attendance = null;
    attendances.forEach((e: IAttendance) => {
      if (parseInt(e.id) === parseInt(id)) attendance = e;
    });
    return attendance;
  }

  function getAttendanceByUserIdEventId(userId: number, eventId: number) {
    console.log(attendances);
    console.log('userID', userId);
    console.log('eventID', eventId);
    const result = attendances.filter((attendance: IAttendance) => {
      return attendance.eventId === eventId && attendance.userId === userId;
    });
    return result[0] ? result[0] : null;
  }

  function getAttendancesByEventId(eventId: number) {
    return attendances.filter((attendance: IAttendance) => {
      return attendance.eventId === eventId;
    });
  }

  function getAttendancesByUserId(userId: number) {
    return attendances.filter((attendance: IAttendance) => {
      return attendance.userId === userId;
    });
  }

  function attendancesFiltered(idArray: number[]) {
    let attendancesList: IAttendance[] = [];
    // attendances.map((ev: IAttendance) => {
    //   if (isIdInArray(ev.organizationId, idArray)) attendancesList.push(ev);
    // });

    return attendancesList;
  }

  function initializeAttendances() {
    console.log('initializeAttendances');
    fetchAttendances();
    AttendanceService.on('created', () => {
      fetchAttendances();
    });

    AttendanceService.on('patched', () => {
      fetchAttendances();
    });

    AttendanceService.on('removed', () => {
      fetchAttendances();
    });
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendances: attendances,
        setAttendances: setAttendances,
        addAttendance,
        getAttendanceById,
        attendanceChanged,
        removeAttendance,
        initializeAttendances,
        attendancesFiltered,
        getAttendanceByUserIdEventId,
        getAttendancesByUserId,
        getAttendancesByEventId,
      }}
    >
      {props.children}
    </AttendanceContext.Provider>
  );
};
