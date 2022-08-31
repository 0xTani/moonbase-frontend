import { EventInput } from '@fullcalendar/react';
import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
import { useUser } from 'src/Hooks/useUser';
import { isIdInArray } from 'src/Types/helpers';

export interface IAttendance {
  id: string;
  attendanceId: number;
  userId: number;
  privateAttendance: boolean;
  poapMinted: boolean;
}

export type IAttendanceNew = Omit<IAttendance, 'id'>;

export const EVENT_NEW_BLANK: IAttendanceNew = {
  attendanceId: 0,
  userId: 0,
  privateAttendance: false,
  poapMinted: false,
};

export const EVENT_BLANK: IAttendance = {
  id: '',
  attendanceId: 0,
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
  getAttendanceByUserIdAttendanceId: (userId: number, attendanceId: number) => IAttendance | null;
  getAttendancesByUserId: (userId: number) => Array<IAttendance>;
  getAttendancesByAttendanceId: (attendanceId: number) => Array<IAttendance>;
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
  getAttendanceByUserIdAttendanceId: (userId: number, attendanceId: number) => null,
  getAttendancesByUserId: (userId: number) => [],
  getAttendancesByAttendanceId: (attendanceId: number) => [],
});

export const AttendanceProvider: FC<{ children: ReactNode }> = props => {
  const [attendances, setAttendances] = React.useState<IAttendance[]>([]);
  const User = useUser();
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

  function getAttendanceByUserIdAttendanceId(userId: number, attendanceId: number) {
    const result = attendances.filter((attendance: IAttendance) => {
      return attendance.attendanceId === attendanceId && attendance.userId === User.user.id;
    });
    return result[0] ? result[0] : null;
  }

  function getAttendancesByAttendanceId(attendanceId: number) {
    return attendances.filter((attendance: IAttendance) => {
      return attendance.attendanceId === attendanceId;
    });
  }

  function getAttendancesByUserId(attendanceId: number) {
    return attendances.filter((attendance: IAttendance) => {
      return attendance.attendanceId === attendanceId;
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
        getAttendanceByUserIdAttendanceId,
        getAttendancesByUserId,
        getAttendancesByAttendanceId,
      }}
    >
      {props.children}
    </AttendanceContext.Provider>
  );
};
