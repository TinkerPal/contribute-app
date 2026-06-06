import { useEffect, useState } from "react";
import { WalletKitService } from "../utils/wallet-kit/services/global-service";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function WalletKitModal() {
  const [isAvailableMap, setIsAvailableMap] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const {
    stellarWalletKitIsOpen,
    setPublicKey,
    setNetwork,
    publicKey,
    network,
    handleCloseStellarWalletKitModal,
    setWalletLoading,
    closeAuthModal,
  } = useWallet();

  const stellarWalletKitOptions = WalletKitService.walletKit.modules;

  // const { mutate: initiateWalletChallengeMutation } = useMutation({
  //   mutationFn: ({ publicKey, network }) =>
  //     initiateWalletChallenge(publicKey, network.network),
  //   onSuccess: async (data) => {
  //     if (data?.status === 200) {
  //       try {
  //         const signedChallengeXdr = await WalletKitService.signTx(
  //           data.data.content,
  //           network,
  //         );

  //         verifyWalletChallengeMutation({
  //           signedChallengeXdr,
  //           publicKey,
  //           network: network.network,
  //         });
  //       } catch (error) {
  //         console.error("Signing error:", error);
  //         toast.error("Failed to sign transaction");
  //         setWalletLoading(false);
  //       }
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Wallet challenge error:", error);
  //     toast.error("Failed to initiate wallet login");
  //     setWalletLoading(false);
  //   },
  // });

  // const { mutate: verifyWalletChallengeMutation } = useMutation({
  //   mutationFn: ({ signedChallengeXdr, publicKey, network }) =>
  //     verifyWalletChallenge(signedChallengeXdr, publicKey, network),
  //   onSuccess: async (data) => {
  //     console.log({ data });
  //     if (data.status === 200) {
  //       const content = data.data.content;
  //       const token = content.accessToken?.token;

  //       if (!content.username) {
  //         login({
  //           token,
  //           email: null,
  //           user: null,
  //           otp: "123456",
  //           username: null,
  //           authMethod: "WALLET",
  //         });
  //         navigate("/get-started/username");
  //       } else if (!content.bio && !content.lastLogin) {
  //         login({
  //           token,
  //           email: null,
  //           user: null,
  //           otp: null,
  //           username: content.username,
  //           authMethod: "WALLET",
  //         });
  //         navigate("/get-started/account-configuration");
  //       } else {
  //         login({
  //           token,
  //           email: null,
  //           user: content,
  //           otp: null,
  //           username: null,
  //           authMethod: "WALLET",
  //         });
  //         navigate("/", { replace: true });
  //         toast.success("Login successful");
  //       }
  //       setWalletLoading(false);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Wallet login failed:", error);
  //     toast.error(error.response?.data?.message || "Wallet login failed");
  //     setWalletLoading(false);
  //   },
  // });

  useEffect(() => {
    Promise.all(
      stellarWalletKitOptions.map(async ({ isAvailable }) => isAvailable()),
    ).then((results) => {
      const map = new Map();
      results.forEach((isAvailable, index) => {
        map.set(stellarWalletKitOptions[index].productName, isAvailable);
      });
      setIsAvailableMap(map);
    });
  }, [stellarWalletKitOptions]);

  // Mount and show modal
  useEffect(() => {
    if (stellarWalletKitIsOpen) {
      setShouldRender(true);
      // small timeout to trigger enter transition
      setTimeout(() => setIsVisible(true), 20);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300); // Match transition duration
    }
  }, [stellarWalletKitIsOpen]);

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  if (!shouldRender) return null;

  return (
    <div
      onClick={handleCloseStellarWalletKitModal}
      className="fixed inset-0 z-100 flex items-center justify-center bg-gray-500/35 px-2 py-5 backdrop-blur-sm sm:p-6"
    >
      {/* Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg transform rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <svg
          className="absolute top-0 right-0 mt-4 mr-4 h-auto w-5 cursor-pointer text-gray-500"
          onClick={handleCloseStellarWalletKitModal} // Close on click
          viewBox="0 0 32 32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.24 16L26.08 8.16C26.3721 7.86194 26.5348 7.46064 26.5327 7.04332C26.5306 6.62599 26.3638 6.22636 26.0687 5.93126C25.7736 5.63616 25.374 5.46944 24.9567 5.46734C24.5394 5.46523 24.1381 5.6279 23.84 5.92L16 13.76L8.16 5.92C7.86194 5.6279 7.46064 5.46523 7.04332 5.46734C6.62599 5.46944 6.22636 5.63616 5.93126 5.93126C5.63616 6.22636 5.46944 6.62599 5.46734 7.04332C5.46523 7.46064 5.6279 7.86194 5.92 8.16L13.76 16L5.92 23.84C5.6279 24.1381 5.46523 24.5394 5.46734 24.9567C5.46944 25.374 5.63616 25.7736 5.93126 26.0687C6.22636 26.3638 6.62599 26.5306 7.04332 26.5327C7.46064 26.5348 7.86194 26.3721 8.16 26.08L16 18.24L23.84 26.08C24.1381 26.3721 24.5394 26.5348 24.9567 26.5327C25.374 26.5306 25.7736 26.3638 26.0687 26.0687C26.3638 25.7736 26.5306 25.374 26.5327 24.9567C26.5348 24.5394 26.3721 24.1381 26.08 23.84L18.24 16Z"
            fill="currentColor"
          />
        </svg>

        {/* Modal Content */}
        <div className="px-4 py-5 sm:p-6">
          <p className="text-xl font-bold text-gray-900">Stellar Wallet Kit</p>
          <p className="mt-3 text-sm font-medium text-gray-500">
            Select from Stellar Wallet Kit options
          </p>

          <div className="mt-6 space-y-3">
            {stellarWalletKitOptions?.map((option) => (
              <div
                onClick={() => {
                  setWalletLoading(true);
                  isAvailableMap.get(option?.productName)
                    ? WalletKitService.login(
                        option?.productId,
                        setPublicKey,
                        setNetwork,
                        () => closeAuthModal(),

                        // (publicKey, network) => {
                        //   initiateWalletChallengeMutation({
                        //     publicKey,
                        //     network,
                        //   });
                        // },
                      )
                    : handleDownload(option?.productUrl);
                  handleCloseStellarWalletKitModal();
                }}
                key={option?.productName}
                className="transform cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:translate-x-1 hover:translate-y-1"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between space-x-5">
                    <div className="flex flex-1 items-center">
                      <img
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                        src={option?.productIcon}
                        alt=""
                      />
                      <div className="ml-4 min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {option?.productName}
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-gray-500">
                          {option?.productUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      {!isAvailableMap?.get(option?.productName) ? (
                        <svg
                          className="h-auto w-6 text-gray-600"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M26 20V24C26 25.1046 25.1046 26 24 26H8C6.89543 26 6 25.1046 6 24V20H8V24H24V20H26ZM17 16.5858L20.2929 13.2929L21.7071 14.7071L16 20.4142L10.2929 14.7071L11.7071 13.2929L15 16.5858V6H17V16.5858Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-auto w-6 text-gray-600"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.6922 16L9.89742 7.20518L11.6026 5.5L22.1026 16L11.6026 26.5L9.89742 24.7948L18.6922 16Z"
                            fill="black"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
