import fs from "fs";
import path from "path";
import multer from "multer";

// Resolve uploads directory
const uploadDir = path.resolve("src/uploads");

// Automatically create directory if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const originalBase = path.basename(file.originalname, fileExt);
    // Sanitize the filename to alphanumeric and underscores
    const sanitizedBase = originalBase.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${fileExt}`);
  }
});

// File Type Validation (PDF Only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed!"), false);
  }
};

// Multer Upload Instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit: 10MB
  }
});

export default upload;
