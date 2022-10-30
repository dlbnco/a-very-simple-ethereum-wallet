// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";

const ETHERSCAN_API_KEY = "21WW4MZ3MB7EVTYMQT63WY433B1VXZ7D2M";

const ETHERSCAN_ENDPOINT = "https://api.etherscan.io/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = qs.stringify(req.query, { addQueryPrefix: true });
  const response = await fetch(
    ETHERSCAN_ENDPOINT + query + `&apikey=${ETHERSCAN_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    if (response.body == null) throw new Error("Response was null");
    return res.status(200).json(await response.json());
  } catch (error: any) {
    res.status(500).json({ error: error.message ?? "Unknown error" });
  }
}
