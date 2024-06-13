import { Configuration } from "./configuration";
import { Role } from "./role";

export interface User {
  idUser: string;
  userName: string;
  password: string;
  email: string;
  enable: boolean;
  adresse: string;
  roles?: Role[];
  configurations: Configuration[];
}
