export type CategoryRecord = {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string | null;
  iconKey: string | null;
  sortOrder: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryCreatePayload = {
  name: string;
  type: string;
  color?: string | null;
  iconKey?: string | null;
  sortOrder?: number;
  isSystem?: boolean;
  isActive?: boolean;
};
