import axios from 'axios';
import {servicePath, tokenPrefix} from '../../constants/defaultValues';

import {
    UPDATE_MENU_APP_COLORS_REQUEST,
    UPDATE_MENU_APP_SETTINGS_SUCCESS,
    UPDATE_MENU_APP_COLORS_FAIL,
    UPDATE_MENU_APP_LOGO_REQUEST,
    UPDATE_MENU_APP_LOGO_FAIL,
} from '../actions';
import {NotificationManager} from "../../components/common/react-notifications";

export const updateMenuAppColor = (payload) => (dispatch, getState) => {

    dispatch({
        type: UPDATE_MENU_APP_COLORS_REQUEST
    });

    axios
        .post(servicePath + "/user/update-menu-app-colors", payload, {
            headers: {
                'X-API-TOKEN': tokenPrefix + getState().authUser.token
            }
        })
        .then(response => response.data)
        .then(data => {
            if (data['message'] === "") {
                localStorage.setItem('menu_app_config', JSON.stringify(data['data']));
                NotificationManager.success(
                    "Template Successfully Updated",
                    "Success",
                    3000,
                    null,
                    null,
                    ''
                );
                dispatch({
                    type: UPDATE_MENU_APP_SETTINGS_SUCCESS,
                    payload: data['data']
                });
            } else {
                dispatch({
                    type: UPDATE_MENU_APP_COLORS_FAIL,
                    payload: data['message']
                });
            }

        })
        .catch(error => {
            dispatch({
                type: UPDATE_MENU_APP_COLORS_FAIL,
                payload: error
            });
        });
};

export const updateMenuAppLogo = (payload) => (dispatch, getState) => {

    dispatch({
        type: UPDATE_MENU_APP_LOGO_REQUEST
    });

    axios
        .post(servicePath + "/user/update-menu-app-logo", payload, {
            headers: {
                'X-API-TOKEN': tokenPrefix + getState().authUser.token
            }
        })
        .then(response => response.data)
        .then(data => {
            if (data['message'] === "") {
                localStorage.setItem('menu_app_config', JSON.stringify(data['data']));
                NotificationManager.success(
                    "Logo Successfully Updated",
                    "Success",
                    3000,
                    null,
                    null,
                    ''
                );
                dispatch({
                    type: UPDATE_MENU_APP_SETTINGS_SUCCESS,
                    payload: data['data']
                });
            } else {
                dispatch({
                    type: UPDATE_MENU_APP_LOGO_FAIL,
                    payload: data['message']
                });
            }

        })
        .catch(error => {
            dispatch({
                type: UPDATE_MENU_APP_LOGO_FAIL,
                payload: error
            });
        });
};