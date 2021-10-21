import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Redirect } from "react-router-dom";
import { queryServer } from "../util/helpers";
import cookie from "react-cookies";
import { Button } from "../components/Button";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants";

const StudentExamPickerPage = (props) => {
    const { dispatch } = useContext(MasterContext);
    const [ examPool, setExamPool ] = useState(null);
    const [ examID, setExamID ] = useState(null);

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateExamPool = (res) => {
        if(!res.data) {
            // Add error handling
            return;
        }
        setExamPool(res.data);
    }

    if(!examPool) {
        queryServer('get_exam', {
            id: userID,
            sesID: sesID,
        }, populateExamPool);
    }

    // TODO: turn button into anchor
    return (
        examID === null ?
        <UserPage pageTitle="Pick an Exam">
            {examPool && examPool.map((exam) => (
                <Button
                    onClick={()=>{
                        dispatch({type: actions.setExamID, value: exam.exam_id});
                        setExamID(exam.examID);
                    }}
                    key={exam.exam_id}
                >
                    {exam.name}
                </Button>
            ))
            }
        </UserPage>
        : <Redirect to="/take_exam" />
    );
}

export default StudentExamPickerPage;