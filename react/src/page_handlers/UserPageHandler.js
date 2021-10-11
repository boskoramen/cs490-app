import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import UserPage from "../pages/UserPage";
import MasterContext from "../reducer/context";

const UserPageHandler = (props) => {
    const { state } = useContext(MasterContext);
    return (
        !state.isLoggedIn ?
        <Redirect to="/login" />
        : <UserPage />
    );
}

export default UserPageHandler;