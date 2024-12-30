"use client";
import { getUsers } from "@/utils/custom-swr";
import DataLists from "../ui/datatable";
import { mutate } from "swr";
import axios from "axios";
import Scripts from "@/utils/scripts";

export default function Users() {
	const { users } = getUsers();
	const { toastAlert } = Scripts();

	const handleDelete = async (userid) => {
		await axios
			.delete("/api/users/delete/by-userid?userid=" + userid)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert(
						"success",
						"Berhasil hapus!",
						"Penghapusan data pengguna berhasil!",
						3000
					);
					mutate("/api/users/get/all");
				}
			});
	};

	return (
		<>
			<div className="card mt-3">
				<DataLists
					tableName="Data Pengguna"
					subHeaderMemo={true}
					data={users}
					filterFields={["name"]}
					tableOptions={{
						paginator: true,
						rows: 10,
						rowsPerPageOptions: [10, 20, 50, 100],
					}}
					columns={[
						{ field: "userid", header: "ID" },
						{ field: "name", header: "Nama Pengguna" },
						{ field: "role", header: "Tingkatan" },
						{
							field: "actions",
							header: "Aksi",
							body: (rowData) => (
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => handleDelete(rowData.userid)}
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
