// @flow

import { BoxModel, ColorPalette } from '../../styles';

export default {
    shortInfoContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 99
    },
    profileImgContainer: {
        height: 100,
        flexDirection: 'row-reverse',
    },
    profileNameContainer: {
        height: 40,
        flexDirection:"row"
    },
    callStatusContainer:{
        height:30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    profileImgCover: {
        overflow:'hidden',
        width: 70,
        height: 70,
        borderRadius: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    nameStyle:{
        fontSize: 19,
        color:ColorPalette.white
    },
    infoIcon:{
        color:'#fff', 
        fontSize:30, 
        marginLeft:10
    }
};
