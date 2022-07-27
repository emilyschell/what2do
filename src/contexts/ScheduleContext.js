import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const blankSchedule = {
        type: '',
        title: '',
        tasks: [],
    };

    const [scheduleInfo, setScheduleInfo] = useState(blankSchedule);

    const setType = (type) => {
        const newSchedule = { ...scheduleInfo, type };
        setScheduleInfo(newSchedule);
    };

    const setTitle = (title) => {
        const newSchedule = { ...scheduleInfo, title };
        setScheduleInfo(newSchedule);
    };

    const setTasks = (tasks) => {
        const newSchedule = { ...scheduleInfo, tasks };
        setScheduleInfo(newSchedule);
    };

    const scheduleContextSetters = {
        setType,
        setTitle,
        setTasks,
    };

    return (
        <ScheduleContext.Provider
            value={{ ...scheduleInfo, ...scheduleContextSetters }}>
            {children}
        </ScheduleContext.Provider>
    );
};
