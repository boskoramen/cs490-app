import { actions } from './constants';

const reducer = (state, action) => {
    switch(action.type) {
        case actions.setLoggedIn:
            return {...state, isLoggedIn: action.value, userType: action.type};
    }
};

export default reducer;