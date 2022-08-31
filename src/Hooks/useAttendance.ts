import { AttendanceContext } from 'src/context/AttendanceContext';
import { useContext } from 'react';

export const useAttendance = () => {
  return useContext(AttendanceContext);
};
