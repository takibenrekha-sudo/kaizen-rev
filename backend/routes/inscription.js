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
    // Nettoyage du nom de fichier + Timestamp pour éviter les doublons
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
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = Buffer.from(`admin:${ADMIN_PASS}`).toString("base64");

  if (authHeader && authHeader === `Bearer ${expectedToken}`) {
    next();
  } else {
    res.status(401).json({ message: "Non autorisé" });
  }
};

// Routes
router.post("/check-user", controller.checkUser);
router.post("/send-receipt", upload.single("receipt"), controller.sendReceipt);
router.post("/admin/login", controller.adminLogin);

router.get("/admin/registrations", requireAuth, controller.getRegistrations);
router.post(
  "/admin/validate/:id",
  requireAuth,
  controller.validateRegistration,
);

module.exports = router;
