import { PiWarningCircle } from "react-icons/pi";

function Error({ title }) {
  return (
    <div className="flex h-[calc(100vh-150px)] w-full flex-col items-center justify-center text-center">
      <PiWarningCircle className="mb-3 text-[40px] text-red-500" />
      <p className="text-sm font-medium text-[#6D7A86]">{title}</p>
      <p className="mt-1 text-xs text-[#1082E4]">
        {"An unexpected error occurred."}
      </p>
    </div>
  );
}

export default Error;
