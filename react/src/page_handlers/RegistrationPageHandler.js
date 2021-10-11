import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import RegistrationPage from "../pages/RegistrationPage";
import MasterContext from "../reducer/context";

const RegistrationPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        state.isLoggedIn ?
        <Redirect to="/" />
        : <RegistrationPage />
    );
}

export default RegistrationPageHandler;