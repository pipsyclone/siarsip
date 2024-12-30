import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Dashboard from "@/components/pages/template";
import AuthProvider from "@/context/AuthProvider";

export default function RootLayout({ children }) {
	return (
		<AuthProvider>
			<html lang="en">
				<body>
					<Dashboard content={children} />
				</body>
			</html>
		</AuthProvider>
	);
}
