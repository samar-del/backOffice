import { Permission } from "./permission";

export class Role {
  idRole?: string;
  roleType?: string;
  permissions?: Permission[]; // Ajoutez une liste de permissions
}
