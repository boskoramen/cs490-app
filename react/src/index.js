import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import reducer from "./reducer/reducer";
import { initialState } from "./reducer/constants";
import MasterContext from "./reducer/context";
import cookie from "react-cookies";
import serverURL from "./util/serverinfo";
import axios from "axios";

const Master = () => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const sessionID = cookie.load('sessionID');
    const postData = {
        'sessionID': sessionID,
    };
    axios.post(serverURL, postData, {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 1000,
        httpsAgent: new https.Agent({ keepAlive: true }),
    }).then((res) => {
        switch(res.data) {
            // TODO: Add handling for user obj here
            default:
                // Handle dispatch to handle login here?
                ;
        }
    })
    const CurrentPage = state.current_page;

    // TODO: add user information obj as part of state
    return (
        <MasterContext.Provider value={dispatch}>
            <CurrentPage />
        </MasterContext.Provider>
    );
}

// This is the HTML element in which we want React to render
const reactDomContainer = document.getElementById("root");

ReactDOM.render(<Master />, reactDomContainer);
