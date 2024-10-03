
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Clear all users from the database (example)
    await prisma.user.deleteMany({});
    // Clear other tables as needed

    res.status(200).json({ message: "Database cleared!" });
  } catch (error) {
    console.error("Error clearing the database:", error);
    res.status(500).json({ error: "Failed to clear the database" });
  }
}
