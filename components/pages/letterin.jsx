"use client";
import axios from "axios";
import { getLetterByUserid, getUsers } from "@/utils/custom-swr";
import DataLists from "../ui/datatable";
import { mutate } from "swr";
import { useSession } from "next-auth/react";
import Scripts from "@/utils/scripts";

export default function LetterOut() {
	const { data: session } = useSession();
	const { toastAlert, formatBytes } = Scripts();
	const { letterin } = getLetterByUserid(session?.user?.userid);

	// Transformasi data untuk menambahkan ukuran berkas yang diformat
	const formattedLetterIn =
		letterin?.map((item) => ({
			...item,
			filesizeFormatted: formatBytes(item.filesize),
		})) || [];

	const handleDelete = async (fileid, file) => {
		await axios
			.delete("/api/files/delete/by-fileid?fileid=" + fileid + "&file=" + file)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert(
						"success",
						"Berhasil hapus!",
						"Penghapus data pengguna berhasil!",
						3000
					);
				}
				mutate("/api/files/get/all");
			});
	};

	return (
		<>
			<div className="card mt-3">
				<DataLists
					tableName="Data Berkas Surat Masuk"
					subHeaderMemo={true}
					data={formattedLetterIn}
					filterFields={["sendername", "filename"]}
					tableOptions={{
						paginator: true,
						rows: 10,
						rowsPerPageOptions: [10, 20, 50, 100],
					}}
					columns={[
						{ field: "sendername", header: "Nama Pengirim" },
						{ field: "sendingdate", header: "Tanggal Masuk / Keluar" },
						{ field: "filename", header: "Nama Berkas" },
						{ field: "file", header: "Berkas" },
						{ field: "filesizeFormatted", header: "Ukuran Berkas" },
						{
							field: "filetype", header: "Tipe",
							body: (rowData) => (
								<>
									{
										rowData.filetype === "LETTERIN" ?
											<i className="fa-regular fa-circle-down text-green-500"></i>
											:
											""
									}
								</>
							)
						},
						{
							field: "actions",
							header: "Aksi",
							body: (rowData) => (
								<div className="flex gap-3">
									<a
										href={"/files/" + rowData.file}
										target="_blank"
										className={"p-2 bg-blue-500 rounded-lg text-white text-sm"}
									>
										Lihat
									</a>
									<button
										type="button"
										onClick={() =>
											handleDelete(rowData.fileid, rowData.file)
										}
										className={"p-2 bg-red-500 rounded-lg text-white text-sm"}
									>
										Hapus
									</button>
								</div>
							),
						},
					]}
				/>
			</div>
		</>
	);
}
