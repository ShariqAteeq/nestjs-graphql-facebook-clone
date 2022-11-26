import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/helpers/constant';

export const ROLES_KEY = 'role';
export const Roles = (...roles: Role[] | undefined) =>
  SetMetadata(ROLES_KEY, roles);
