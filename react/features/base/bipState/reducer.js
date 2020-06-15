// @flow

import { ReducerRegistry, set } from '../redux';

import {
    SET_INVITED_PARTICIPANTS,
    SET_CALL_TYPE
} from './actionTypes';
import { CALL_TYPE } from "./constants";

const INITIAL_STATE = {
    invitedParticipants: [],
    callType: CALL_TYPE.VIDEOCALL
}


ReducerRegistry.register('features/base/bipState', (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case SET_INVITED_PARTICIPANTS:
            return { ...state, invitedParticipants: action.payload };

        case SET_CALL_TYPE:
            return { ...state, callType: action.payload };

    }

    return state;
});
