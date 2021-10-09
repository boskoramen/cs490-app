import { actions } from './constants';

const reducer = (state, action) => {
    switch(action.type) {
        // Have an action for handling login specifically rather than changing page w/value being the user obj
        case actions.changePage:
            return {...state, currentPage: action.value};
        case actions.setLoggedIn:
            return {...state, isLoggedIn: action.value};
    }
};

export default reducer;