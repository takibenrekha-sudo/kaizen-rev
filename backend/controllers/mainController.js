const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");

// --- HELPER FUNCTIONS ---
const readJSON = (file) => {
  try {
    if (!fs.existsSync(file))
      return file.includes("users") ? { users: [] } : [];
    const data = fs.readFileSync(file, "utf8");
    return data
      ? JSON.parse(data)
      : file.includes("users")
        ? { users: [] }
        : [];
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return file.includes("users") ? { users: [] } : [];
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
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

  if (password === ADMIN_PASS) {
    const token = Buffer.from(`admin:${ADMIN_PASS}`).toString("base64");
    return res.json({ success: true, token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Mot de passe incorrect" });
  }
};

exports.checkUser = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  const usersData = readJSON(USERS_FILE);
  const whitelistUsers = usersData.users || [];

  const existingUser = whitelistUsers.find(
    (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim(),
  );

  if (existingUser) {
    // Enregistrer automatiquement comme accès gratuit si pas encore fait
    const registrations = readJSON(REGISTRATIONS_FILE);
    const alreadyRegistered = registrations.find(
      (r) => r.user.email.toLowerCase() === email.toLowerCase().trim(),
    );

    if (!alreadyRegistered) {
      const newReg = {
        id: Date.now().toString(),
        user: existingUser,
        date: new Date().toISOString(),
        status: "FREE_ACCESS",
      };
      registrations.push(newReg);
      writeJSON(REGISTRATIONS_FILE, registrations);
    }

    return res.json({ exists: true });
  }

  return res.json({ exists: false });
};

exports.sendReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const { nom, prenom, email } = req.body;

    const newRegistration = {
      id: Date.now().toString(),
      user: { nom, prenom, email },
      date: new Date().toISOString(),
      status: "PENDING",
      receiptUrl: req.file.filename, // On stocke juste le nom, le frontend ajoutera /uploads/
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

    // Ajouter à la whitelist users.json
    const usersData = readJSON(USERS_FILE);
    if (!usersData.users) usersData.users = [];

    const user = registrations[index].user;
    const alreadyInWhitelist = usersData.users.find(
      (u) => u.email.toLowerCase() === user.email.toLowerCase(),
    );

    if (!alreadyInWhitelist) {
      usersData.users.push({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      });
      writeJSON(USERS_FILE, usersData);
    }

    res.json({ success: true });
  } else {
    res.status(404).json({ message: "Inscription non trouvée" });
  }
};

// --- EMAIL HELPERS ---

async function sendAdminNotification(registration, filePath) {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Nouveau Reçu - ${registration.user.nom} ${registration.user.prenom}`,
      text: `Utilisateur: ${registration.user.email}`,
      attachments: [{ filename: registration.receiptUrl, path: filePath }],
    };

    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error("Email Error:", e);
  }
}
