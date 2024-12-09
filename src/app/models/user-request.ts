import { Role } from "./role";

export interface UserRequest {
  userName: string;
  email: string;
  role: string[];
}
