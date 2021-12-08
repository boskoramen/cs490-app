import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { constraint_description } from "../util/constants";
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
    const { test_case_data, constraint_data } = currentAnswer;

    let totalScore = 0;
    for(let answer of test_answer_data) {
        for(let constraint of answer.constraint_data) {
            totalScore += constraint.score;
        }
        for(let testCase of answer.test_case_data) {
            totalScore += testCase.score;
        }
    }
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
                    {constraint_data.map((constraint, idx) => {
                        return (
                            <Flex
                                key={constraint.id}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Constraint:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {constraint_description[constraint.name]}
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {constraint.score}
                                </Box>
                            </Flex>
                        );
                    })}
                    {test_case_data.map((testCase, idx) => {
                        return (
                            <Flex
                                key={testCase.id}
                                backgroundColor="gray"
                            >
                                <Flex
                                    flexDirection="column"
                                >
                                    <Box>
                                        <Box
                                        >
                                            Test Case {idx+1}:
                                        </Box>
                                        <Flex>
                                            <Box
                                                backgroundColor="beige"
                                            >
                                                {testCase.score}
                                            </Box>
                                        </Flex>
                                    </Box>
                                    <Flex>
                                        <Box>
                                            Input:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.input}
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <Box>
                                            Expected Output:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.expected_output}
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <Box>
                                            Actual Output:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.output}
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Flex>
                        );
                    })}
                </Flex>
                <Box
                    backgroundColor="purple"
                >
                    <Flex>
                        <Box
                            backgroundColor="beige"
                        >
                            {totalScore}
                        </Box>
                    </Flex>
                </Box>
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