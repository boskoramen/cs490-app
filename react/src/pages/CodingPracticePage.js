import React, { useContext } from "react";
import { Page } from "../components/Page";
import styles from "../styles/main.scss";
import MasterContext from "../reducer/context";

const { codingPracticeHeader, codingPracticeTitle, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    const { dispatch } = useContext(MasterContext);
    return (
        <Page {...props}>
            <div className={codingPracticeHeader}>
                CodingPractice
            </div>
            <div className={codingPracticeContents} style={{width: "100%"}}>
                <div className={codingPracticeTitle}>
                    {props.headerFunction ? props.headerFunction(props, dispatch) :
                    props.pageTitle
                    }
                </div>
                {props.children}
            </div>
        </Page>
    );
};

export default CodingPracticePage;