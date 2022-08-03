import React, { useState, createContext } from 'react';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [scheduleInfo, setScheduleInfo] = useState({
        type: '',
        sid: '',
    });

    const [linkedScheduleInfo, setLinkedScheduleInfo] = useState({
        tid: '',
        parentSid: [],
        parentType: [],
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

    const pushParentSid = (sid) => {
        const newParentSidArr = linkedScheduleInfo.parentSid;
        newParentSidArr.push(sid);
        setLinkedScheduleInfo({
            ...linkedScheduleInfo,
            parentSid: newParentSidArr,
        });
    };

    const popParentSid = () => {
        const newParentSidArr = linkedScheduleInfo.parentSid;
        newParentSidArr.pop();
        setLinkedScheduleInfo({
            ...linkedScheduleInfo,
            parentSid: newParentSidArr,
        });
    };

    const pushParentType = (type) => {
        const newParentTypeArr = linkedScheduleInfo.parentType;
        newParentTypeArr.push(type);
        setLinkedScheduleInfo({
            ...linkedScheduleInfo,
            parentType: newParentTypeArr,
        });
    };

    const popParentType = () => {
        const newParentTypeArr = linkedScheduleInfo.parentType;
        newParentTypeArr.pop();
        setLinkedScheduleInfo({
            ...linkedScheduleInfo,
            parentType: newParentTypeArr,
        });
    };

    const scheduleContextSetters = {
        setType,
        setSid,
        setScheduleInfo,
    };

    const linkedScheduleContextSetters = {
        setTid,
        pushParentSid,
        popParentSid,
        pushParentType,
        popParentType,
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
