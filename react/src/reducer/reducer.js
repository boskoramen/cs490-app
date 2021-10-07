import { actions } from './constants';

const reducer = (state, action) => {
    switch(action.type) {
        // Have an action for handling login specifically rather than changing page w/value being the user obj
        case actions.change_page:
            return {...state, current_page: action.value};
    }
};

export default reducer;