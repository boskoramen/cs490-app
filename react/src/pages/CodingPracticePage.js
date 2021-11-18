import React, { useContext } from "react";
import { Box } from "../components/Box";
import { Page } from "../components/Page";
import { Flex } from "../components/Flex";
import styles from "../styles/main.scss";
import MasterContext from "../reducer/context";

const { codingPracticeHeader, codingPracticeBody, codingPracticeTitle, codingPracticeTitleLabel, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    const { dispatch } = useContext(MasterContext);
    return (
        <Page {...props}>
            <Box className={codingPracticeHeader}>
                CodingPractice
            </Box>
            <Box className={codingPracticeContents} style={{width: "100%"}}>
                <Box className={codingPracticeTitle}>
                    <Flex
                    >
                        <Box className={codingPracticeTitleLabel}>
                            {props.pageTitle}
                        </Box>
                        {props.headerComponents && props.headerComponents.map((elem) => {
                            const HeaderComponent = elem.component;
                            const key = elem.key;
                            return <HeaderComponent key={key} />;
                        })
                        }
                    </Flex>
                </Box>
                <Box className={codingPracticeBody}>
                    {props.children}
                </Box>
            </Box>
        </Page>
    );
};

export default CodingPracticePage;