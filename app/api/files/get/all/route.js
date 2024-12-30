import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.files.findMany();
		const filesize = await prisma.files.findMany({
			select: {
				filesize: true,
			},
		});
		const totalsize = filesize.reduce(
			(total, file) => total + parseInt(file.filesize, 10),
			0
		);

		return NextResponse.json({ status: 200, message: "OK", data, totalsize });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
