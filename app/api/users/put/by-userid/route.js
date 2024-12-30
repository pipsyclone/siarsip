import prisma from "@/utils/prisma";
import md5 from "md5";
import { NextResponse } from "next/server";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { type, userid, name, confirmPassword } = body;

		if (type === "update-password") {
			await prisma.users.update({
				where: { userid },
				data: {
					password: md5(confirmPassword),
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil mengubah kata sandi!",
			});
		}

		await prisma.users.update({
			where: { userid },
			data: {
				name,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil mengubah data profile!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
