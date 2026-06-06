import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function CustomInput({
  label,
  placeholder,
  prefix,
  type = "text",
  className = "",
  icon,
  handleClickIcon,
  error,
  token,
  ...props
}) {
  return (
    <Label className="flex flex-col items-start gap-2 text-base font-light text-[#001723]">
      {label}
      {prefix ? (
        <div className="relative h-[48px] w-full rounded-[12px]">
          <span className="absolute flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 py-2 text-base text-[#8791A7]">
            {prefix}
          </span>

          <Input
            type={type}
            placeholder={placeholder}
            className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-4 pl-24 text-base text-[#09032A] placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-[#aab1c1] ${className}`}
            {...props}
          />
          {icon && (
            <span
              onClick={handleClickIcon}
              className="absolute top-0 right-0 bottom-0 flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]"
            >
              {icon}
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="relative h-[48px] w-full rounded-[12px]">
            <Input
              type={type}
              placeholder={placeholder}
              className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base text-[#09032A] placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-[#ebedf0] ${className}`}
              {...props}
            />
            {icon && (
              <span
                onClick={handleClickIcon}
                className="absolute top-0 right-0 bottom-0 flex cursor-pointer items-center px-4 text-2xl text-[#B2B9C7]"
              >
                {icon}
              </span>
            )}
            {token && (
              <span className="absolute top-0 bottom-0 left-0 flex h-full w-28 max-w-[40%] items-center overflow-hidden rounded-l-sm bg-[#EDF2FF] px-3 pt-2 text-sm text-[#8791A7]">
                <span className="truncate">{token}</span>
              </span>
            )}
          </div>
        </>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </Label>
  );
}
