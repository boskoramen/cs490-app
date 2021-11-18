import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import ReviewTestPage from "../pages/ReviewTestPage";
import MasterContext from "../reducer/context";

// Makes sure user has access to a user page and then directs them to the appropriate user page
const ReviewTestPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn || state.userType != 'instructor' || !state.test ?
        <Redirect to="/" />
        : <ReviewTestPage />
    );
}

export default ReviewTestPageHandler;