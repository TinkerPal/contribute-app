export const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

export const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

export default function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[#344054]">{label}</span>
      {children}
    </label>
  );
}
