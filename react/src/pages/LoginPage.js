import React, { useState, useContext } from "react";
import { Box } from "../components/Box";
import { Input } from "../components/Input";
import { Flex } from "../components/Flex";
import { Button } from "../components/Button";
import axios from "axios";
import https from "https";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants.js";
import CodingPracticePage from "./CodingPracticePage";
import serverURL from "../util/serverinfo";
import cookie from "react-cookies";

const LoginPage = (props) => {
	const { dispatch } = useContext(MasterContext);
	const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
    return (
		<CodingPracticePage {...props} pageTitle="Login">
			<Flex flexDirection="column" width={300}>
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
				<div>Username</div>
				<Input defaultValue="Enter username" onChange={setUsername} />
				<div>Password</div>
				<Input isPassword={true} defaultValue="Enter password" onChange={setPassword} />
				<Button 
					onClick={() => {
						const postData = {
							'name': username,
							'pass': password,
						};
						axios.post(serverURL, postData, {
							headers: {
								'Content-Type': 'application/json',
							},
							timeout: 1000,
							withCredentials: true,
							httpsAgent: new https.Agent({ keepAlive: true }),
						}).then((res) => {
							if(res.status > 400) {
								setErrorMessage("Unable to communicate with server!");
								console.log(`Error: Bad response: ${res.status} ${res.statusText}`);
							} else if(res.status != 200) {
								return;
							}
							const [ result, sesID, userID ] = res.data.split(";");
							if(sesID && userID) {
								cookie.save('sesID', sesID);
								cookie.save('userID', userID);
							}
							switch(result) {
								case 'student':
									dispatch({type: actions.setLoggedIn, value: true, userType: "student"});
									break;
								case 'instructor':
									dispatch({type: actions.setLoggedIn, value: true, userType: "instructor"});
									break;
								default:
									setErrorMessage("Invalid username and password credentials passed!");
							}
						})
						.catch((error) => {
							if(error.request) {
								setErrorMessage("Unable to communicate with server!");
								console.log(`Error: ${error.message}\n${error.stack}`);
							}
						});
					}}
					width={150}
				>
					Log In
				</Button>
				<a 
					href="" 
					onClick={(e) => {
						e.preventDefault();
						const history = useHistory();
						history.push("/register");
					}}
					style={{
						display: "inline-block",
					}}
				>
					Create Account
				</a>
			</Flex>
		</CodingPracticePage>
	);
}

export default LoginPage;
