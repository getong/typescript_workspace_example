import axios from "axios";

export interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const getPosts = () => axios.get<Post[]>(API_URL);
export const getPostById = (id: number) => axios.get<Post>(`${API_URL}/${id}`);
export const createPost = (post: Omit<Post, "id">) =>
  axios.post<Post>(API_URL, post);
export const updatePost = (id: number, post: Partial<Post>) =>
  axios.put<Post>(`${API_URL}/${id}`, post);
export const deletePost = (id: number) => axios.delete(`${API_URL}/${id}`);
