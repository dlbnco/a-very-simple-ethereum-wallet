import qs from "qs";

const ETHERSCAN_API_KEY = "21WW4MZ3MB7EVTYMQT63WY433B1VXZ7D2M";

const ETHERSCAN_ENDPOINT = "https://api.etherscan.io/api";

const etherScanHandler = async (params: Record<string, any>) => {
  const query = qs.stringify(params, { addQueryPrefix: true });
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
    return await response.json();
  } catch (error: any) {
    return { error: error.message ?? "Unknown error" };
  }
};

export default etherScanHandler;
