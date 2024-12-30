import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.users.findMany({
			where: {
				role: { contains: "USER" },
			},
		});

		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
