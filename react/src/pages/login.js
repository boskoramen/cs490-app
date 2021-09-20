import React from "react";
import { Page } from "../components/page.js";
import { Input } from "../components/input.js";
import { Flex } from "../components/flex.js";
import { Button } from "../components/button.js";
const https = require("https");

export const LoginPage = (props) => {
    return (
		<Page {...props}>
			<Flex flexDirection="column">
				<h1>Login</h1>
				<div>Username</div>
				<Input defaultValue="Enter username" />
				<div>Password</div>
				<Input defaultValue="Enter password" />
				<Button onClick={() => {
					const options = {
						hostname: "52.7.114.65",
						port: 9000,
						path: "/",
						method: "POST",
					};

					const req = https.request(options, (res) => {
						res.on('data', (chunk) => {
							console.log(chunk.toString());
						})
					});

					req.write("{\"name\": \"Isaiah\", \"pass\": \"password\"}");
					req.end();
				}}>
					Log In
				</Button>
			</Flex>
		</Page>
	);
}
