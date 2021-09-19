import React from "react";
import ReactDOM from "react-dom";
import { LoginPage } from "./pages/login.js";

function Master() {
    return <LoginPage />;
}

const base = <Master/>;

// This is the HTML element in which we want React to render
const reactDomContainer = document.getElementById("root");

ReactDOM.render(base, reactDomContainer);
