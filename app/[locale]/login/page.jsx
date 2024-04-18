"use client";

import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { authenticate } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

import { useTranslation } from "react-i18next";

function Copyright(props) {
	return (
		<Typography variant="body2" color="white" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="http://localhost:3000/">
				Terreneitor
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default function SignIn() {
	const [errorMessage, dispatch] = useFormState(authenticate, undefined);

	//TODO: add link for forgot password option
	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box component="form" action={dispatch} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<LoginButton />

					<Grid container>
						<Grid item xs>
                            {/* change the url to dynamic ones */}
							<Link href="http://localhost:3000/es/#" variant="body2"> 
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="http://localhost:3000/es/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			{errorMessage && <ErrorAlert message={errorMessage} />}
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}

function LoginButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			fullWidth
			variant="outlined"
			color="secondary"
			sx={{ mt: 3, mb: 2 }}
			aria-disabled={pending}
		>
			Sign In
		</Button>
	);
}

//TODO: make the messages locale aware
function ErrorAlert({ message }) {
	const { t } = useTranslation('errors');
    return (
        <Alert
            variant="outlined"
            severity="error"
            sx={{ mt: 4 }}
        >
            {t(message)}
        </Alert>
    );
}