"use client";
import { getLetters } from "@/utils/custom-swr";
import DataLists from "../ui/datatable";
import CardMonitoring from "../ui/monitoring-card";
import { useSession } from "next-auth/react";
import Scripts from "@/utils/scripts";
import { useState } from "react";
import axios from "axios";

export default function Home() {
	const { data: session } = useSession();
	const { formatBytes } = Scripts();
	const { letters, lettersSize } = getLetters();

	const { toastAlert } = Scripts();
	const [isLoading, setIsLoading] = useState(false);

	const [progress, setProgress] = useState(0);
	const [userid] = useState(session?.user?.userid);
	const [name, setName] = useState("");
	const [filename, setFilename] = useState("");
	const [fileDate, setFileDate] = useState(new Date().toISOString().split("T")[0]);
	const [file, setFile] = useState("");
	const [fileType, setFileType] = useState("");

	const formattedLetters =
		letters?.map((item) => ({
			...item,
			filesizeFormatted: formatBytes(item.filesize),
		})) || [];

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFile(file);
		}
	};

	const handleInputFile = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("userid", userid);
		formData.append("name", name);
		formData.append("filename", filename);
		formData.append("filedate", fileDate);
		formData.append("file", file);
		formData.append("filetype", fileType);

		setIsLoading(true);
		if (name === "" || fileType === "") {
			toastAlert(
				"error",
				"Formulir Error!",
				"Masih ada formulir yang kosong!",
				5000
			);
			setIsLoading(false);
		} else if (file === null) {
			toastAlert("error", "File Error!", "Berkas masih kosong!", 3000);
			setIsLoading(false);
		} else {
			await axios
				.post("/api/files/post/store-file", formData, {
					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setProgress(percentCompleted);
					},
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", res.data.title, res.data.message, 3000);
						setName("");
						setFilename("")
						setFileDate(new Date().toISOString().split("T")[0])
						setFile("");
						setFileType("");
						setIsLoading(false);
					} else {
						toastAlert("error", res.data.title, res.data.message, 3000);
						setIsLoading(false);
					}
					console.log(res.data);
				});
		}
	};

	return (
		<>
			{session && session.user.role === "ADMIN" ? (
				<div>
					<div className="flex flex-col md:flex-row gap-3">
						<CardMonitoring
							title={"Jumlah Berkas"}
							className="border-blue-500 basis-1/2"
							content={letters?.length}
							footer={"Jumlah berkas terupload : " + letters?.length}
						/>
						<CardMonitoring
							title={"Total Ukuran Berkas"}
							className="border-indigo-500 basis-1/2"
							content={formatBytes(lettersSize)}
							footer={
								"Total ukuran berkas terupload : " + formatBytes(lettersSize)
							}
						/>
					</div>

					<div className="card mt-3">
						<DataLists
							tableName="Data Berkas"
							subHeaderMemo={true}
							data={formattedLetters}
							filterFields={["name", "filename"]}
							tableOptions={{
								rows: 10,
							}}
							columns={[
								{ field: "filename", header: "Nama Berkas" },
								{ field: "sendername", header: "Nama Pengirim" },
								{ field: "sendingdate", header: "Tanggal Diterima / Dikirim" },
								{ field: "filesizeFormatted", header: "Ukuran Berkas" },
								{ field: "filetype", header: "Tipe" },
								{
									field: "actions",
									header: "Aksi",
									body: (rowData) => (
										<div className="flex gap-3">
											<a
												href={"/files/" + rowData.filename}
												target="_blank"
												className={
													"p-2 bg-blue-500 rounded-lg text-white text-sm"
												}
											>
												Lihat
											</a>
										</div>
									),
								},
							]}
						/>
					</div>
				</div>
			) : (
				<>
					{/* Loading Bar */}
					{isLoading && (
						<div className="mx-auto mb-3 flex flex-col gap-1 w-[700px]">
							<div>
								<i className="fa-solid fa-spinner animate-spin"></i>{" "}
								Mengunggah...
							</div>
							<div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
								<div
									className="bg-blue-600 h-2.5 rounded-full transition-all"
									style={{ width: `${progress}%` }}
								>{progress}%</div>
							</div>
						</div>
					)}

					<div className="card flex flex-col gap-3 w-[700px] mx-auto">
						<h1 className="font-medium text-xl">Masukkan Berkas</h1>
						<hr />
						<form onSubmit={handleInputFile} className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label>Masukkan Nama Pengirim</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-3">
								<div className="flex flex-col gap-1 basis-1/2">
									<label>Masukkan Nama Berkas</label>
									<input
										type="text"
										placeholder="Masukkan Nama Berkas"
										onChange={(e) => setFilename(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-1 basis-1/2">
									<label>Masukkan Berkas</label>
									<input
										type="file"
										accept=".pdf, .doc, .docx, .xls, .xlsx"
										onChange={handleFileChange}
									/>
								</div>
							</div>
							<div className="flex flex-col md:flex-row gap-3">
								<div className="flex flex-col gap-1 basis-1/2">
									<label>Tanggal Berkas Masuk / Keluar</label>
									<input
										type="date"
										value={fileDate}
										onChange={(e) => setFileDate(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-1 basis-1/2">
									<label>Pilih Tipe Berkas</label>
									<select
										value={fileType}
										onChange={(e) => setFileType(e.target.value)}
									>
										<option value={""}>- Pilih Tipe Berkas -</option>
										<option value={"LETTERIN"}>Surat Masuk</option>
										<option value={"LETTEROUT"}>Surat Keluar</option>
									</select>
								</div>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className={`mt-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-400"
									}`}
							>
								{isLoading ? "Mengunggah..." : "Unggah"}
							</button>
						</form>
					</div>
				</>
			)}
		</>
	);
}
