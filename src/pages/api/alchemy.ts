// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import alchemyHandler from "../../alchemy/handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await alchemyHandler(JSON.parse(req.body));
    return res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message ?? "Unknown error" });
  }
}
