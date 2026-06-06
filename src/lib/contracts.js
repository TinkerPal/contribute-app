const supportedFeeAssets = {
  TESTNET: [
    {
      code: "USDC",
      issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
      contract: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
    },
    {
      code: "XLM",
      issuer: "native",
      contract: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    },
  ],
  PUBLIC: [
    { code: "USDC", issuer: "", contract: "" },
    { code: "XLM", issuer: "native", contract: "" },
  ],
};
const escrowContracts = {
  TESTNET: "CC2DVZYLB4APQZKQVGOCF3F2NTHLXJKTMXFEQZQI3E6RIBU2MARL5V7J",
  PUBLIC: "",
};

export const selectedNetwork = "TESTNET";

export const activeFeeAssets = supportedFeeAssets[selectedNetwork];
export const escrowContract = escrowContracts[selectedNetwork];
