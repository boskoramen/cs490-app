import React from "react";
import { Page } from "../components/page.js";
import { Input } from "../components/input.js";
import { Flex } from "../components/flex.js";
import { Button } from "../components/button.js";

export const LoginPage = (props) => {
    return (
		<Page {...props}>
			<Flex flexDirection="column">
				<h1>Login</h1>
				<div>Username</div>
				<Input defaultValue="Enter username" />
				<div>Password</div>
				<Input defaultValue="Enter password" />
				<Button>
					Log In
				</Button>
			</Flex>
		</Page>
	);
}
