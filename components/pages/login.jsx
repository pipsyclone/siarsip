"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Scripts from "@/utils/scripts";

export default function Login() {
	const [isLoading, setIsLoading] = useState(false);
	const { toastAlert } = Scripts();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const HandleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		if (username === "" || password === "") {
			toastAlert(
				"error",
				"Could'nt Authorization!",
				"Form masih ada yang kosong!",
				5000
			);
			setIsLoading(false);
		} else {
			signIn("credentials", { username, password, redirect: false }).then(
				async (res) => {
					if (res.error) {
						toastAlert(
							"error",
							"Could'nt Authorization!",
							"Invalid username or password!",
							5000
						);
					} else return (window.location.href = "/dashboard");
					setIsLoading(false);
				}
			);
		}
	};

	return (
		<div className="relative w-full h-screen">
			<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
				<div className="bg-white rounded-lg p-3 w-[300px] flex flex-col gap-3">
					<h1 className="font-medium text-center text-xl">LOGIN SIARSIP</h1>
					<hr />
					<form onSubmit={HandleSubmit} className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<label>Username</label>
							<input
								type="text"
								placeholder="Masukkan Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label>Password</label>
							<input
								type="password"
								placeholder="Masukkan Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							type="submit"
							className={
								isLoading
									? "disabled:opacity-75 p-3 bg-blue-400 text-white"
									: "p-3 bg-blue-500 hover:bg-blue-400 text-white"
							}
							disabled={isLoading}
						>
							{isLoading ? "Loading..." : "LOGIN"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
