export const CONFIG = {
	DIRECTORY: "public/files/",
	ALLOWED_FILE_TYPE: [
		"application/pdf",
		"application/msword", // .doc
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
		"application/vnd.ms-excel", // .xls
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
	],
	MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
