import { Configuration } from "./configuration";
import { Role } from "./role";

export interface User {
  id: string;
  userName: string;
  password: string;
  email: string;
  enable: boolean;
  adresse: string;
  role?: string[];
  configurations: Configuration[];
  gender?: string;
}
