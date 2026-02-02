const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Sur un VPS avec Nginx, CORS est moins strict si configuré en proxy, mais on le laisse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés publiquement (les reçus)
// L'URL sera: http://votre-site.com/uploads/nom-du-fichier.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Vérification des dossiers et fichiers de données
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
});
