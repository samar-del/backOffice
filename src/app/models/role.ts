import { Permission } from "./permission";

export class Role {
  id?: string;
  roleType?: string;
  permissions?: Permission[]; // Ajoutez une liste de permissions
}
