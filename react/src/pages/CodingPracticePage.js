import React from "react";
import { Page } from "../components/Page";
import styles from "../styles/main.scss";

const { codingPracticeHeader, codingPracticeTitle, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    return (
        <Page {...props}>
            <div className={codingPracticeHeader}>
                CodingPractice
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