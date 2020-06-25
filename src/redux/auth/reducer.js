import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    LOAD_USER_SUCCESS
} from '../actions';

const INIT_STATE = {
    token: localStorage.getItem('_fs_utk'),
    user: JSON.parse(localStorage.getItem('user_info')),
    forgotUserMail: '',
    newPassword: '',
    resetPasswordCode: '',
    loading: false,
    error: ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOAD_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: '' };
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, token: action.payload.token, user: action.payload.user, error: '' };
        case LOGIN_USER_ERROR:
            return { ...state, loading: false, token: '', error: action.payload };
        case FORGOT_PASSWORD:
            return { ...state, loading: true, error: '' };
        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, forgotUserMail: action.payload, error: '' };
        case FORGOT_PASSWORD_ERROR:
            return { ...state, loading: false, forgotUserMail: '', error: action.payload.message };
        case RESET_PASSWORD:
            return { ...state, loading: true, error: '' };
        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, newPassword: action.payload, resetPasswordCode: '', error: '' };
        case RESET_PASSWORD_ERROR:
            return { ...state, loading: false, newPassword: '', resetPasswordCode: '', error: action.payload.message };
        case REGISTER_USER:
            return { ...state, loading: true, error: '' };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, token: action.payload.uid, error: '' };
        case REGISTER_USER_ERROR:
            return { ...state, loading: false, token: '', error: action.payload.message };
        case LOGOUT_USER:
            localStorage.removeItem('_fs_utk');
            localStorage.removeItem('user_info');
            localStorage.removeItem('menu_app_config');
            return { ...state, token: null, error: '', user: "", loading: false };
        default: return { ...state };
    }
}
