"use client";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect } from "react";

export default function RootLayout({ children }) {
	useEffect(() => {
		setInterval(() => {
			window.location.href = "/dashboard";
		}, 1000);
	}, []);
	return (
		<html lang="en">
			<body>
				<div className="relative w-full h-screen">
					<div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
						<i className="fa-solid fa-spinner animate-spin me-3"></i> Loading...
					</div>
				</div>
			</body>
		</html>
	);
}
