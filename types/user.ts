export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;

  email: string;

  displayName: string;

  photoURL?: string;

  role: UserRole;

  createdAt: string;

  updatedAt: string;
}
