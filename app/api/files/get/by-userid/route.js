import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		const data = await prisma.files.findMany({
			where: { userid },
		});
		const letterIn = await prisma.files.findMany({
			where: { userid, filetype: { contains: "LETTERIN" } },
		});
		const letterOut = await prisma.files.findMany({
			where: { userid, filetype: { contains: "LETTEROUT" } },
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
			data,
			letterin: letterIn,
			letterout: letterOut,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
