// @flow

import type { Dispatch } from 'redux';

import { translate } from '../../base/i18n';
import { IconSwitchCamera } from '../../base/icons';
import { connect } from '../../base/redux';
import {
    AbstractButton,
    type AbstractButtonProps
} from '../../base/toolbox';
import { setCameraFacingMode, CAMERA_FACING_MODE, toggleCameraFacingMode } from '../../base/media';


type Props = AbstractButtonProps & {

    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    _tileViewEnabled: boolean,

    /**
     * Used to dispatch actions from the buttons.
     */
    dispatch: Dispatch<any>
};
/**
 * Component that renders a toolbar button for toggling the tile layout view.
 *
 * @extends AbstractButton
 */
class SwitchCameraButton<P: Props> extends AbstractButton<P, *> {
    icon = IconSwitchCamera;

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, _facingMode } = this.props;
        let newFacingMode
        if (_facingMode == CAMERA_FACING_MODE.USER)
            newFacingMode = CAMERA_FACING_MODE.ENVIRONMENT
        else
            newFacingMode = CAMERA_FACING_MODE.USER
        //dispatch(setSwitchCameraStatus());
        dispatch(setCameraFacingMode(newFacingMode));
        console.log("zvs: tik")
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        const { dispatch } = this.props;
        dispatch(toggleCameraFacingMode())
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code TileViewButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _cameraType: state['features/toolbox'].cameraType,
        _facingMode: state['features/base/media'].video.facingMode,
    };
}

export default translate(connect(_mapStateToProps)(SwitchCameraButton));
