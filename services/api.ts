import {
  CheckUserResponse,
  SendReceiptResponse,
  UserData,
  Registration,
} from "../types";

// Sur le VPS, si le front et le back sont sur le même domaine, on peut utiliser des chemins relatifs
// Sinon, mettre l'URL complète (ex: https://revision.kaizen.com/api)
const API_URL = (import.meta as any).env?.VITE_API_URL || "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const checkUser = async (email: string): Promise<CheckUserResponse> => {
  try {
    const response = await fetch(`${API_URL}/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Erreur réseau");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const sendReceipt = async (
  userData: UserData,
  file: File,
): Promise<SendReceiptResponse> => {
  const formData = new FormData();
  formData.append("nom", userData.nom);
  formData.append("prenom", userData.prenom);
  formData.append("email", userData.email);
  formData.append("receipt", file);

  try {
    const response = await fetch(`${API_URL}/send-receipt`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'upload");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login Error", error);
    return false;
  }
};

export const getRegistrations = async (): Promise<Registration[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/registrations`, {
      headers: { ...getAuthHeader() },
    });

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.reload();
      return [];
    }

    if (!response.ok) throw new Error("Erreur chargement données");
    const data = await response.json();

    // Pour les uploads locaux, on reconstruit l'URL si elle n'est pas absolue
    return data.map((r: any) => {
      let finalUrl = r.receiptUrl;
      if (r.receiptUrl && !r.receiptUrl.startsWith("http")) {
        // Supposons que l'API est servie sous /api, les uploads sont sous /uploads à la racine du serveur Node
        // Si on utilise Nginx reverse proxy sur /api -> localhost:5000,
        // il faut aussi proxy pass /uploads -> localhost:5000/uploads
        finalUrl = `/uploads/${r.receiptUrl}`;
      }
      return {
        ...r,
        receiptUrl: finalUrl,
      };
    });
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const validateRegistration = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/validate/${id}`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    return response.ok;
  } catch (error) {
    console.error("API Error:", error);
    return false;
  }
};
