import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONOG_DB_URI;

    if (!uri) throw new Error("Does not exist database connection uri!");

    await connect(uri);
  } catch (err) {
    process.exit(1);
  }
};
