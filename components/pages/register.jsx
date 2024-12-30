"use client";
import Scripts from "@/utils/scripts";
import { useState } from "react";

export default function Register() {
	const { toastAlert } = Scripts();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		if (
			name == "" ||
			username == "" ||
			password == "" ||
			confirmPassword == "" ||
			role == ""
		) {
			toastAlert(
				"error",
				"Formulir Error!",
				"Masih ada formulir yang kosong!",
				5000
			);
			setIsLoading(false);
		} else if (password !== confirmPassword) {
			toastAlert(
				"error",
				"Password Error!",
				"Konfirmasi password tidak sama dengan password!",
				5000
			);
			setIsLoading(false);
		} else if (username.length < 6) {
			toastAlert(
				"error",
				"Username Error!",
				"Username minimal 6 karakter!",
				5000
			);
			setIsLoading(false);
		} else if (password.length < 6) {
			toastAlert(
				"error",
				"Password Error!",
				"Kata Sandi minimal 6 karakter!",
				5000
			);
			setIsLoading(false);
		} else {
			await axios
				.post("/api/users/post/register", {
					name,
					username,
					confirmPassword,
					role,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", res.data.title, res.data.message, 5000);
						setName("");
						setUsername("");
						setPassword("");
						setConfirmPassword("");
						setRole("");
					} else
						return toastAlert("error", res.data.title, res.data.message, 5000);
				});
			setIsLoading(false);
		}
	};

	return (
		<div className="card flex flex-col gap-3 w-[700px] mx-auto">
			<h1 className="font-medium text-xl">Daftarkan Pengguna</h1>
			<hr />
			<form onSubmit={handleRegister} className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<label>Masukkan Nama</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label>Masukkan Username</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1 basis-1/2">
						<label>Masukkan Password</label>
						<input
							type="text"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className="flex gap-3">
							<input
								type="checkbox"
								id="show-password"
								checked={showPassword}
								onChange={(e) => setShowPassword(e.target.checked)}
							/>
							<label htmlFor="show-password">Show Password</label>
						</div>
					</div>
					<div className="flex flex-col gap-1 basis-1/2">
						<label>Masukkan Konfirmasi Password</label>
						<input
							type="text"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<label>Pilih Role</label>
					<select value={role} onChange={(e) => setRole(e.target.value)}>
						<option value={""}>- Pilih Role -</option>
						<option value={"ADMIN"}>ADMIN</option>
						<option value={"USER"}>USER</option>
					</select>
				</div>

				<button
					type="submit"
					className={`bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-400 duration-500 ease-in-out ${
						isLoading ? "bg-blue-400 disabled" : ""
					}`}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<i className="fa-solid fa-spinner animate-spin me-3"></i> Loading
						</>
					) : (
						"Daftar"
					)}
				</button>
			</form>
		</div>
	);
}
