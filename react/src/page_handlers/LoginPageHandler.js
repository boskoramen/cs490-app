import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import LoginPage from "../pages/LoginPage";
import MasterContext from "../reducer/context";

const LoginPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        state.isLoggedIn ?
        <Redirect to="/" />
        : <LoginPage />
    );
}

export default LoginPageHandler;