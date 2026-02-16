const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// --- CHARGEMENT ROBUSTE DU .ENV ---
const envPathBackend = path.join(__dirname, ".env");
const envPathRoot = path.join(__dirname, "../.env");

if (fs.existsSync(envPathBackend)) {
  dotenv.config({ path: envPathBackend });
  console.log(`✅ Configuration chargée depuis: ${envPathBackend}`);
} else if (fs.existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
  console.log(`✅ Configuration chargée depuis: ${envPathRoot}`);
} else {
  console.warn("⚠️ AUCUN FICHIER .env TROUVÉ !");
}

// --- NETTOYAGE GLOBAL DU MOT DE PASSE ---
try {
  if (process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD)
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }
} catch (e) {
  console.error("⚠️ Erreur lors du nettoyage du mot de passe:", e);
}

const app = express();
// CHANGEMENT ICI : Port 5001 par défaut pour éviter conflit avec Kaizen (5000)
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- LOGGING DES REQUÊTES ENTRANTES (DEBUG) ---
app.use((req, res, next) => {
  if (req.method === "POST" && req.url.includes("/login")) {
    console.log(`[DEBUG HTTP] Reçu POST sur ${req.url}`);
    // Ne pas logger le body complet en prod pour sécurité
    if (req.body && req.body.password) {
      console.log(
        `[DEBUG HTTP] Mot de passe reçu (longueur): ${req.body.password.length}`,
      );
    }
  }
  next();
});

// Servir les fichiers uploadés publiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Vérification des dossiers
const dataDir = path.join(__dirname, "data");
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Initialisation des fichiers JSON
const usersFile = path.join(dataDir, "users.json");
const registrationsFile = path.join(dataDir, "registrations.json");

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(
    usersFile,
    JSON.stringify(
      {
        users: [
          { nom: "Benali", prenom: "Ahmed", email: "ahmed.benali@example.com" },
          { nom: "Salhi", prenom: "Fatima", email: "fatima.salhi@example.com" },
        ],
      },
      null,
      2,
    ),
  );
}

if (!fs.existsSync(registrationsFile)) {
  fs.writeFileSync(registrationsFile, JSON.stringify([], null, 2));
}

// Routes
const apiRoutes = require("./routes/inscription");
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  const currentPass = process.env.ADMIN_PASSWORD;
  console.log("------------------------------------------------");
  if (currentPass) {
    console.log(`🔑 MOT DE PASSE ACTIF (Nettoyé) : [${currentPass}]`);
  } else {
    console.error("❌ ERREUR : ADMIN_PASSWORD manquant ou vide dans .env");
  }
  console.log("------------------------------------------------");
});
