import React, { useState, useContext } from "react";
import { Box } from "../components/Box";
import { Input } from "../components/Input";
import { Flex } from "../components/Flex";
import { Button } from "../components/Button";
import axios from "axios";
import https from "https";
import MasterContext from "../reducer/context";
import { actions, pages } from "../reducer/constants.js";
import CodingPracticePage from "./CodingPracticePage";
import serverURL from "../util/ServerInfo";
import setCookie from "set-cookie-parser";
import cookie from "react-cookies";

export const LoginPage = (props) => {
	const dispatch = useContext(MasterContext);
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
							httpsAgent: new https.Agent({ keepAlive: true }),
						}).then((res) => {
							if(res.status > 400) {
								setErrorMessage("Unable to communicate with server!");
								console.log(`Error: Bad response: ${res.status} ${res.statusText}`);
							} else if(res.status != 200) {
								return;
							}

							// Save cookies from response
							const cookies = setCookie.parse(res);
							for(const _cookie in cookies) {
								cookie.save(_cookie.name, _cookie.value);
							}
							
							switch(res.data) {
								case 'user':
									dispatch({type: actions.change_page, value: pages.user})
									break;
								case 'admin':
									dispatch({type: actions.change_page, value: pages.admin})
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
						dispatch({type: actions.change_page, value: pages.registration});
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
