"use client";
import axios from "axios";
import { getUserByUserid } from "@/utils/custom-swr";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Scripts from "@/utils/scripts";

export default function Settings() {
	const { data: session } = useSession();
	const { user } = getUserByUserid(session?.user?.userid);
	const { toastAlert } = Scripts();
	const [showPassword, setShowPassword] = useState(false);

	// const [userDetail, setUserDetail] = useState(null);
	const [userid] = useState(session?.user?.userid);
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		// Update state setiap kali userDetail berubah
		if (user) {
			setName(user?.name || "");
		}
	}, [user]);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		if (name === "") {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Form tidak boleh kosong!",
				3000
			);
		} else {
			await axios
				.put("/api/users/put/by-userid", {
					type: "update-profile",
					userid,
					name,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", "Berhasil", res.data.message, 3000);
						signOut();
					} else {
						toastAlert("error", "Gagal mengubah data!", res.data.message, 3000);
					}
				});
		}
	};

	const handleUpdatePassword = async (e) => {
		e.preventDefault();

		if (password === "" || confirmPassword === "") {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Form tidak boleh kosong!",
				3000
			);
		} else if (password !== confirmPassword) {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Konfirmasi kata sandi harus sama dengan kata sandi!",
				3000
			);
		} else {
			await axios
				.put("/api/users/put/by-userid", {
					type: "update-password",
					userid,
					confirmPassword,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", "Berhasil!", res.data.message, 3000);
						setPassword("");
						setConfirmPassword("");
					} else {
						toastAlert("error", "Gagal mengubah data!", res.data.message, 3000);
					}
				});
		}
	};

	return (
		<>
			<div className="card flex flex-col gap-3">
				<h1 className="font-medium italic">Pengaturan Pengguna</h1>
				<hr />
				<form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Lengkap</label>
						<input
							type="text"
							placeholder="Nama Lengkap"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 p-2 text-white ms-auto rounded-lg"
					>
						Simpan
					</button>
				</form>
			</div>
			<div className="card mt-3 flex flex-col gap-3">
				<h1 className="font-medium italic">Keamanan</h1>
				<hr />
				<form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Kata Sandi Baru</label>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Kata Sandi Baru"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Konfirmasi Kata Sandi</label>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Konfirmasi Kata Sandi Baru"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<input
							type="checkbox"
							id="show-password"
							checked={showPassword}
							onChange={(e) => setShowPassword(e.target.checked)}
						/>
						<label htmlFor="show-password">Lihat Kata Sandi</label>
					</div>

					<button
						type="submit"
						className="bg-blue-500 p-2 text-white ms-auto rounded-lg"
					>
						Simpan Kata Sandi
					</button>
				</form>
			</div>
			<div className="card mt-3 flex flex-col gap-3">
				<h1 className="font-medium italic">Akun</h1>
				<hr />
				<button
					type="button"
					onClick={() => signOut()}
					className="bg-red-500 p-2 text-white ms-auto rounded-lg"
				>
					Keluar
				</button>
			</div>
		</>
	);
}
