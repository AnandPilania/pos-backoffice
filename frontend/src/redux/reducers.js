import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import mySite from './my-site/reducer';

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  mySite
});

export default reducers;