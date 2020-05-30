import axios from "axios";
import {servicePath, tokenPrefix} from "../../constants/defaultValues";
import errorMessage from "../../constants/errorMessages";

import {
    LOAD_USER_SUCCESS,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    LOGIN_USER_ERROR,
    REGISTER_USER_ERROR,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    UPDATE_MENU_APP_SETTINGS_SUCCESS
} from '../actions';

export const loadUser = () => (dispatch, getState) => {

    dispatch({
        type: LOGIN_USER
    });

    axios.get(servicePath + "/user/check-auth", {
        headers: {
            'X-API-TOKEN': tokenPrefix + getState().authUser.token
        }
    }).then(response => {

        if (response.status === 200 && response.data['message'] === "") {
            const data = response.data['data'];
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload:  data['user']
            });
        } else {
            dispatch({
                type: LOGOUT_USER
            });
        }

    }).catch(error => {
        dispatch({
            type: LOGOUT_USER
        });
    });
};

export const loginUser = (user, history) => dispatch => {

    dispatch({
        type: LOGIN_USER
    });

    axios.post(servicePath + "/user/login", {
        email: user.email,
        password: user.password
    }).then(response => {

        if (response.status === 200 && response.data['message'] === "") {

            const data = response.data['data'];

            localStorage.setItem('_fs_utk', data['apiToken']);
            localStorage.setItem('user_info', JSON.stringify(data['userInfo']));
            localStorage.setItem('menu_app_config', JSON.stringify(data['menuAppConfig']));

            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {
                    token: data['apiToken'],
                    user: data['userInfo']
                }
            });

            dispatch({
                type: UPDATE_MENU_APP_SETTINGS_SUCCESS,
                payload: data['menuAppConfig']
            });

            history.push('/');
        } else {
            const errorCode = response.data['message'];
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: errorMessage[errorCode]
            });
        }

    }).catch(error => {
        dispatch({
            type: LOGIN_USER_ERROR,
            payload: error
        });
    });
};

export const forgotPassword = (forgotUserMail, history) => ({
    type: FORGOT_PASSWORD,
    payload: {forgotUserMail, history}
});
export const forgotPasswordSuccess = (forgotUserMail) => ({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: forgotUserMail
});
export const forgotPasswordError = (message) => ({
    type: FORGOT_PASSWORD_ERROR,
    payload: {message}
});

export const resetPassword = ({resetPasswordCode, newPassword, history}) => ({
    type: RESET_PASSWORD,
    payload: {resetPasswordCode, newPassword, history}
});
export const resetPasswordSuccess = (newPassword) => ({
    type: RESET_PASSWORD_SUCCESS,
    payload: newPassword
});
export const resetPasswordError = (message) => ({
    type: RESET_PASSWORD_ERROR,
    payload: {message}
});


export const registerUser = (user, history) => ({
    type: REGISTER_USER,
    payload: {user, history}
})
export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
})
export const registerUserError = (message) => ({
    type: REGISTER_USER_ERROR,
    payload: {message}
})

export const logoutUser = () => dispatch => {
    dispatch({
        type: LOGOUT_USER
    });
};