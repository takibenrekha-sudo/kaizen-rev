const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// --- HELPER FUNCTIONS ---
const readJSON = (file) => {
  try {
    let defaultData = [];
    if (file.includes("users")) defaultData = { users: [] };
    if (file.includes("settings")) defaultData = { meetLink: "" };

    if (!fs.existsSync(file)) return defaultData;
    const data = fs.readFileSync(file, "utf8");
    return data ? JSON.parse(data) : defaultData;
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return file.includes("users")
      ? { users: [] }
      : file.includes("settings")
        ? { meetLink: "" }
        : [];
  }
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
};

// --- CONTROLLERS ---

exports.adminLogin = (req, res) => {
  const { password } = req.body;
  let envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword) {
    envPassword = envPassword
      .toString()
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }
  const inputPassword = password ? password.toString().trim() : "";

  if (!envPassword) {
    return res
      .status(500)
      .json({ success: false, message: "Erreur config serveur" });
  }

  if (inputPassword === envPassword) {
    const token = Buffer.from(`admin:${envPassword}`).toString("base64");
    return res.json({ success: true, token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Mot de passe incorrect" });
  }
};

exports.getSettings = (req, res) => {
  const settings = readJSON(SETTINGS_FILE);
  res.json(settings);
};

exports.updateSettings = (req, res) => {
  const { meetLink } = req.body;
  const settings = { meetLink: meetLink || "" };
  writeJSON(SETTINGS_FILE, settings);
  res.json({ success: true, settings });
};

exports.checkUser = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  const emailNormalized = email.toLowerCase().trim();

  // 1. D'abord, on vérifie si l'utilisateur a une inscription en cours ou passée dans registrations.json
  // C'est la source de vérité pour le statut "PENDING"
  const registrations = readJSON(REGISTRATIONS_FILE);

  // On récupère la dernière inscription en date
  const lastRegistration = registrations
    .filter(
      (r) =>
        r.user &&
        r.user.email &&
        r.user.email.toLowerCase().trim() === emailNormalized,
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (lastRegistration) {
    // Si trouvé dans les inscriptions, on retourne ce statut (PENDING, VALIDATED, etc.)
    return res.json({
      exists: true,
      status: lastRegistration.status,
      userData: lastRegistration.user,
    });
  }

  // 2. Ensuite (Fallback), on vérifie la whitelist historique (users.json)
  // Utile pour les utilisateurs ajoutés manuellement ou avant le système d'inscription
  const usersData = readJSON(USERS_FILE);
  const whitelistUsers = usersData.users || [];
  const whitelistUser = whitelistUsers.find(
    (u) => u.email.toLowerCase().trim() === emailNormalized,
  );

  if (whitelistUser) {
    return res.json({
      exists: true,
      status: "VALIDATED", // Par défaut, s'il est dans la whitelist, il est validé
      userData: whitelistUser,
    });
  }

  // 3. Si introuvable nulle part
  return res.json({ exists: false });
};

exports.sendReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const { nom, prenom, email, type } = req.body;

    const newRegistration = {
      id: Date.now().toString(),
      user: {
        nom: nom || "",
        prenom: prenom || "",
        email,
      },
      date: new Date().toISOString(),
      status: "PENDING",
      type: type || "CCP",
      receiptUrl: req.file.filename,
    };

    const registrations = readJSON(REGISTRATIONS_FILE);
    registrations.push(newRegistration);
    writeJSON(REGISTRATIONS_FILE, registrations);

    await sendAdminNotification(newRegistration, req.file.path);

    res.json({ success: true, message: "Reçu envoyé avec succès" });
  } catch (error) {
    console.error("Receipt Error:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'envoi" });
  }
};

exports.getRegistrations = (req, res) => {
  const registrations = readJSON(REGISTRATIONS_FILE);
  registrations.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(registrations);
};

exports.validateRegistration = (req, res) => {
  const { id } = req.params;
  const registrations = readJSON(REGISTRATIONS_FILE);

  const index = registrations.findIndex((r) => r.id === id);
  if (index !== -1) {
    registrations[index].status = "VALIDATED";
    writeJSON(REGISTRATIONS_FILE, registrations);

    // On met aussi à jour la whitelist pour la redondance
    const usersData = readJSON(USERS_FILE);
    if (!usersData.users) usersData.users = [];

    const user = registrations[index].user;
    const alreadyInWhitelist = usersData.users.find(
      (u) => u.email.toLowerCase() === user.email.toLowerCase(),
    );

    if (!alreadyInWhitelist) {
      usersData.users.push({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email,
      });
      writeJSON(USERS_FILE, usersData);
    }

    res.json({ success: true });
  } else {
    res.status(404).json({ message: "Inscription non trouvée" });
  }
};

async function sendAdminNotification(registration, filePath) {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const typeLabel =
      registration.type === "KAIZEN"
        ? "ABONNÉ KAIZEN"
        : "PAIEMENT CCP (3000 DA)";
    const userIdentity =
      registration.user.nom || registration.user.prenom
        ? `${registration.user.nom} ${registration.user.prenom}`
        : registration.user.email;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Nouvelle Inscription [${typeLabel}] - ${userIdentity}`,
      text: `Utilisateur: ${registration.user.email}\nType: ${typeLabel}\n${userIdentity !== registration.user.email ? "Nom: " + userIdentity : ""}`,
      attachments: [{ filename: registration.receiptUrl, path: filePath }],
    };
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error("Email Error:", e);
  }
}
