import React, { useState } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import cookie from "react-cookies";

const handleSubmitQuestion = (res) => {
    switch(res.data) {
        default:
            ;
    }
};

const CreateQuestionPage = (props) => {
    const [ prompt, setPrompt ] = useState('');
    const [ funcName, setFuncName ] = useState('');
    const [ funcParams, setFuncParams ] = useState('');
    const [ inputCases, setInputCases ] = useState([]);
    const [ outputCases, setOutputCases ] = useState([]);
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
                        queryServer('question', {
                            name: prompt,
                            funcname: funcName,
                            funcparm: funcParams,
                            input: inputCases,
                            output: outputCases,
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