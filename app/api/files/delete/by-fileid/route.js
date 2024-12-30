import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(request) {
	try {
		const fileid = request.nextUrl.searchParams.get("fileid");
		const file = request.nextUrl.searchParams.get("file");

		await prisma.files.delete({
			where: { fileid },
		});

		const absolutePath = path.join(process.cwd(), "public/files/", file);
		fs.unlinkSync(absolutePath);

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus berkas!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
