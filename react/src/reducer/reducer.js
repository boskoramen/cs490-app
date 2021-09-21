import { actions } from './constants';

const reducer = (state, action) => {
    switch(action.type) {
        case actions.change_page:
            return {...state, current_page: action.value};
    }
};

export default reducer;