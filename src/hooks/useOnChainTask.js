import { useState } from "react";
import { toast } from "react-toastify";
import {
  Keypair,
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";
import { initSignTransaction, submitTransactionExternal } from "@/services";
import WalletKitServiceClass from "@/utils/wallet-kit/services/wallet-kit.service";

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function signWithPasskey(options) {
  const challenge = base64ToArrayBuffer(options.challenge);

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: options.rp.id,
      allowCredentials: options.allowCredentials.map((cred) => ({
        ...cred,
        id: base64ToArrayBuffer(cred.id),
      })),
      userVerification: "required",
    },
  });

  return {
    id: assertion.id,
    rawId: arrayBufferToBase64(assertion.rawId),
    response: {
      authenticatorData: arrayBufferToBase64(
        assertion.response.authenticatorData,
      ),
      clientDataJSON: arrayBufferToBase64(assertion.response.clientDataJSON),
      signature: arrayBufferToBase64(assertion.response.signature),
    },
    clientExtensionResults: assertion.clientExtensionResults,
    type: "public-key",
  };
}

const walletKitService = new WalletKitServiceClass();

async function buildAndSignStellarTransaction({
  contractId,
  functionName,
  args,
  network,
  walletAddress,
}) {
  const networkPassphrase =
    network === "TESTNET" ? Networks.TESTNET : Networks.PUBLIC;
  const rpcUrl =
    network === "TESTNET"
      ? "https://soroban-testnet.stellar.org"
      : "https://soroban-publicnet.stellar.org";

  // Initialize RPC server
  const server = new rpc.Server(rpcUrl, { allowHttp: true });

  try {
    // Get the source account (wallet address)
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    const sourceAccount = await server.getAccount(walletAddress);

    // Create contract instance
    const contract = new Contract(contractId);

    // Build the transaction
    const fee = BASE_FEE;

    let transaction;

    // Check if args need to be converted to XDR
    let scArgs = [];
    if (args && args.length > 0) {
      // Convert args to proper XDR types based on your contract's input types
      // This is a simplified version - you may need to handle different types
      scArgs = args.map((arg) => {
        // Try to determine the type - default to string
        try {
          // Check if it's a number
          if (!isNaN(arg)) {
            return xdr.ScVal.scvU64(parseInt(arg));
          }
          // Default to string
          return xdr.ScVal.scvString(arg);
        } catch {
          return xdr.ScVal.scvString(arg);
        }
      });
    }

    // Build the transaction with invoke contract operation
    const txBuilder = new TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase,
    });

    // Add the invoke contract function operation
    txBuilder.addOperation(contract.call(functionName, ...scArgs));

    // Set timeout (30 seconds)
    txBuilder.setTimeout(30);

    // Build the transaction
    transaction = txBuilder.build();

    // For Soroban transactions, we need to simulate first to get the transaction data
    // This is required for smart contract interactions
    const simulatedTransaction = await server.simulateTransaction(transaction);

    // Check if simulation was successful
    if (rpc.SimulateTransactionSuccess.is(simulatedTransaction)) {
      // Prepare the transaction with the simulation results
      const preparedTransaction = await server.prepareTransaction(
        transaction,
        simulatedTransaction,
      );

      // Convert to XDR for signing
      const txXdr = preparedTransaction.toXDR();

      // Sign using the wallet kit
      const signedXdr = await walletKitService.signTx(txXdr, {
        networkPassphrase,
      });

      return signedXdr;
    } else {
      throw new Error(
        "Transaction simulation failed. Please check your inputs.",
      );
    }
  } catch (error) {
    console.error("Error building transaction:", error);
    throw error;
  }
}

export function useOnChainTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitOnChainTask = async ({
    task,
    quest,
    userInputs,
    userId,
    walletAddress,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!quest?.contractAddress) {
        toast.error("Quest contract address is missing");
        throw new Error("Quest contract address is missing");
      }
      if (!quest?.id) {
        toast.error("Quest ID is missing");
        throw new Error("Quest ID is missing");
      }
      if (!task?.id) {
        toast.error("Task ID is missing");
        throw new Error("Task ID is missing");
      }
      if (!task?.payload?.function) {
        toast.error("Task function is missing");
        throw new Error("Task function is missing");
      }
      if (!userId) {
        throw new Error("User ID is missing. Please log in.");
      }
      if (!userInputs || userInputs.length === 0) {
        toast.error("Please provide required inputs");
        throw new Error("Please provide required inputs");
      }

      // Step 1: Get WebAuthn options from backend
      const signResponse = await initSignTransaction({
        contractId: quest.contractAddress,
        network: quest.networkType === "TESTNET" ? "testnet" : "public",
        callFunction: {
          name: task.payload.function,
          args: userInputs,
        },
        questId: quest.id,
        taskId: task.id,
      });

      const { options, signInfo } = signResponse.data;

      // Step 2: Sign with passkey
      const credential = await signWithPasskey(options);

      // Step 3: Build and sign Stellar transaction
      const signedTx = await buildAndSignStellarTransaction({
        contractId: quest.contractAddress,
        functionName: task.payload.function,
        args: userInputs,
        network: quest.networkType,
        walletAddress,
      });

      // Step 4: Submit to backend
      const result = await submitTransactionExternal({
        signedTx,
        network: quest.networkType === "TESTNET" ? "testnet" : "public",
        credential,
        challenge: signInfo.challenge,
        questId: quest.id,
        taskId: task.id,
        userId,
      });

      return result;
    } catch (err) {
      console.error("On-chain task submission error:", err);

      // Extract the actual error message from the response
      let errorMessage = "Failed to submit on-chain task";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.exception?.message) {
        errorMessage = err.response.data.exception.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitOnChainTask, loading, error };
}
