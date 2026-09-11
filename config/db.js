import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
    const dbName = process.env.MONGO_DB_NAME || "Boilerplate";

    const conn = await mongoose.connect(uri, {
      dbName,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB: ", error.message || error);
    process.exit(1);
  }
};

export default connectDB;