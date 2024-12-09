import { Permission } from "./permission";

export class Role {
  id?: string;
  roleType?: string;
  permissions?: string[]; // Ajoutez une liste de permissions
}
