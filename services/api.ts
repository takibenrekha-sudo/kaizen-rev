import {
  CheckUserResponse,
  SendReceiptResponse,
  UserData,
  Registration,
  RegistrationType,
} from "../types";

// Sur le VPS, si le front et le back sont sur le même domaine, on peut utiliser des chemins relatifs
// Sinon, mettre l'URL complète (ex: https://revision.kaizen.com/api)
const API_URL = (import.meta as any).env?.VITE_API_URL || "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper pour éviter les crashs sur JSON.parse
const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("Erreur parsing JSON:", text.substring(0, 100)); // Log le début de la réponse pour debug
    throw new Error(`Réponse serveur invalide (${response.status})`);
  }
};

export const checkUser = async (email: string): Promise<CheckUserResponse> => {
  try {
    const response = await fetch(`${API_URL}/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Erreur réseau");
    return await safeJson(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const sendReceipt = async (
  userData: UserData,
  file: File,
  type: RegistrationType,
): Promise<SendReceiptResponse> => {
  const formData = new FormData();
  if (userData.nom) formData.append("nom", userData.nom);
  if (userData.prenom) formData.append("prenom", userData.prenom);
  formData.append("email", userData.email);
  formData.append("type", type);
  formData.append("receipt", file);

  try {
    const response = await fetch(`${API_URL}/send-receipt`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await safeJson(response);
      throw new Error(errorData.message || "Erreur lors de l'upload");
    }

    return await safeJson(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const loginAdmin = async (
  password: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log("Tentative de connexion vers:", `${API_URL}/admin/login`);
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    // Utilisation de safeJson pour éviter le crash "Uncaught SyntaxError"
    const data = await safeJson(response);

    if (response.ok && data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
      return { success: true };
    }

    return {
      success: false,
      message:
        data.message || `Erreur ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    console.error("Login Error Catch:", error);
    return {
      success: false,
      message: "Erreur de connexion (Backend inaccessible ?)",
    };
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
    const data = await safeJson(response);

    if (!Array.isArray(data)) return [];

    // Pour les uploads locaux, on reconstruit l'URL si elle n'est pas absolue
    return data.map((r: any) => {
      let finalUrl = r.receiptUrl;
      if (r.receiptUrl && !r.receiptUrl.startsWith("http")) {
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

export const getMeetLink = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) return "";
    const data = await safeJson(response);
    return data.meetLink || "";
  } catch (error) {
    console.error("API Error settings", error);
    return "";
  }
};

export const updateMeetLink = async (link: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ meetLink: link }),
    });
    return response.ok;
  } catch (error) {
    console.error("API Error settings update", error);
    return false;
  }
};
