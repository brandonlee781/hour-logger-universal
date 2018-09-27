export interface AuthResponse {
  expires?: number;
  expiresAt?: string;
  token: string;
}

export interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected?: boolean;
  path?: string;
  route?: string;
}
