
// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lichessId } = req.query;

  if (!lichessId) {
    return res.status(400).json({ error: "Lichess ID is required" });
  }

  try {
    // Fetch the user from the database using the Lichess ID
    const user = await prisma.user.findUnique({
      where: { lichessId: lichessId as string },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ accessToken: user.accessToken });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

