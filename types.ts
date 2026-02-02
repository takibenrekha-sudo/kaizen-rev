export interface UserData {
  nom: string;
  prenom: string;
  email: string;
}

export interface CheckUserResponse {
  exists: boolean;
}

export interface SendReceiptResponse {
  success: boolean;
  message: string;
}

export type RegistrationStatus = 'PENDING' | 'VALIDATED' | 'FREE_ACCESS';

export interface Registration {
  id: string;
  user: UserData;
  date: string;
  status: RegistrationStatus;
  receiptUrl?: string; // Mocked URL for the file
}

export enum AppStep {
  FORM = 'FORM',
  CHECKING = 'CHECKING',
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND', // Shows payment form
  UPLOADING = 'UPLOADING',
  RECEIPT_SENT = 'RECEIPT_SENT',
  ADMIN_LOGIN = 'ADMIN_LOGIN', // New Step for login
  ADMIN = 'ADMIN',
  ERROR = 'ERROR'
}

export const SESSION_DATE = "15 février 2025 à 8h00";
export const FACEBOOK_LINK = "https://facebook.com/mapage";