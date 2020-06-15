// @flow

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';

import { translate } from '../../i18n';
import { connect } from '../../redux';

import styles from './styles';
import config from "../config";
import { Icon, IconInfo, bipLogoWhite } from '../../icons';
import { CALL_TYPE } from "../constants";
import { getParticipantCount } from '../../../base/participants';
/**
 * The type of the React {@link Component} props of {@link ParticipantView}.
 */
type Props = {
    /**
     * The function to translate human-readable text.
     */
    t: Function,


};


class FirstScreenShortInfo extends Component<Props> {

    componentDidMount() {
        console.log("zvs: _bipState 27", config)
    }
    _renderProfileImages = () => {
        const { _bipState } = this.props;
        const invitedParticipants = _bipState.invitedParticipants
        const componentArray = []
        // burada configde belirlenen uzunlukla davetli katılımcı listesinin uzunluğuda karşılaştırıp hangisi küçükse onu kullanıyoruz
        const length = invitedParticipants.length < config.firstScreenShortInfoImagesLength
            ? invitedParticipants.length
            : config.firstScreenShortInfoImagesLength

        for (let i = 0; i < length; i++) {
            const component = (
                <View key={i} style={[{ marginLeft: i + 1 == length ? 0 : -20 }, styles.profileImgCover]}>
                    <Image style={{ flex: 1 }} source={{ uri: invitedParticipants[i].avatarURL }} />
                </View>
            )
            componentArray.push(component)
        }
        return componentArray
    }
    _renderNamesAndInfoBtn = () => {
        const { _bipState } = this.props;
        const invitedParticipants = _bipState.invitedParticipants
        const componentArray = []
        // burada configde belirlenen uzunlukla davetli katılımcı listesinin uzunluğuda karşılaştırıp hangisi küçükse onu kullanıyoruz
        const length = invitedParticipants.length < config.firstScreenShortInfoNamesLength
            ? invitedParticipants.length
            : config.firstScreenShortInfoNamesLength

        for (let i = 0; i < length; i++) {
            const component = (
                <Text key={i} style={styles.nameStyle}>{invitedParticipants[i].name + (i + 1 != length ? "," : "")} </Text>
            )
            componentArray.push(component)
        }
        const plusName = (
            <Text key={"plusName"} style={styles.nameStyle}>+{invitedParticipants.length - length}</Text>
        )
        componentArray.push(plusName)

        const infoButton = (
            <TouchableOpacity key={"infoButton"} onPress={() => console.log("zvs: info buton tıklandı")}>
                <Icon
                    src={IconInfo}
                    style={styles.infoIcon}
                />
            </TouchableOpacity>
        )
        componentArray.push(infoButton)

        return componentArray

    }

    render() {
        const { _bipState, t, _isLonelyMeeting } = this.props
        const callType = _bipState.callType == CALL_TYPE.VIDEOCALL
            ? t('bip.videoCallInfo')
            : t('bip.voiceCallInfo')

        if (!_isLonelyMeeting) {
            return null;
        }

        return (
            <View style={styles.shortInfoContainer}>
                <View style={styles.profileImgContainer}>
                    {
                        this._renderProfileImages()
                    }
                </View>
                <View style={styles.profileNameContainer}>
                    {
                        this._renderNamesAndInfoBtn()
                    }
                </View>
                <View style={styles.callStatusContainer}>
                    <Icon
                        src={bipLogoWhite}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.nameStyle}> {callType} </Text>
                </View>
            </View>
        );
    }
}

/**
 * Maps (parts of) the redux state to the associated {@link ParticipantView}'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The React {@code Component} props passed to the
 * associated (instance of) {@code ParticipantView}.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {

    return {
        _bipState: state['features/base/bipState'],
        _isLonelyMeeting: getParticipantCount(state) === 1,
    };
}

export default translate(connect(_mapStateToProps)(FirstScreenShortInfo));
