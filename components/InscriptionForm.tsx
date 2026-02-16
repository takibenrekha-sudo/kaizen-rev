import React, { useState } from "react";
import { UserData } from "../types";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const InscriptionForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 p-8 max-w-md w-full mx-auto border border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Inscription
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Entrez votre email pour accéder à la séance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1"
          >
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500"} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none transition-all`}
              placeholder="exemple@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium ml-1">
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`group w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 dark:from-primary-600 dark:to-blue-700 dark:hover:from-primary-500 dark:hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform active:scale-[0.98] ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Vérification...
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InscriptionForm;
