import { HiOutlineSparkles } from "react-icons/hi";

function Empty({ title, description }) {
  return (
    <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
        <HiOutlineSparkles className="h-8 w-8" />
      </div>

      <div className="max-w-lg space-y-2">
        <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-6 text-[#667085]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default Empty;
