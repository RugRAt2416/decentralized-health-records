require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ================= AUDIT LOG STORAGE =================
const auditLogs = [];

// ================= ENCRYPTION =================
function getKey() {
  return crypto
    .createHash("sha256")
    .update("my_super_secret_key")
    .digest();
}

function encryptFile(filePath) {
  const data = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);

  return Buffer.concat([
    iv,
    cipher.update(data),
    cipher.final()
  ]);
}

function decryptBuffer(buffer) {
  const iv = buffer.slice(0, 16);
  const encrypted = buffer.slice(16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
}

// ================= IPFS (PINATA) =================
async function uploadToIPFS(buffer) {
  const data = new FormData();
  data.append("file", buffer, "record.enc");

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      headers: {
        ...data.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      }
    }
  );

  return res.data.IpfsHash;
}

async function downloadFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Upload → Encrypt → IPFS
app.post("/upload-record", upload.single("file"), async (req, res) => {
  try {
    const encrypted = encryptFile(req.file.path);
    const cid = await uploadToIPFS(encrypted);

    fs.unlinkSync(req.file.path);

    // 🔐 AUDIT LOG
    auditLogs.push({
      action: "UPLOAD",
      file: req.file.originalname,
      cid,
      time: new Date().toLocaleString()
    });

    res.json({
      success: true,
      cid
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ success: false });
  }
});

// Download → Decrypt
app.post("/download-record", async (req, res) => {
  try {
    const { cid } = req.body;

    const encryptedBuffer = await downloadFromIPFS(cid);
    const decrypted = decryptBuffer(encryptedBuffer);

    const outputPath = path.join(__dirname, "decrypted_file");
    fs.writeFileSync(outputPath, decrypted);

    // 🔐 AUDIT LOG
    auditLogs.push({
      action: "DOWNLOAD",
      file: cid,
      time: new Date().toLocaleString()
    });

    res.json({
      success: true,
      message: "File downloaded and decrypted",
      file: "decrypted_file"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Audit Logs
app.get("/audit-logs", (req, res) => {
  res.json(auditLogs);
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
