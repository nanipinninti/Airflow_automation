import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

export async function listenDB(io) {
  const client = await pool.connect();
  console.log("Connected to PostgreSQL");

  client.on("notification", msg => {
    console.log("📢 Event Received:", msg.channel, msg.payload);
    io.emit("fetchStudentRecords")
  });

  await client.query("LISTEN student_events");
  console.log("👂 Listening to student_events...");
}
