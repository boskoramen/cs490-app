import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { Redirect } from "react-router-dom";
import { queryServer, addClassNames } from "../util/helpers";
import cookie from "react-cookies";
import { Button } from "../components/Button";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants";
import styles from "../styles/main.scss";

const { roundButton } = styles;

const TestPickerPage = (props) => {
    const { state, dispatch } = useContext(MasterContext);
    const [ testPool, setTestPool ] = useState(null);
    const [ testID, setTestID ] = useState(null);

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateTestPool = (res) => {
        if(!res.data) {
            // Add error handling
            return;
        }
        setTestPool(res.data);
    }

    const handleRelease = (res) => {
        if(!res.data) {
            // Add error handling
            return;
        }
        const ids = res.data;
        setTestPool({
            ...testPool,
            reviewed: testPool.reviewed.map((entry) => {
                let released = false;
                for(const id of ids) {
                    if(id == entry.test_id) {
                        released = true;
                        break;
                    }
                }
                if(released) {
                    return {
                        ...entry,
                        release_test: true,
                    };
                } else {
                    return entry;
                }
            }),
        })
    }

    if(!testPool) {
        queryServer('get_test', {
            id: userID,
            sesID: sesID,
            exam_id: state.examID,
        }, populateTestPool);
    }

    // TODO: turn button into anchor
    return (
        testID === null ?
        <UserPage pageTitle="Pick an Exam">
            <Flex
                flexDirection="column"
            >
                <Box>
                    Not Reviewed:
                </Box>
                {testPool && testPool.not_reviewed.map((entry) => {
                    return (
                        <Button
                            classNames={addClassNames(roundButton)}
                            onClick={()=>{
                                dispatch({type: actions.reviewTest, value: entry});
                                setTestID(entry.test_id);
                            }}
                            key={entry.test_id}
                        >
                            {entry.username}
                        </Button>
                    );
                })}
                <Box>
                    Reviewed:
                </Box>
                {testPool && testPool.reviewed.map((entry, idx) => {
                    return (
                        <Box
                            classNames={addClassNames(roundButton)}
                            key={entry.test_id}
                        >
                            <Flex
                                flexDirection="column"
                            >
                                <a
                                    onClick={()=>{
                                        dispatch({type: actions.reviewTest, value: entry});
                                        setTestID(entry.test_id);
                                    }}
                                >
                                    {entry.username}{entry.release_test ? ' (released)' : ''}
                                </a>
                                <a
                                    onClick={()=>{
                                        queryServer('release', {
                                            test_list: [
                                                entry,
                                            ],
                                        }, handleRelease);
                                    }}
                                >
                                    Release
                                </a>
                            </Flex>
                        </Box>
                    );
                })}
            </Flex>
        </UserPage>
        : <Redirect to="/review_exam" />
    );
}

export default TestPickerPage;