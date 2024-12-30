import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";

export async function POST(request) {
	const formData = await request.formData();
	const userid = formData.get("userid");
	const name = formData.get("name");
	const filename = formData.get("filename");
	const filedate = formData.get("filedate");
	const formfile = formData.get("file");
	const filetype = formData.get("filetype");

	try {
		if (!CONFIG.ALLOWED_FILE_TYPE.includes(formfile.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tidak diizinkan, hanya PDF, DOC, DOCX, XLS, XLSX!",
				tipe: formfile.type,
			});
		} else if (formfile.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file terlalu besar, tidak boleh lebih dari 10MB!",
			});
		}

		if (!fs.existsSync(CONFIG.DIRECTORY)) {
			fs.mkdirSync(CONFIG.DIRECTORY);
		}

		const buffer = Buffer.from(await formfile.arrayBuffer());
		const originalFilename = formfile.name;
		const extension = originalFilename.substring(
			originalFilename.lastIndexOf(".")
		);
		const file = Date.now() + extension;

		await writeFile(
			path.join(process.cwd(), CONFIG.DIRECTORY + file),
			buffer
		);

		await prisma.files.create({
			data: {
				userid,
				sendername: name,
				sendingdate: filedate,
				filename,
				file,
				filesize: formfile.size,
				filetype,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menambahkan berkas!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
