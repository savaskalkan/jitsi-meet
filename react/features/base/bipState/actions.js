import { set } from '../redux';

import {
    SET_INVITED_PARTICIPANTS,
    SET_CALL_TYPE,
} from './actionTypes';
import { CALL_TYPE } from "./constants";

import {
    aplusb
} from './functions';



// zvs: native'den gelen katılımcıların eklenmesi
export function setInvitedParticipants(invetedParticipants) {
    return {
        type: SET_INVITED_PARTICIPANTS,
        payload:invetedParticipants
    };
}


// zvs: konuşmanın görüntülü mü yoksa sesli bi görüşme mi olduğunun atamasının yapılması
export function setCallType(type) {
    return {
        type: SET_CALL_TYPE,
        payload:type ? CALL_TYPE.VOICECALL : CALL_TYPE.VIDEOCALL
    };
}