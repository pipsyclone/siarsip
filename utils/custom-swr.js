import axios from "axios";
import useSWR from "swr";

const fetcher = async (url) => await axios.get(url).then((res) => res.data);

export function getLetters() {
	const { data, error, isLoading } = useSWR("/api/files/get/all", fetcher);

	return {
		letters: data?.data,
		lettersSize: data?.totalsize,
		lettersError: error,
		lettersLoading: isLoading,
	};
}
export function getLetterByUserid(userid) {
	const { data, error, isLoading } = useSWR(
		"/api/files/get/by-userid?userid=" + userid,
		fetcher
	);

	return {
		letter: data?.data || [],
		letterin: data?.letterin || [],
		letterout: data?.letterout || [],
		letterError: error,
		letterLoading: isLoading,
	};
}

export function getUsers() {
	const { data, error, isLoading } = useSWR("/api/users/get/all", fetcher);

	return {
		users: data?.data,
		usersError: error,
		usersLoading: isLoading,
	};
}

export function getUserByUserid(userid) {
	const { data, error, isLoading } = useSWR(
		"/api/users/get/by-userid?userid=" + userid,
		fetcher
	);

	return {
		user: data?.data,
		userError: error,
		userLoading: isLoading,
	};
}
