const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/mainController");

// Configuration du stockage local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Le dossier doit exister (créé dans server.js)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Format de fichier non supporté (JPG, PNG, PDF uniquement)"),
      );
    }
  },
});

// Middleware Auth Admin
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Récupération et nettoyage strict
  let envPass = process.env.ADMIN_PASSWORD;
  const ADMIN_PASS = envPass
    ? envPass
        .toString()
        .trim()
        .replace(/^['"]|['"]$/g, "")
    : null;

  if (!ADMIN_PASS) {
    console.error(
      "ERREUR DE SÉCURITÉ : Tentative d'accès admin sans mot de passe configuré dans le .env",
    );
    return res
      .status(500)
      .json({
        message: "Erreur configuration serveur : Mot de passe non défini",
      });
  }

  const expectedToken = Buffer.from(`admin:${ADMIN_PASS}`).toString("base64");

  if (authHeader && authHeader === `Bearer ${expectedToken}`) {
    next();
  } else {
    res.status(401).json({ message: "Non autorisé" });
  }
};

// Routes publiques
router.post("/check-user", controller.checkUser);
router.post("/send-receipt", upload.single("receipt"), controller.sendReceipt);
router.get("/settings", controller.getSettings); // Récupérer le lien meet

// Routes Admin
router.post("/admin/login", controller.adminLogin);
router.get("/admin/registrations", requireAuth, controller.getRegistrations);
router.post(
  "/admin/validate/:id",
  requireAuth,
  controller.validateRegistration,
);
router.post("/admin/settings", requireAuth, controller.updateSettings); // Modifier le lien meet

module.exports = router;
