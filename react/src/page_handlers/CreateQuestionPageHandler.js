import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import MasterContext from "../reducer/context";

const CreateQuestionPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn && state.userType != 'instructor' ?
        <Redirect to="/" />
        : <CreateQuestionPage />
    );
}

export default CreateQuestionPageHandler;