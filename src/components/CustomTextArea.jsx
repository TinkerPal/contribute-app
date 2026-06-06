import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function CustomTextArea({
  label,
  placeholder,
  className = "",
  icon,
  handleClickIcon,
  error,
  ...props
}) {
  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      {label}

      <>
        <div className="relative w-full rounded-sm">
          <Textarea
            placeholder={placeholder}
            className={`h-[102px] rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className}`}
            {...props}
          />

          {icon && (
            <span
              onClick={() => handleClickIcon()}
              className="absolute top-0 right-0 bottom-0 flex cursor-pointer items-center px-4 text-2xl text-[#B2B9C7]"
            >
              {icon}
            </span>
          )}
        </div>
      </>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </Label>
  );
}
