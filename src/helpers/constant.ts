import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'USER',
  PAGE = 'PAGE',
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

export enum JourneyType {
  WORK = 'WORK',
  EDUCATION = 'EDUCATION',
}

export enum ProfileImageType {
  PROFILE = 'PROFILE',
  COVER = 'COVER',
}

export enum RespondAction {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum RelationshipType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  LIKE = 'LIKE',
  BLOCKED = 'BLOCKED',
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

registerEnumType(UserRole, {
  name: 'UserRole',
});
registerEnumType(RelationshipType, {
  name: 'RelationshipType',
});
registerEnumType(RespondAction, {
  name: 'RespondAction',
});
registerEnumType(ProfileImageType, {
  name: 'ProfileImageType',
});
registerEnumType(JourneyType, {
  name: 'JourneyType',
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
