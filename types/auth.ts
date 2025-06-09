export interface PasswordResetToken {
  id: number;
  id_cliente_fk: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}
