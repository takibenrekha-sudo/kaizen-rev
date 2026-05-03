import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import InscriptionForm from "./components/InscriptionForm";
import PaymentForm from "./components/PaymentForm";
import SuccessMessage from "./components/SuccessMessage";
import ReceiptSentMessage from "./components/ReceiptSentMessage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import { AppStep, UserData, RegistrationType } from "./types";
import * as api from "./services/api";

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // URL Detection for Admin Mode
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      if (path === "/admin" || hash === "#admin" || search.includes("admin")) {
        setStep(AppStep.ADMIN_LOGIN);
      }
    };

    checkAdminRoute();
    window.addEventListener("hashchange", checkAdminRoute);
    return () => window.removeEventListener("hashchange", checkAdminRoute);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleHomeClick = () => {
    setStep(AppStep.FORM);
    setUserData(null);
    if (window.history.pushState) {
      window.history.pushState(
        {},
        "",
        window.location.pathname.replace("/admin", "/"),
      );
    }
  };

  const handleUserSubmit = async (data: UserData) => {
    // On met temporairement l'email entré par l'utilisateur
    setUserData(data);
    setIsLoading(true);
    setStep(AppStep.CHECKING);

    try {
      // APPEL AU BACKEND : C'est lui qui décide
      const response = await api.checkUser(data.email);
      setIsLoading(false);

      if (response.exists) {
        // IMPORTANT : On met à jour les données locales avec celles du backend (source de vérité)
        if (response.userData) {
          setUserData(response.userData);
        }

        // On dirige selon le statut retourné par le backend
        if (response.status === "PENDING") {
          // Statut en attente -> On montre l'écran d'attente (pas de nouvelle inscription)
          setStep(AppStep.RECEIPT_SENT);
        } else {
          // Statut validé (VALIDATED ou FREE_ACCESS) -> On montre l'accès
          setStep(AppStep.FOUND);
        }
      } else {
        // L'utilisateur n'existe pas dans le backend -> On permet l'inscription/paiement
        setStep(AppStep.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error checking user", error);
      setIsLoading(false);
      setStep(AppStep.FORM);
      alert(
        "Une erreur est survenue lors de la vérification. Veuillez réessayer.",
      );
    }
  };

  const handleReceiptSubmit = async (file: File, type: RegistrationType) => {
    if (!userData) return;

    setIsLoading(true);
    setStep(AppStep.UPLOADING);

    try {
      await api.sendReceipt(userData, file, type);
      setStep(AppStep.RECEIPT_SENT);
    } catch (error: any) {
      console.error("Error sending receipt", error);
      alert(error.message || "Erreur lors de l'envoi du reçu.");
      setStep(AppStep.NOT_FOUND);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLoginCancel = () => {
    setStep(AppStep.FORM);
    if (window.history.pushState) {
      window.history.pushState(
        {},
        "",
        window.location.pathname.replace("/admin", "/"),
      );
    }
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.ADMIN_LOGIN:
        return (
          <AdminLogin
            onLogin={() => setStep(AppStep.ADMIN)}
            onCancel={handleAdminLoginCancel}
          />
        );

      case AppStep.ADMIN:
        return <AdminDashboard />;

      case AppStep.FORM:
      case AppStep.CHECKING:
        return (
          <div className="w-full transition-all duration-500 ease-in-out">
            <InscriptionForm
              onSubmit={handleUserSubmit}
              isLoading={isLoading}
            />
          </div>
        );

      case AppStep.FOUND:
        return userData ? <SuccessMessage userData={userData} /> : null;

      case AppStep.NOT_FOUND:
      case AppStep.UPLOADING:
        return userData ? (
          <PaymentForm
            userData={userData}
            onSubmit={handleReceiptSubmit}
            isLoading={isLoading}
            onBack={() => setStep(AppStep.FORM)}
          />
        ) : null;

      case AppStep.RECEIPT_SENT:
        // C'est ici qu'on arrive si status === 'PENDING'
        return userData ? <ReceiptSentMessage userData={userData} /> : null;

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950`}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onHomeClick={handleHomeClick}
        isAdminMode={step === AppStep.ADMIN || step === AppStep.ADMIN_LOGIN}
      />

      <main className="flex-grow relative container mx-auto px-4 py-8 md:py-12 flex items-start justify-center z-10">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/20 dark:bg-primary-900/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[100px]" />
        </div>

        {renderContent()}
      </main>

      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© 2025 Système de Révision. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
