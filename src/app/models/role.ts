import { Permission } from './permission'; // Assurez-vous que le chemin est correct

export class Role {
  idRole?: string;
  roleType?: string;
  permissions?: Permission[]; // Ajoutez une liste de permissions
}
