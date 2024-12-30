import prisma from "@/utils/prisma";
import md5 from "md5";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const body = await request.json();
		const { name, username, confirmPassword, role } = body;

		const checkIdentifier = await prisma.users.findFirst({
			where: { username },
		});

		if (checkIdentifier) {
			return NextResponse.json({
				status: 203,
				title: "Error Register!",
				message: "Username sudah digunakan!",
			});
		}

		await prisma.users.create({
			data: { name, username, password: md5(confirmPassword), role },
		});

		return NextResponse.json({
			status: 200,
			title: "Register Success!",
			message: "Berhasil membuat akun!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
