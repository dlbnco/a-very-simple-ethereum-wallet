const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const ALCHEMY_ENDPOINT = "https://eth-mainnet.g.alchemy.com/v2";

const alchemyHandler = async (params: Record<string, any>) => {
  const response = await fetch(ALCHEMY_ENDPOINT + `/${ALCHEMY_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      ...params,
    }),
  });
  return await response.json();
};

export default alchemyHandler;
