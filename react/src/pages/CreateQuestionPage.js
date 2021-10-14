import React from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";

const handleSubmitQuestion = (res) => {
    ;
};

const CreateQuestionPage = (props) => {
    return (
        <UserPage pageTitle="Create a Question">
            <Flex flexDirection="column">
                <div>
                    Question Prompt:
                </div>
                <Input type="textbox" />
                <div>
                    Function Name:
                </div>
                <Input />
                <div>
                    Function Params:
                </div>
                <Input />
                <Button
                    onClick={() => {
                        queryServer('question', {
                            name: 1,
                            funcname: 1,
                            funcparm: 1,
                            id: 1,
                        }, handleSubmitQuestion)
                    }}
                >
                    Submit
                </Button>
            </Flex>
        </UserPage>
    );
};

export default CreateQuestionPage;