import { useState } from "react";
import { toast } from "react-toastify";
import { useOnChainTask } from "@/hooks/useOnChainTask";
import { IoIosRefreshCircle } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router";

export default function OnChainTaskInput({ task, quest, userId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitOnChainTask, loading, error } = useOnChainTask();

  const [validationErrors, setValidationErrors] = useState({});

  // Collect all input values from the task's function spec
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    if (task?.payload?.functionSpec?.inputs) {
      task.payload.functionSpec.inputs.forEach((input) => {
        initial[input.name] = "";
      });
    }
    return initial;
  });

  const handleInputChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateInputs = () => {
    const errors = {};
    const functionInputs = task?.payload?.functionSpec?.inputs || [];

    for (const input of functionInputs) {
      if (!inputs[input.name] || inputs[input.name].trim() === "") {
        errors[input.name] = `${input.name} is required`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!userId) {
      navigate("/login", { state: { from: location } });
      return;
    }

    // if (!address) {
    //   toast.info("Please connect your wallet using the button in the header");
    //   return;
    // }

    try {
      const userInputs = Object.values(inputs);

      await submitOnChainTask({
        task,
        quest,
        userInputs,
        userId,
        // walletAddress: address,
      });

      toast.success("Task completed successfully!");
      // Optionally refresh the page or trigger a query refetch
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit task:", err);
      // Error toast is already shown in the hook
    }
  };

  const functionInputs = task?.payload?.functionSpec?.inputs || [];
  const hasInputs = functionInputs.length > 0;
  const isWalletConnected = false;
  const isSubmitDisabled = loading || !hasInputs || !isWalletConnected;

  return (
    <div className="w-full space-y-3">
      {functionInputs.map((input, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <div className="h-[48px] flex-1 rounded-[8px] border border-[#D4DCEA] bg-[#F0F4FD] px-8 py-4 text-sm">
              {input.name}
              <span className="ml-2 text-xs text-gray-500">({input.type})</span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={`Enter ${input.name}`}
                className="h-[48px] w-full rounded-[8px] border border-[#D4DCEA] px-4 py-2 text-sm"
              />
            </div>
          </div>
          {validationErrors[input.name] && (
            <p className="ml-2 text-xs text-red-500">
              {validationErrors[input.name]}
            </p>
          )}
        </div>
      ))}

      <div className="flex h-[48px] items-center gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="h-full flex-3 border border-[#2F0FD1] bg-white"
          variant="outline"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <IoIosRefreshCircle className="animate-spin text-[20px]" />
              Submitting...
            </span>
          ) : !isWalletConnected ? (
            "Connect Wallet"
          ) : (
            "Submit Transaction"
          )}
        </Button>

        {task?.payload?.link && (
          <a
            href={task.payload.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-1 items-center justify-center gap-2 rounded-[8px] border border-[#2F0FD1] text-sm text-[#2F0FD1]"
          >
            Open Link
          </a>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
