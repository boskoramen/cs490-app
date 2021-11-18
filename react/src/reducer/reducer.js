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
        case actions.takeExam:
            return {...state, examID: action.value};
        case actions.reviewTest:
            return {...state, test: action.value};
        case actions.seeResults:
            return {...state, gradeTest: action.value};
        default:
            console.log(`INVALID ACTION TYPE: ${action.type}`)
            return state;
    }
};

export default reducer;