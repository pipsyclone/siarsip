"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";

const Dashboard = (props) => {
	const { data: session, status } = useSession();
	const [sidebar, setSidebar] = useState(false);

	if (status === "loading") return <Loading />;

	return (
		<div className="relative w-full h-screen flex">
			<div
				className={
					sidebar
						? "block sm:hidden fixed bg-slate-700 opacity-25 w-full h-screen z-20"
						: "hidden fixed bg-slate-700 opacity-75 w-full h-screen z-20"
				}
			></div>
			<div
				className={
					sidebar
						? "ms-0 sm:ms-[-300px] fixed bg-blue-500 w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
						: "ms-[-300px] sm:ms-0 fixed bg-blue-500 w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
				}
			>
				<div className="relative flex gap-3 mb-3">
					<div className="flex flex-col text-white">
						<p>Kelurahan Desa Tonjong</p>
						<p>Majalengka</p>
					</div>
					<button
						type="button"
						className="absolute right-5 text-xl block sm:hidden"
						onClick={() => setSidebar(!sidebar)}
					>
						<i className="fa-solid fa-times"></i>
					</button>
				</div>
				<hr />
				<div className="flex flex-col gap-3 mt-3">
					<a href="/dashboard" className="tombol-sidebar-home">
						<div className="w-12 text-center">
							<i className="fa-solid fa-home"></i>
						</div>
						Beranda
					</a>

					{session?.user?.role === "ADMIN" ? (
						<>
							<a href="/dashboard/users" className="tombol-sidebar-not-home">
								<div className="w-12 text-center">
									<i className="fa-solid fa-users"></i>
								</div>
								Pengguna
							</a>
							<a href="/dashboard/register" className="tombol-sidebar-not-home">
								<div className="w-12 text-center">
									<i className="fa-solid fa-user-plus"></i>
								</div>
								Register Pengguna
							</a>
						</>
					) : (
						<>
							<a
								href="/dashboard/letter-in"
								className="tombol-sidebar-not-home"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-envelope-open-text"></i>
								</div>
								Surat Masuk
							</a>
							<a
								href="/dashboard/letter-out"
								className="tombol-sidebar-not-home"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-envelope-open"></i>
								</div>
								Surat Keluar
							</a>
						</>
					)}
				</div>
			</div>
			<div
				className={
					sidebar
						? "flex flex-col w-screen h-screen ms-0 duration-500 ease-in-out"
						: "flex flex-col w-screen h-screen ms-0 sm:ms-[300px] duration-500 ease-in-out"
				}
			>
				<nav className="bg-white text-slate-500 p-3 ps-5 pe-5 flex justify-between items-center">
					<button
						type="button"
						className="text-2xl"
						onClick={() => setSidebar(!sidebar)}
					>
						{sidebar ? (
							<i className="fa-solid fa-times"></i>
						) : (
							<i className="fa-solid fa-bars"></i>
						)}
					</button>

					<div className="flex gap-8 items-center">
						<a
							href="/dashboard/profile"
							className="flex gap-1 text-sm italic items-center"
						>
							<i className="fa-solid fa-user bg-slate-500 rounded-full p-3 text-white me-3"></i>
							Hi, {session?.user?.name}
						</a>
					</div>
				</nav>

				<div className="p-5">{props.content}</div>
				<div className="bg-white text-slate-400 italic text-sm mt-auto p-5 w-full">
					SiArsip Kelurahan Desa Tonjong Majalengka
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
