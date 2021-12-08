import React, { useContext } from "react";
import { Box } from "../components/Box";
import { Page } from "../components/Page";
import { Flex } from "../components/Flex";
import styles from "../styles/main.scss";
import MasterContext from "../reducer/context";
import { addClassNames } from "../util/helpers";

const { codingPracticeHeader, codingPracticeBody, codingPracticeTitle, codingPracticeTitleLabel, codingPracticeContents } = styles;
const CodingPracticePage = (props) => {
    const { dispatch } = useContext(MasterContext);
    return (
        <Page {...props}>
            <Box classNames={addClassNames(codingPracticeHeader)}>
                CodingPractice
            </Box>
            <Box classNames={addClassNames(codingPracticeContents)} style={{width: "100%"}}>
                <Box classNames={addClassNames(codingPracticeTitle)}>
                    <Flex
                    >
                        <Box classNames={addClassNames(codingPracticeTitleLabel)}>
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
                <Box classNames={addClassNames(codingPracticeBody)}>
                    {props.children}
                </Box>
            </Box>
        </Page>
    );
};

export default CodingPracticePage;