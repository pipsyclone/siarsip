const { PrismaClient } = require("@prisma/client");
const md5 = require("md5");

const prisma = new PrismaClient();

async function main() {
	await prisma.users.upsert({
		where: { username: "admin" },
		update: {},
		create: {
			name: "Admin",
			username: "admin",
			password: md5("admin123"),
			role: "ADMIN",
		},
	});
	await prisma.users.upsert({
		where: { username: "user1" },
		update: {},
		create: {
			name: "User 1",
			username: "user1",
			password: md5("user123"),
			role: "USER",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
