import { Role } from "./role";

export class Permission{
  idPermission?: string;
  permissionType?: string;
  permissionName?: string;
  roles?: Role[];
}
