import { actions } from './constants';
import cookie from "react-cookies";

const reducer = (state, action) => {
    switch(action.type) {
        case actions.clearRedirectTo:
            return {...state, redirectTo: ''};
        case actions.setLoggedIn:
            if(!action.value) {
                cookie.remove('sesID');
            }
            return {...state, isLoggedIn: action.value, userType: action.userType};
        case actions.seeTests:
            return {...state, examID: action.value};
        case actions.setTestID:
            return {...state, testID: action.value};
        default:
            console.log(`INVALID ACTION TYPE: ${action.type}`)
            return state;
    }
};

export default reducer;