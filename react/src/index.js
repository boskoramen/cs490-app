import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import reducer from "./reducer/reducer";
import { initialState } from "./reducer/constants";
import MasterContext from "./reducer/context";
import cookie from "react-cookies";
import serverURL from "./util/serverinfo";
import axios from "axios";
import https from "https";
import { actions } from "./reducer/constants";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserPageHandler from "./page_handlers/UserPageHandler";
import LoginPageHandler from "./page_handlers/LoginPageHandler";
import RegistrationPageHandler from "./page_handlers/RegistrationPageHandler";

const Master = () => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const sesID = cookie.load('sesID');
    const userID = cookie.load('userID');
    if(sesID && userID && !state.isLoggedIn) {
        const postData = {
            'sesID': sesID,
            'id': userID,
        };
        axios.post(serverURL, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 1000,
            httpsAgent: new https.Agent({ keepAlive: true }),
        }).then((res) => {
            switch(res.data) {
                case 'student':
                    dispatch({type: actions.setLoggedIn, value: true});
                    break;
                case 'admin':
                    dispatch({type: actions.setLoggedIn, value: true});
                    break;
                default:
                    // Session no longer valid, delete cookie
                    cookie.remove('sesID');
                    cookie.remove('userID');
            }
        });
    }

    return (
        <Router>
            <MasterContext.Provider value={{state, dispatch}}>
                <Switch>
                    <Route path="/register">
                        <RegistrationPageHandler />
                    </Route>
                    <Route path="/login">
                        <LoginPageHandler />
                    </Route>
                    <Route exact path="/">
                        <UserPageHandler />
                    </Route>
                </Switch>
            </MasterContext.Provider>
        </Router>
    );
}

// This is the HTML element in which we want React to render
const reactDomContainer = document.getElementById("root");

ReactDOM.render(<Master />, reactDomContainer);
