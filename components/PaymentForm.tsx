import React, { useState } from "react";
import {
  CreditCard,
  UploadCloud,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Smartphone,
  Wallet,
  Info,
} from "lucide-react";
import { RegistrationType, UserData } from "../types";

interface Props {
  userData: UserData;
  onSubmit: (file: File, type: RegistrationType) => void;
  isLoading: boolean;
  onBack: () => void;
}

const PaymentForm: React.FC<Props> = ({
  userData,
  onSubmit,
  isLoading,
  onBack,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationType, setRegistrationType] =
    useState<RegistrationType | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError("Format non supporté. Veuillez utiliser JPG, PNG ou PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setError("Fichier trop volumineux. Max 5MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && registrationType) {
      onSubmit(selectedFile, registrationType);
    }
  };

  // ÉTAPE 1 : CHOIX DU STATUT
  if (!registrationType) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-auto animate-in fade-in zoom-in duration-300 border border-slate-100 dark:border-slate-800">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-6 flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          Votre statut
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          Veuillez sélectionner votre situation pour continuer l'inscription
          pour{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {userData.email}
          </span>
          .
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* OPTION 1 : ABONNÉ KAIZEN */}
          <button
            onClick={() => setRegistrationType("KAIZEN")}
            className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left flex flex-col items-center text-center"
          >
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Je suis abonné(e) Kaizen
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Accès via une capture d'écran de l'application.
            </p>
          </button>

          {/* OPTION 2 : NON ABONNÉ (CCP) */}
          <button
            onClick={() => setRegistrationType("CCP")}
            className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all text-left flex flex-col items-center text-center"
          >
            <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              3000 DA
            </div>
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Je ne suis pas abonné(e)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Frais d'inscription révision 3000 DA
            </p>
          </button>
        </div>
      </div>
    );
  }

  // ÉTAPE 2 : UPLOAD (L'interface change selon le type)
  const isKaizen = registrationType === "KAIZEN";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 max-w-4xl w-full mx-auto overflow-hidden animate-in slide-in-from-right duration-500 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
      {/* Panneau Gauche : Instructions */}
      <div className="md:w-5/12 bg-slate-50 dark:bg-slate-800/50 p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/50">
        <button
          onClick={() => setRegistrationType(null)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-6 flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Changer de choix
        </button>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {isKaizen ? "Preuve d'abonnement" : "Paiement requis"}
        </h2>

        {isKaizen ? (
          // INSTRUCTIONS KAIZEN
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              En tant qu'abonné Kaizen, veuillez prouver votre statut pour
              accéder à la séance.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-start">
                <Smartphone className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                    Instruction
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-400 mt-2 space-y-2 list-disc pl-4">
                    <li>
                      Ouvrez l'application <strong>Kaizen</strong>.
                    </li>
                    <li>
                      Allez sur l'<strong>écran d'accueil</strong>.
                    </li>
                    <li>
                      Faites une <strong>capture d'écran</strong> visible.
                    </li>
                    <li>Déposez l'image ici.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // INSTRUCTIONS CCP (NON ABONNÉ)
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Veuillez effectuer le virement puis uploader la preuve de
              paiement.
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <CreditCard className="w-24 h-24 text-primary-600" />
              </div>

              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase tracking-widest">
                  Montant à payer
                </span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  3000 DA
                </p>
              </div>

              <div className="space-y-4 relative z-10 border-t border-slate-100 dark:border-slate-700 pt-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase">
                    Numéro de Compte CCP
                  </span>
                  <p className="font-mono text-xl font-bold text-slate-800 dark:text-white tracking-wider">
                    0020600028
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase">
                      Clé RIB
                    </span>
                    <p className="font-mono text-lg font-bold text-slate-800 dark:text-white">
                      83
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase">
                      Titulaire
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      Benrekha Aimen Takieddine
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panneau Droite : Upload Form */}
      <div className="md:w-7/12 p-8 bg-white dark:bg-slate-900 flex flex-col justify-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          {isKaizen ? "Upload Capture d'écran" : "Upload Reçu de Paiement"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          {isKaizen
            ? "Format accepté : JPG, PNG (Image de votre téléphone)."
            : "Photo claire du reçu CCP ou capture du virement."}
        </p>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <div
            className={`flex-grow min-h-[220px] relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
                ${
                  dragActive
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
                ${selectedFile ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="receipt-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400 animate-in fade-in zoom-in duration-300">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="font-semibold text-sm break-all max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs opacity-75 mt-1 font-mono">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFile(null);
                  }}
                  className="mt-4 text-xs font-medium hover:underline text-emerald-700 dark:text-emerald-300 z-10 relative"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 transition-colors group-hover:text-primary-500 dark:group-hover:text-primary-400">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-3 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Cliquez ou déposez ici
                </p>
                <p className="text-xs mt-1 text-slate-400">
                  JPG, PNG, PDF (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg animate-pulse">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className={`mt-6 w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary-500/20
                ${
                  !selectedFile || isLoading
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 hover:shadow-primary-500/40 transform active:scale-[0.99]"
                }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Confirmer l'envoi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
