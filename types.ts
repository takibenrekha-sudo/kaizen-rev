export interface UserData {
  nom?: string;
  prenom?: string;
  email: string;
}

export type RegistrationStatus = "PENDING" | "VALIDATED" | "FREE_ACCESS";

export interface CheckUserResponse {
  exists: boolean;
  status?: RegistrationStatus;
  userData?: UserData;
}

export interface SendReceiptResponse {
  success: boolean;
  message: string;
}

export type RegistrationType = "CCP" | "KAIZEN";

export interface Registration {
  id: string;
  user: UserData;
  date: string;
  status: RegistrationStatus;
  type?: RegistrationType; // Nouveau champ
  receiptUrl?: string; // Mocked URL for the file
}

export enum AppStep {
  FORM = "FORM",
  CHECKING = "CHECKING",
  FOUND = "FOUND",
  NOT_FOUND = "NOT_FOUND", // Shows payment/proof form
  UPLOADING = "UPLOADING",
  RECEIPT_SENT = "RECEIPT_SENT",
  ADMIN_LOGIN = "ADMIN_LOGIN", // New Step for login
  ADMIN = "ADMIN",
  ERROR = "ERROR",
}

export const SESSION_DATE = "Du 1er au 15 Mars 2025";
