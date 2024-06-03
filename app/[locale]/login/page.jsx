import SignIn from "./Login";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/*
 * This is the page for the user to log in by entering their email and password.
 * They can go to the Sign Up page if they don't have an account.
 * They can go to the Forgot password page if they forgot their password.
 * With an active session, the user is redirected to the dashboard.
 */

export default function Login() {
	const session = auth();
	if (session) {
		redirect("/dashboard");
	}

	return <SignIn />;
}
