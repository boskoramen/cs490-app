import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CreateExamPage from "../pages/CreateExamPage";
import MasterContext from "../reducer/context";

const CreateExamPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn ?
        <Redirect to="/" />
        : <CreateExamPage />
    );
}

export default CreateExamPageHandler;