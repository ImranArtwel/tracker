export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  sections: Section[];
  collaboratorIds: string[];
}

export interface Section {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export enum Role {
  OWNER = 0,
  VIEWER = 1,
  EDITOR = 2,
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const DEFAULT_PROJECT_ID = "B91ZvtvPvg2GGoKixLS0";
