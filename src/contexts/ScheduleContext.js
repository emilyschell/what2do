import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [scheduleInfo, setScheduleInfo] = useState({
        type: '',
        sid: '',
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
        setScheduleInfo({ ...scheduleInfo, tid });
    };

    const setOnLinkedSchedule = (bool) => {
        setScheduleInfo({
            ...scheduleInfo,
            onLinkedSchedule: bool,
        });
    };

    const setParentSid = (sid) => {
        setScheduleInfo({ ...scheduleInfo, parentSid: sid });
    };

    const scheduleContextSetters = {
        setType,
        setSid,
        setTid,
        setParentSid,
        setOnLinkedSchedule,
        setScheduleInfo,
    };

    return (
        <ScheduleContext.Provider
            value={{
                scheduleInfo,
                ...scheduleInfo,
                ...scheduleContextSetters,
            }}>
            {children}
        </ScheduleContext.Provider>
    );
};
