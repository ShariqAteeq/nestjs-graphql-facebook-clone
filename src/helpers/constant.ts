import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
  HR = 'HR',
  DEVELOPER = 'DEVELOPER',
  BOOTCAMPER = 'BOOTCAMPER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
}

export enum ProjectStatus {
  ON_GOING = 'ON_GOING',
  COMPLETED = 'COMPLETED',
}

export enum EmployeeType {
  DEVELOPER = 'DEVELOPER',
  HR = 'HR',
  CLEANER = 'CLEANER',
}

export enum SubsciptionEvent {
  MSG_SENT = 'MSG_SENT',
  CONVO = 'CONVO',
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum NotificationType {
  SCONVO = 'SCONVO',
}

export interface Mail {
  to: string;
  subject?: string;
  html?: string;
  text?: any;
  templateId?: string;
  templateData?: any;
}

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(EmployeeType, {
  name: 'EmployeeType',
});
