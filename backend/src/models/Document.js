import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DocumentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      unique: true
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"]
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true // file size in bytes
    },
    pageCount: {
      type: Number,
      default: 0
    },
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      required: true,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded"
    }
  },
  {
    timestamps: true
  }
);

const MongooseDocument = mongoose.model("Document", DocumentSchema);

// --- Local Fallback Database ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "../../data/documents.json");

const readLocalDB = () => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("❌ Failed to read local JSON database:", error);
    return [];
  }
};

const writeLocalDB = (data) => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Failed to write local JSON database:", error);
  }
};

class LocalDocumentInstance {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = new mongoose.Types.ObjectId().toString();
    }
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date().toISOString();
    }
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const db = readLocalDB();
    const index = db.findIndex(d => d._id === this._id);
    if (index !== -1) {
      db[index] = { ...this };
    } else {
      db.push({ ...this });
    }
    writeLocalDB(db);
    return this;
  }

  async deleteOne() {
    const db = readLocalDB();
    const filtered = db.filter(d => d._id !== this._id);
    writeLocalDB(filtered);
    return { acknowledged: true, deletedCount: 1 };
  }
}

class LocalQuery {
  constructor(data) {
    this._data = data;
    this._sortObj = null;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  async then(onFulfilled, onRejected) {
    try {
      let results = [...this._data];
      if (this._sortObj) {
        const keys = Object.keys(this._sortObj);
        if (keys.length > 0) {
          const key = keys[0];
          const direction = this._sortObj[key]; // 1 or -1
          results.sort((a, b) => {
            const valA = new Date(a[key]);
            const valB = new Date(b[key]);
            if (valA < valB) return -direction;
            if (valA > valB) return direction;
            return 0;
          });
        }
      }
      return onFulfilled(results);
    } catch (err) {
      if (onRejected) {
        return onRejected(err);
      }
      throw err;
    }
  }
}

const LocalDocument = {
  find() {
    const data = readLocalDB().map(d => new LocalDocumentInstance(d));
    return new LocalQuery(data);
  },

  async findById(id) {
    const db = readLocalDB();
    const docData = db.find(d => d._id === id?.toString());
    if (!docData) return null;
    return new LocalDocumentInstance(docData);
  },

  async create(data) {
    const docInstance = new LocalDocumentInstance(data);
    await docInstance.save();
    return docInstance;
  }
};

const DocumentWrapper = new Proxy(MongooseDocument, {
  get(target, prop, receiver) {
    if (global.useLocalDB) {
      if (prop in LocalDocument) {
        return LocalDocument[prop];
      }
    }
    return Reflect.get(target, prop, receiver);
  }
});

export default DocumentWrapper;
