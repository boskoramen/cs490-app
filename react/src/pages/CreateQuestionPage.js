import React, { useState } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import cookie from "react-cookies";

const CreateQuestionPage = (props) => {
    const [ prompt, setPrompt ] = useState('');
    const [ funcName, setFuncName ] = useState('');
    const [ funcParams, setFuncParams ] = useState('');
    const [ inputCases, setInputCases ] = useState([]);
    const [ outputCases, setOutputCases ] = useState([]);

    const handleAddTestCases = (res) => {
        // TODO: make sure this actually works
        if(res.data != inputCases) {
            // TODO: add error box here (akin to login page)
            return;
        }
    };

    const handleSubmitQuestion = (res) => {
        if(!res.data) {
            // TODO: add error box here (akin to login page)
            return;
        }
        const questionID = res.data;
        queryServer('test_case', {
            input: inputCases,
            output: outputCases,
            id: questionID,
        }, handleAddTestCases);
    };

    return (
        <UserPage pageTitle="Create a Question" {...props}>
            <Flex flexDirection="column">
                <div>
                    Question Prompt:
                </div>
                <Input
                    type="textbox"
                    onChange={setPrompt}
                />
                <div>
                    Function Name:
                </div>
                <Input
                    onChange={setFuncName}
                />
                <div>
                    Function Params:
                </div>
                <Input
                    onChange={setFuncParams}
                />
                <div>
                    Input Cases (separate each set of input with a newline):
                </div>
                <Input
                    type="textbox"
                    onChange={(inputs) => {
                        setInputCases(inputs.split('\n'));
                    }}
                />
                <div>
                    Output Cases (separate each set of output with a newline):
                </div>
                <Input
                    type="textbox"
                    onChange={(outputs) => {
                        setOutputCases(outputs.split('\n'));
                    }}
                />
                <Button
                    onClick={() => {
                        const userID = cookie.load('userID');
                        queryServer('question', {
                            name: prompt,
                            funcname: funcName,
                            funcparm: funcParams,
                            id: userID,
                        }, handleSubmitQuestion);
                    }}
                >
                    Submit
                </Button>
            </Flex>
        </UserPage>
    );
};

export default CreateQuestionPage;