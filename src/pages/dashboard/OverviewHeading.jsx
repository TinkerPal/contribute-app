function OverviewHeading({ children, title, description, large }) {
  return (
    <div
      className={[
        "flex flex-col gap-4",
        large
          ? "lg:flex-row lg:items-end lg:justify-between"
          : "sm:flex-row sm:items-end sm:justify-between",
      ].join(" ")}
    >
      <div className="space-y-2">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-[#667085]">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
    </div>
  );
}

export default OverviewHeading;
