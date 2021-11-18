import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { queryServer } from "../util/helpers";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";

import "ace-builds/src-noconflict/mode-python";

const TestResultsPage = (props) => {
    const { state } = useContext(MasterContext);
    const { gradeTest } = state;
    const {
        test_answer_data, test_id
    } = gradeTest;
    const [ localState, setLocalState ] = useState({
        success: false,
        currentAnswerIdx: 0,
    });
    const {
        success, currentAnswerIdx
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const currentAnswer = test_answer_data[currentAnswerIdx];
    const testCaseData = JSON.parse(currentAnswer.test_case_score);
    return (
        !success ?
        <UserPage pageTitle="View Exam Results" {...props}>
            <Flex flexDirection="column">
                {test_answer_data.length > 1 &&
                <Button
                    onClick={() => {
                        const newIdx = (currentAnswerIdx + 1) < test_answer_data.length ? currentAnswerIdx + 1 : 0;
                        setLocalState({
                            ...localState,
                            currentAnswerIdx: newIdx,
                        });
                    }}
                >
                    Next
                </Button>
                }
                <AceEditor
                    mode="python"
                    name="code-editor"
                    readOnly={true}
                    value={currentAnswer.answer || ""}
                    height="200px"
                />
                <div>
                    Review:
                </div>
                <Box>
                    {currentAnswer.review}
                </Box>
                <Flex
                    flexDirection="column"
                >
                    {Object.keys(testCaseData.constraints).map((constraint, idx) => {
                        return (
                            <Flex
                                key={constraint}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Constraint {constraint}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.constraints[constraint]}
                                </Box>
                            </Flex>
                        );
                    })}
                    {Object.keys(testCaseData.test_case).map((testCase, idx) => {
                        return (
                            <Flex
                                key={testCase}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Test Case {testCase}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.test_case[testCase].score}
                                </Box>
                            </Flex>
                        );
                    })}
                </Flex>
                <Button
                    onClick={() => {
                        setLocalState({
                            ...localState,
                            success: true,
                        });
                    }}
                >
                    Finish
                </Button>
            </Flex>
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default TestResultsPage;