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

    const [scheduleLinkingInfo, setScheduleLinkingInfo] = useState({
        tid: null,
        schedToLink: null,
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

    return (
        <ScheduleContext.Provider
            value={{
                ...scheduleInfo,
                ...linkedScheduleInfo,
                ...scheduleLinkingInfo,
                ...scheduleContextSetters,
                setLinkedScheduleInfo,
                setScheduleLinkingInfo,
            }}>
            {children}
        </ScheduleContext.Provider>
    );
};
