import { connect, connection } from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONOG_DB_URI;

    if (!uri) throw new Error("Does not exist database connection uri!");

    await connect(uri);
    console.log("Connected");
  } catch (err) {
    process.exit(1);
  }
};

export const closeDBConnection = async () => {
  await connection.close(false);
};
