import React, { useContext } from "react";
import { Page } from "../components/Page";
import { Flex } from "../components/Flex";
import styles from "../styles/main.scss";
import MasterContext from "../reducer/context";

const { codingPracticeHeader, codingPracticeBody, codingPracticeTitle, codingPracticeTitleLabel, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    const { dispatch } = useContext(MasterContext);
    return (
        <Page {...props}>
            <div className={codingPracticeHeader}>
                CodingPractice
            </div>
            <div className={codingPracticeContents} style={{width: "100%"}}>
                <div className={codingPracticeTitle}>
                    <Flex justifyContent="space-between">
                        <div className={codingPracticeTitleLabel}>
                            {props.pageTitle}
                        </div>
                        {props.headerComponents && props.headerComponents.map((elem) => {
                            const HeaderComponent = elem.component;
                            const key = elem.key;
                            return <HeaderComponent key={key} />;
                        })
                        }
                    </Flex>
                </div>
                <div className={codingPracticeBody}>
                    {props.children}
                </div>
            </div>
        </Page>
    );
};

export default CodingPracticePage;