import React, { useState } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { Textbox } from "../components/Textbox";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import cookie from "react-cookies";

// TODO: Add regex safety check for function name being present in the prompt
// TODO: Allow question header to automatically be added(?)
// TODO: fix adding test cases to be more user friendly (similar to adding question to exam)

const CreateQuestionPage = (props) => {
    const [ prompt, setPrompt ] = useState('');
    const [ funcName, setFuncName ] = useState('');
    const [ funcParams, setFuncParams ] = useState('');
    const [ difficulty, setDifficulty ] = useState('');
    const [ topic, setTopic ] = useState('');
    const [ inputCases, setInputCases ] = useState([]);
    const [ outputCases, setOutputCases ] = useState([]);
    const [ questionID, setQuestionID ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ success, setSuccess ] = useState(false);

    const handleAddTestCases = (res) => {
        // TODO: make sure this actually works
        if(res.data != inputCases.length) {
            setErrorMessage('Invalid test cases.');
            return;
        }
        setSuccess(true);
    };

    const handleSubmitQuestion = (res) => {
        if(res.data == 'bad attempt') {
            setErrorMessage('Invalid question!');
            return;
        }
        const userID = cookie.load('userID');
        const sesID = cookie.load('sesID');
        const qID = res.data[0].question_id;
        setQuestionID(qID);
        queryServer('many_test_case', {
            test_case_list: Array.from(inputCases, (_, i) => {
                return {
                    input: inputCases[i],
                    output: outputCases[i],
                    questionID: qID,
                };
            }),
            id: userID,
            sesID: sesID,
        }, handleAddTestCases);
    };

    return (
        success ?
        <Redirect to="/"/>
        : <UserPage pageTitle="Create a Question" {...props}>
            <Flex flexDirection="column">
                {errorMessage &&
                    <Box
                        padding={20}
                        borderStyle="solid"
                        borderWidth="2px"
                        borderColor="red"
                        color="red"
                        fontStyle="italic"
                    >
                        {errorMessage}
                    </Box>
				}
                <div>
                    Question Prompt:
                </div>
                <Textbox
                    value={prompt}
                    onChange={setPrompt}
                />
                <div>
                    Topic:
                </div>
                <Select
                    value={topic}
                    onChange={setTopic}
                    options={
                        ['For', 'While', 'Recursion', 'If'].map((entry) => ({value: entry, label: entry}))
                    }
                />
                <div>
                    Difficulty:
                </div>
                <Select
                    value={difficulty}
                    onChange={setDifficulty}
                    options={
                        ['Easy', 'Medium', 'Hard'].map((entry) => ({value: entry, label: entry}))
                    }
                />
                <div>
                    Function Name:
                </div>
                <Input
                    value={funcName}
                    onChange={setFuncName}
                />
                <div>
                    Function Params:
                </div>
                <Input
                    value={funcParams}
                    onChange={setFuncParams}
                />
                <div>
                    Constraints:
                </div>
                <Input
                    type="checkbox"
                />
                <div>
                    Input Cases (separate each set of input with a newline):
                </div>
                <Textbox
                    value={inputCases.join('\n')}
                    onChange={(inputs) => {
                        setInputCases(inputs.split('\n'));
                    }}
                />
                <div>
                    Output Cases (separate each set of output with a newline):
                </div>
                <Textbox
                    value={outputCases.join('\n')}
                    onChange={(outputs) => {
                        setOutputCases(outputs.split('\n'));
                    }}
                />
                <Button
                    onClick={() => {
                        if(questionID === null) {
                            if(inputCases.length != outputCases.length) {
                                setErrorMessage(`Number of input cases ${inputCases.length > outputCases.length ? 'greater' : 'less'} than number of output cases!`);
                                return;
                            } else {
                                setErrorMessage('');
                            }
                            const userID = cookie.load('userID');
                            const sesID = cookie.load('sesID');
                            queryServer('question', {
                                name: prompt,
                                funcname: funcName,
                                funcparm: funcParams,
                                difficulty: difficulty.value,
                                topic: topic.value,
                                constraint: 'for',
                                id: userID,
                                sesID: sesID,
                            }, handleSubmitQuestion);
                        }
                    }}
                >
                    Submit
                </Button>
            </Flex>
          </UserPage>
    );
};

export default CreateQuestionPage;