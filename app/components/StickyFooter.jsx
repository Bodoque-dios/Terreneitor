"use server";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary">
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default async function StickyFooter() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
				<Typography variant="h2" component="h1" gutterBottom>
					Sticky footer
				</Typography>
				<Typography variant="h5" component="h2" gutterBottom>
					{"Pin a footer to the bottom of the viewport."}
					{"The footer will move as the main element of the page grows."}
				</Typography>
				<Typography variant="body1">Sticky footer placeholder.</Typography>
			</Container>
			<Box component="footer">
				<Container maxWidth="sm">
					<Typography variant="body1">
						My sticky footer can be found here.
					</Typography>
					<Copyright />
				</Container>
			</Box>
		</Box>
	);
}
