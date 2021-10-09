import React from "react";
import { Page } from "../components/Page";
import styles from "../styles/main.scss";
import { useLocation } from "react-router-dom";

const { codingPracticeHeader, codingPracticeTitle, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    const location = useLocation();
    return (
        <Page {...props}>
            <div className={codingPracticeHeader}>
                CodingPractice (location: {location.pathname})
            </div>
            <div className={codingPracticeContents}>
                <div className={codingPracticeTitle}>
                    {props.pageTitle}
                </div>
                {props.children}
            </div>
        </Page>
    );
};

export default CodingPracticePage;