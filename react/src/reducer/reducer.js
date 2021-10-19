import { actions } from './constants';
import cookie from "react-cookies";

const reducer = (state, action) => {
    switch(action.type) {
        case actions.setLoggedIn:
            if(!action.value) {
                cookie.remove('sesID');
            }
            return {...state, isLoggedIn: action.value, userType: action.userType};
        default:
            console.log(`INVALID ACTION TYPE: ${action.type}`)
            return state;
    }
};

export default reducer;