import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [scheduleInfo, setScheduleInfo] = useState({
        type: '',
        sid: '',
    });
    const [linkedScheduleInfo, setLinkedScheduleInfo] = useState({
        tid: '',
        onLinkedSchedule: false,
        parentSid: '',
    });

    const setType = (type) => {
        setScheduleInfo({ ...scheduleInfo, type });
    };

    const setSid = (sid) => {
        setScheduleInfo({ ...scheduleInfo, sid });
    };

    const setTid = (tid) => {
        setLinkedScheduleInfo({ ...linkedScheduleInfo, tid });
    };

    const setOnLinkedSchedule = (bool) => {
        setLinkedScheduleInfo({
            ...linkedScheduleInfo,
            onLinkedSchedule: bool,
        });
    };

    const setParentSid = (sid) => {
        setLinkedScheduleInfo({ ...linkedScheduleInfo, parentSid: sid });
    };

    const scheduleContextSetters = {
        setType,
        setSid,
        setScheduleInfo,
    };

    const linkedScheduleContextSetters = {
        setTid,
        setParentSid,
        setOnLinkedSchedule,
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
