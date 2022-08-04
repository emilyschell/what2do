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
        order: null,
    });

    const setType = (type) => {
        setScheduleInfo({ ...scheduleInfo, type });
    };

    const setSid = (sid) => {
        setScheduleInfo({ ...scheduleInfo, sid });
    };

    return (
        <ScheduleContext.Provider
            value={{
                ...scheduleInfo,
                setType,
                setSid,
                setScheduleInfo,
                ...linkedScheduleInfo,
                setLinkedScheduleInfo,
                ...scheduleLinkingInfo,
                scheduleLinkingInfo,
                setScheduleLinkingInfo,
            }}>
            {children}
        </ScheduleContext.Provider>
    );
};
