import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import reducer from "./reducer/reducer";
import { initialState } from "./reducer/constants";
import MasterContext from "./reducer/context";
import cookie from "react-cookies";
import { actions } from "./reducer/constants";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserPageHandler from "./page_handlers/UserPageHandler";
import LoginPageHandler from "./page_handlers/LoginPageHandler";
import RegistrationPageHandler from "./page_handlers/RegistrationPageHandler";
import CreateQuestionPageHandler from "./page_handlers/CreateQuestionPageHandler";
import CreateExamPageHandler from "./page_handlers/CreateExamPageHandler";
import TestPickerPageHandler from "./page_handlers/TestPickerPageHandler";
import TakeExamPageHandler from "./page_handlers/TakeExamPageHandler";
import { queryServer } from "./util/helpers";
import ReviewTestPageHandler from "./page_handlers/ReviewTestPageHandler";

const Master = () => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const sesID = cookie.load('sesID');
    const userID = cookie.load('userID');

    const handleSessionLogin = (res) => {
        switch(res.data) {
            case 'student':
            case 'instructor':
                dispatch({type: actions.setLoggedIn, value: true, userType: res.data});
                break;
            default:
                // Session no longer valid, delete cookie
                cookie.remove('sesID');
                cookie.remove('userID');
        }
    };

    if(sesID && userID && !state.isLoggedIn) {
        queryServer('login', {sesID: sesID, id: userID}, handleSessionLogin);
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
                    <Route path="/create_question">
                        <CreateQuestionPageHandler />
                    </Route>
                    <Route path="/create_exam">
                        <CreateExamPageHandler />
                    </Route>
                    <Route path="/take_exam">
                        <TakeExamPageHandler />
                    </Route>
                    <Route path="/review_exam_results">
                        <TestPickerPageHandler />
                    </Route>
                    <Route path="/review_exam">
                        <ReviewTestPageHandler />
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
