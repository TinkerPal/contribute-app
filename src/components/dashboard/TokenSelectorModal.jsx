// import { IoCloseSharp } from "react-icons/io5";
// import { useMemo, useState } from "react";
// import { curatedList } from "@/utils/curated-asset-list";
// import { Button } from "../ui/button";
// import { toast } from "react-toastify";

// export default function TokenSelectorModal({
//   openTokenSelectorModal,
//   setOpenTokenSelectorModal,
//   setRewardToken,
// }) {
//   const [search, setSearch] = useState("");

//   const displayTokenList = useMemo(() => {
//     if (!search.trim()) {
//       return curatedList || [];
//     }

//     const searchLower = search.toLowerCase().trim();

//     // Check if it's a code:issuer format
//     if (searchLower.includes(":")) {
//       const [code, issuer] = searchLower.split(":");

//       return (
//         curatedList?.filter((token) => {
//           const codeMatch = token.code?.toLowerCase().includes(code);
//           const issuerMatch = issuer
//             ? token.issuer?.toLowerCase().includes(issuer)
//             : true;
//           return codeMatch && issuerMatch;
//         }) || []
//       );
//     }

//     // Regular search across multiple fields
//     const fieldsToSearch = [
//       "code",
//       "issuer",
//       "contract",
//       "name",
//       "org",
//       "domain",
//     ];

//     return (
//       curatedList?.filter((token) =>
//         fieldsToSearch.some((field) =>
//           token[field]?.toLowerCase().includes(searchLower),
//         ),
//       ) || []
//     );
//   }, [search]);

//   function handleTokenSelection(id) {
//     const selectedToken = curatedList?.find((token) => token?.contract === id);
//     setRewardToken(selectedToken);
//     setOpenTokenSelectorModal(false);
//     setSearch("");
//   }

//   function useCustomToken() {
//     const searchValue = search.split(":");

//     if (searchValue.length !== 2) {
//       toast.error("Invalid Token. Format: CODE:ISSUER");
//       return;
//     }

//     const [code, issuer] = searchValue;

//     if (!code.trim() || !issuer.trim()) {
//       toast.error("Both code and issuer are required");
//       return;
//     }

//     const customToken = {
//       code: code.trim(),
//       contract: issuer.trim(),
//       issuer: issuer.trim(),
//       name: code.trim(),
//     };

//     setRewardToken(customToken);
//     setOpenTokenSelectorModal(false);
//     setSearch("");
//   }

//   if (!openTokenSelectorModal) return null;

//   return (
//     <div
//       className="absolute right-0 left-0 z-10 mx-auto flex items-center justify-center"
//       onClick={() => setOpenTokenSelectorModal(false)}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="relative w-[95%] max-w-lg rounded-xl border bg-white p-6 shadow-md dark:bg-[#2f184b]"
//       >
//         <button
//           onClick={() => setOpenTokenSelectorModal(false)}
//           className="absolute top-4 right-4 cursor-pointer dark:text-white"
//         >
//           <IoCloseSharp className="h-5 w-auto text-gray-700" />
//         </button>
//         <h2 className="mb-4 text-2xl font-semibold text-purple-900 dark:text-white">
//           Choose asset
//         </h2>
//         <input
//           type="text"
//           placeholder="Search asset or enter home domain"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:outline-none"
//         />
//         <div className="mb-4 flex flex-wrap justify-center gap-2">
//           {displayTokenList?.slice(0, 4).map((token) => (
//             <button
//               key={token?.contract}
//               type="button"
//               className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1 text-sm hover:bg-purple-100 dark:hover:bg-purple-800"
//               onClick={() => {
//                 handleTokenSelection(token?.contract);
//               }}
//             >
//               <img src={token.icon} alt={token.code} className="h-5 w-5" />
//               {token.name}
//             </button>
//           ))}
//         </div>
//         <div className="max-h-72 overflow-y-auto pr-2">
//           {displayTokenList?.slice(4)?.map((token) => (
//             <div
//               key={token?.contract}
//               className="flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-purple-100 dark:hover:bg-purple-800"
//               onClick={() => {
//                 handleTokenSelection(token?.contract);
//               }}
//             >
//               <img src={token?.icon} alt={token?.code} className="h-6 w-6" />
//               <div>
//                 <div className="font-medium text-purple-900 dark:text-white">
//                   {token.name}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-300">
//                   {token.domain}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div>
//           {displayTokenList.length < 1 && (
//             <div className="flex flex-wrap items-center justify-end gap-4">
//               <Button
//                 variant="secondary"
//                 size="lg"
//                 type="button"
//                 className="w-[35%]"
//                 onClick={useCustomToken}
//               >
//                 Use Custom Token
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { IoCloseSharp } from "react-icons/io5";
import { useMemo, useState } from "react";
import { curatedList } from "@/utils/curated-asset-list";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

export default function TokenSelectorModal({
  openTokenSelectorModal,
  setOpenTokenSelectorModal,
  setRewardToken,
}) {
  const [search, setSearch] = useState("");

  const displayTokenList = useMemo(() => {
    if (!search.trim()) {
      return curatedList || [];
    }

    const searchLower = search.toLowerCase().trim();

    // Check if it's a code:issuer format
    if (searchLower.includes(":")) {
      const [code, issuer] = searchLower.split(":").map((s) => s.trim());

      return (
        curatedList?.filter((token) => {
          const codeMatch = token.code?.toLowerCase().includes(code);
          const issuerMatch = issuer
            ? token.issuer?.toLowerCase().includes(issuer)
            : true;
          return codeMatch && issuerMatch;
        }) || []
      );
    }

    // Regular search across multiple fields
    const fieldsToSearch = [
      "code",
      "issuer",
      "contract",
      "name",
      "org",
      "domain",
    ];

    return (
      curatedList?.filter((token) =>
        fieldsToSearch.some((field) =>
          token[field]?.toLowerCase().includes(searchLower),
        ),
      ) || []
    );
  }, [search]);

  function handleTokenSelection(id) {
    const selectedToken = curatedList?.find((token) => token?.contract === id);
    setRewardToken(selectedToken);
    setOpenTokenSelectorModal(false);
    setSearch("");
  }

  function useCustomToken() {
    const trimmedSearch = search.trim();

    // Check if it contains a colon (CODE:ISSUER format)
    if (trimmedSearch.includes(":")) {
      const searchValue = trimmedSearch.split(":").map((s) => s.trim());

      if (searchValue.length !== 2) {
        toast.error("Invalid Token. Format: CODE:ISSUER");
        return;
      }

      const [code, issuer] = searchValue;

      if (!code || !issuer) {
        toast.error("Both code and issuer are required");
        return;
      }

      const customToken = {
        code: code,
        // contract: issuer,
        issuer: issuer,
        name: code,
      };

      setRewardToken(customToken);
      setOpenTokenSelectorModal(false);
      setSearch("");
    } else {
      // Treat as contract address only
      if (!trimmedSearch) {
        toast.error("Please enter a valid contract address");
        return;
      }

      const customToken = {
        code: "CUSTOM",
        contract: trimmedSearch,
        // issuer: trimmedSearch,
        name: "Custom Token",
      };

      setRewardToken(customToken);
      setOpenTokenSelectorModal(false);
      setSearch("");
    }
  }

  if (!openTokenSelectorModal) return null;

  return (
    <div
      className="absolute right-0 left-0 z-10 mx-auto flex items-center justify-center"
      onClick={() => setOpenTokenSelectorModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[95%] max-w-lg rounded-xl border bg-white p-6 shadow-md dark:bg-[#2f184b]"
      >
        <button
          onClick={() => setOpenTokenSelectorModal(false)}
          className="absolute top-4 right-4 cursor-pointer dark:text-white"
        >
          <IoCloseSharp className="h-5 w-auto text-gray-700" />
        </button>
        <h2 className="mb-4 text-2xl font-semibold text-purple-900 dark:text-white">
          Choose asset
        </h2>
        <input
          type="text"
          placeholder="Search asset, contract, or CODE:ISSUER"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:outline-none"
        />
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {displayTokenList?.slice(0, 4).map((token) => (
            <button
              key={token?.contract}
              type="button"
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1 text-sm hover:bg-purple-100 dark:hover:bg-purple-800"
              onClick={() => {
                handleTokenSelection(token?.contract);
              }}
            >
              <img src={token.icon} alt={token.code} className="h-5 w-5" />
              {token.code}
            </button>
          ))}
        </div>
        <div className="max-h-72 overflow-y-auto pr-2">
          {displayTokenList?.slice(4)?.map((token) => (
            <div
              key={token?.contract}
              className="flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-purple-100 dark:hover:bg-purple-800"
              onClick={() => {
                handleTokenSelection(token?.contract);
              }}
            >
              <img src={token?.icon} alt={token?.code} className="h-6 w-6" />
              <div>
                <div className="font-medium text-purple-900 dark:text-white">
                  {token.code}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {token.domain}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {displayTokenList.length < 1 && search.trim() && (
            <div className="flex flex-wrap items-center justify-end gap-4">
              <Button
                variant="secondary"
                size="lg"
                type="button"
                className="w-[35%]"
                onClick={useCustomToken}
              >
                Use Custom Token
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
