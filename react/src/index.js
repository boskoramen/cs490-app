import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import reducer from "./reducer/reducer";
import { initialState } from "./reducer/constants";
import MasterContext from "./reducer/context";
import cookie from "react-cookies";
import serverURL from "./util/serverinfo";
import axios from "axios";
import https from "https";
import { actions, pages } from "./reducer/constants";
import { BrowserRouter as Router } from "react-router-dom";

const Master = () => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const sesID = cookie.load('sesID');
    if(sesID && !state.isLoggedIn) {
        const postData = {
            'sesID': sesID,
        };
        axios.post(serverURL, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 1000,
            httpsAgent: new https.Agent({ keepAlive: true }),
        }).then((res) => {
            switch(res.data) {
                case 'user':
                    dispatch({type: actions.setLoggedIn, value: true});
                    dispatch({type: actions.changePage, value: pages.user});
                    break;
                case 'admin':
                    dispatch({type: actions.setLoggedIn, value: true});	
                    dispatch({type: actions.changePage, value: pages.instructor});
                    break;
                default:
                    // Session no longer valid, delete cookie
                    cookie.remove('sesID');
            }
        });
    }
    const CurrentPage = state.currentPage;

    // TODO: add user information obj as part of state
    return (
        <Router>
            <MasterContext.Provider value={dispatch}>
                <CurrentPage />
            </MasterContext.Provider>
        </Router>
    );
}

// This is the HTML element in which we want React to render
const reactDomContainer = document.getElementById("root");

ReactDOM.render(<Master />, reactDomContainer);
