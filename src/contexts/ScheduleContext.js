import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [scheduleInfo, setScheduleInfo] = useState({ type: '', sid: '' });

    const setType = (type) => {
        const newSchedule = { ...scheduleInfo, type };
        setScheduleInfo(newSchedule);
    };

    const setSid = (sid) => {
        const newSchedule = { ...scheduleInfo, sid };
        setScheduleInfo(newSchedule);
    };

    const scheduleContextSetters = {
        setType,
        setSid,
        setScheduleInfo,
    };

    return (
        <ScheduleContext.Provider
            value={{ ...scheduleInfo, ...scheduleContextSetters }}>
            {children}
        </ScheduleContext.Provider>
    );
};
