import { Role } from "./role";

export interface UserRequest {
  userName: string;
  password: string;
  email: string;
  role: string[];
}
