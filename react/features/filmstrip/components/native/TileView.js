// @flow

import React, { Component } from 'react';
import {
    ScrollView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import type { Dispatch } from 'redux';

import {
    getNearestReceiverVideoQualityLevel,
    setMaxReceiverVideoQuality
} from '../../../base/conference';
import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui/constants';

import Thumbnail from './Thumbnail';
import styles from './styles';

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {

    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol,

    /**
     * Application's viewport height.
     */
    _height: number,

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Application's viewport height.
     */
    _width: number,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: Function
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 10;

/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
const TILE_ASPECT_RATIO = 1;

/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props> {
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _height, _width, onClick } = this.props;
        const rowElements = this._renderThumbnails()
        /*         const rowElements = this._groupIntoRows(this._renderThumbnails(), this._getColumnCount());
         */
        return (
            <TouchableWithoutFeedback onPress={onClick}>
                <View
                    style={{
                        ...styles.tileViewRows,
                        minHeight: _height,
                        minWidth: _width
                    }}>
                    {rowElements}
                </View>
            </TouchableWithoutFeedback>

        );
    }

    /**
     * Returns how many columns should be displayed for tile view.
     *
     * @returns {number}
     * @private
     */
    _getColumnCount() {
        const participantCount = this.props._participants.length;

        // For narrow view, tiles should stack on top of each other for a lonely
        // call and a 1:1 call. Otherwise tiles should be grouped into rows of
        // two.
        if (this.props._aspectRatio === ASPECT_RATIO_NARROW) {
            return participantCount >= 3 ? 2 : 1;
        }

        if (participantCount === 4) {
            // In wide view, a four person call should display as a 2x2 grid.
            return 2;
        }

        return Math.min(3, participantCount);
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {
        let participants = [];
        let localParticipant;

        for (const participant of this.props._participants) {
            if (participant.local) {
                localParticipant = participant;
            } else {
                participants.push(participant);
            }
        }


        let participantCount = participants.length;
        //  eğer 10 kişiden az katılımcı varsa nativeden gelen listeye göre hazırlansın layout
        console.log()
        if (this.props._bipState.invitedParticipants.length <= 9) {
            participantCount = this.props._bipState.invitedParticipants.length
            let _newParticipantsLessTen = []
            participants.map(participant => {
                _newParticipantsLessTen = this.props._bipState.invitedParticipants.filter(function (el) {
                    return el.id != participant.id
                });
            })
            participants = [...participants, ..._newParticipantsLessTen]
            console.log("zvs participants 285", participants)
        }

        // zvs:
        // local katılımcıyı katılımcı sayısı 2 ise listenin başına ekledik.
        // 3 kullanıcı ve fazlaysa listenin 2. sırasında yer alacak. (ekranın sağ üstünde)
        //console.log("zvs participants 0", participants.length)
        if (participantCount < 3) {
            localParticipant && participants.unshift(localParticipant);
            console.log("zvs participants 1", participants)
        } else {
            participants.splice(1, 0, localParticipant);
            console.log("zvs participants 2", participants)
        }
        // katılımcıların listesi
        // local olan katılımcı -> local: true

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     */
    _getTileDimensions() {
        const { _height, _participants, _width } = this.props;
        const columns = this._getColumnCount();
        const participantCount = _participants.length;
        const heightToUse = _height - (MARGIN * 2);
        const widthToUse = _width - (MARGIN * 2);
        let tileWidth;

        // If there is going to be at least two rows, ensure that at least two
        // rows display fully on screen.
        if (participantCount / columns > 1) {
            tileWidth = Math.min(widthToUse / columns, heightToUse / 2);
        } else {
            tileWidth = Math.min(widthToUse / columns, heightToUse);
        }

        return {
            height: tileWidth / TILE_ASPECT_RATIO,
            width: tileWidth
        };
    }

    /**
     * Splits a list of thumbnails into React Elements with a maximum of
     * {@link rowLength} thumbnails in each.
     *
     * @param {Array} thumbnails - The list of thumbnails that should be split
     * into separate row groupings.
     * @param {number} rowLength - How many thumbnails should be in each row.
     * @private
     * @returns {ReactElement[]}
     */
    _groupIntoRows(thumbnails, rowLength) {
        const rowElements = [];

        for (let i = 0; i < thumbnails.length; i++) {
            if (i % rowLength === 0) {
                const thumbnailsInRow = thumbnails.slice(i, i + rowLength);

                rowElements.push(
                    <View
                        key={rowElements.length}
                        style={styles.tileViewRow}>
                        {thumbnailsInRow}
                    </View>
                );
            }
        }

        return rowElements;
    }

    /**
     * Creates React Elements to display each participant in a thumbnail. Each
     * tile will be.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderThumbnails() {
        const styleOverrides = {
            aspectRatio: TILE_ASPECT_RATIO,
            flex: 0,
            height: this._getTileDimensions().height,
            width: null
        };

        return this._getSortedParticipants()
            .map((participant, index) => {
                const sizes = this._getTileDimensionSpecial(index)
                const styleOverrides = {
                    //aspectRatio: TILE_ASPECT_RATIO,
                    flex: 0,
                    //height: this._getTileDimensions().height,
                    height: sizes.height,
                    width: sizes.width
                };
                return (<Thumbnail
                    disableTint={true}
                    key={participant.id}
                    participant={participant}
                    renderDisplayName={true}
                    styleOverrides={styleOverrides}
                    tileView={true} />)
            });
    }

    // zvs: tileları ekrana dizme
    _getTileDimensionSpecial(index) {
        const { _participants, _bipState, _height, _width  } = this.props;
        let participantCount = _participants.length;

        //  eğer 10 kişiden az katılımcı varsa nativeden gelen listeye göre hazırlansın layout
        if (_bipState.invitedParticipants.length <= 9 && _participants.length > 1) {
            participantCount = _bipState.invitedParticipants.length
            console.log("zvs participantCount ", participantCount)
        }

        let tileHeight;
        let tileWidth;
        console.log("zvs dimensions ", _height, _width)
        if (participantCount < 3) {
            tileHeight = _height / participantCount
            tileWidth = _width
        }
        else if (participantCount == 3) {
            switch (index) {
                case 0:
                    tileHeight = _height / 2
                    tileWidth = _width
                    break;
                case 1:
                    tileHeight = _height / 2
                    tileWidth = _width / 2
                    break;
                case 2:
                    tileHeight = _height / 2
                    tileWidth = _width / 2
                    break;

                default:
                    break;
            }
        }
        else if (participantCount > 3) {
            tileHeight = _height / Math.round(participantCount / 2)
            tileWidth = _width / 2
            console.log("zvs tile dimensions ", tileHeight, tileWidth)
        }

        return {
            height: tileHeight,
            width: tileWidth
        };
    }
    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height } = this._getTileDimensions();
        const qualityLevel = getNearestReceiverVideoQualityLevel(height);

        this.props.dispatch(setMaxReceiverVideoQuality(qualityLevel));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state['features/base/participants'],
        _width: responsiveUi.clientWidth,
        _bipState: state['features/base/bipState'],
    };
}

export default connect(_mapStateToProps)(TileView);
