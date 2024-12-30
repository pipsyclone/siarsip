import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");

		if (!userid) {
			return NextResponse.json({
				status: 400,
				message: "Parameter 'userid' tidak ditemukan.",
			});
		}

		await prisma.users.delete({
			where: { userid },
		});

		// Ambil semua file terkait pengguna
		const files = await prisma.files.findMany({
			where: { userid },
		});

		console.log("File yang ditemukan untuk userid:", files);

		// Hapus file dari sistem menggunakan `for...of`
		for (const data of files) {
			const absolutePath = path.join(
				process.cwd(),
				"public/files/",
				data.filename
			);
			console.log("Menghapus file:", absolutePath);
			try {
				await fs.access(absolutePath); // Periksa apakah file ada
				await fs.unlink(absolutePath); // Hapus file
				console.log(`Berhasil menghapus file: ${data.filename}`);
			} catch (err) {
				if (err.code === "ENOENT") {
					console.warn(`File tidak ditemukan: ${absolutePath}`);
				} else {
					console.error(`Gagal menghapus file: ${data.filename}`, err.message);
				}
			}
		}
		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus berkas!",
			files,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
