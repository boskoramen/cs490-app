import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import reducer from "./reducer/reducer";
import { initialState } from "./reducer/constants";
import MasterContext from "./reducer/context";

const Master = () => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const CurrentPage = state.current_page;
    return (
        <MasterContext.Provider value={dispatch}>
            <CurrentPage />
        </MasterContext.Provider>
    );
}

// This is the HTML element in which we want React to render
const reactDomContainer = document.getElementById("root");

ReactDOM.render(<Master />, reactDomContainer);
