import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [scheduleInfo, setScheduleInfo] = useState({
        type: '',
        sid: '',
    });

    const [linkedScheduleInfo, setLinkedScheduleInfo] = useState({
        parentSidStack: [],
        parentTypeStack: [],
    });

    const setType = (type) => {
        setScheduleInfo({ ...scheduleInfo, type });
    };

    const setSid = (sid) => {
        setScheduleInfo({ ...scheduleInfo, sid });
    };

    const scheduleContextSetters = {
        setType,
        setSid,
        setScheduleInfo,
    };

    const linkedScheduleContextSetters = {
        setLinkedScheduleInfo,
    };

    return (
        <ScheduleContext.Provider
            value={{
                ...scheduleInfo,
                ...scheduleContextSetters,
                ...linkedScheduleInfo,
                ...linkedScheduleContextSetters,
            }}>
            {children}
        </ScheduleContext.Provider>
    );
};
