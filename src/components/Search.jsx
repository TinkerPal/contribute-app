import { Search } from "lucide-react";

function CustomSearch({ placeholder, onSearchChange, className = "" }) {
  return (
    <div
      className={[
        "relative flex h-11 w-full max-w-[320px] min-w-[240px] items-center rounded-xl border border-[#E4E7EC] bg-white pr-3 pl-10 shadow-sm transition",
        "focus-within:border-[#C7D7FE] focus-within:ring-2 focus-within:ring-[#EEF2FF]",
        className,
      ].join(" ")}
    >
      <Search className="absolute left-3 h-4 w-4 text-[#98A2B3]" />

      <input
        type="text"
        placeholder={placeholder}
        onChange={onSearchChange}
        className="w-full border-none bg-transparent text-sm text-[#344054] outline-none placeholder:text-[#98A2B3]"
      />
    </div>
  );
}

export default CustomSearch;
