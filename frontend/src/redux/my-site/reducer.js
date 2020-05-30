import {
    UPDATE_MENU_APP_COLORS_REQUEST,
    UPDATE_MENU_APP_SETTINGS_SUCCESS,
    UPDATE_MENU_APP_COLORS_FAIL,
    UPDATE_MENU_APP_LOGO_REQUEST,
    UPDATE_MENU_APP_LOGO_FAIL
} from '../actions';
import {NotificationManager} from "../../components/common/react-notifications";

const INIT_STATE = {
    menuAppSettings: JSON.parse(localStorage.getItem('menu_app_config')),
    templateLoading: false,
    logoLoading: false,
    error: ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case UPDATE_MENU_APP_COLORS_REQUEST:
            return { ...state, templateLoading: true, error: '' };
        case UPDATE_MENU_APP_SETTINGS_SUCCESS:
            return { ...state, templateLoading: false, error: '', menuAppSettings: action.payload };
        case UPDATE_MENU_APP_COLORS_FAIL:
            NotificationManager.warning(
                action.payload,
                "Error",
                3000,
                null,
                null,
                ''
            );
            return { ...state, templateLoading: false, error: action.payload };

        case UPDATE_MENU_APP_LOGO_REQUEST:
            return { ...state, logoLoading: true, error: '' };
        case UPDATE_MENU_APP_LOGO_FAIL:
            NotificationManager.warning(
                action.payload,
                "Error",
                3000,
                null,
                null,
                ''
            );
            return { ...state, logoLoading: false, error: action.payload };
        default: return { ...state };
    }
}
