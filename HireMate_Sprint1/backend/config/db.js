import { initStorage } from '../utils/storage.js';

// Simple JSON storage initialization (no MongoDB needed)
const connectDB = async () => {
  try {
    initStorage();
    console.log("✅ JSON Storage Connected Successfully");
  } catch (error) {
    console.error("❌ Error initializing storage:", error.message);
    process.exit(1);
  }
};

export default connectDB;
