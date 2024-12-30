import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
	const token = await getToken({ req: request });
	const pathname = request.nextUrl.pathname;

	if (!token && pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (token) {
		if (pathname.startsWith("/login")) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		if (token.role === "ADMIN") {
			if (
				pathname.startsWith("/dashboard/letter-in") ||
				pathname.startsWith("/dashboard/letter-out")
			) {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}
		}
		if (token.role === "USER") {
			if (
				pathname.startsWith("/dashboard/users") ||
				pathname.startsWith("/dashboard/register")
			) {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}
		}
	}
}

// Tentukan rute halaman yang diproteksi
export const config = {
	matcher: ["/login", "/dashboard/:path*"],
};
