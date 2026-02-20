import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const postUser = (data) => axios.post(API_URL, data);
export const getUsers = () => axios.get(API_URL);
