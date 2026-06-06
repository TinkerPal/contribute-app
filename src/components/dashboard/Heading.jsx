import { useMemo } from "react";
import { useLocation } from "react-router";
import { capitalizeFirstLetter } from "@/lib/utils";

const CUSTOM_TITLES = {
  "get-started": "Get Started",
  "new-burst": "Create Burst",
};

export default function Heading() {
  const location = useLocation();

  const title = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const currentPath = pathSegments[pathSegments.length - 1];

    if (!currentPath) return "Overview";

    if (CUSTOM_TITLES[currentPath]) return CUSTOM_TITLES[currentPath];

    return capitalizeFirstLetter(currentPath.replace(/-/g, " "));
  }, [location.pathname]);

  return (
    <div className="space-y-1">
      <h1 className="text-[22px] font-semibold tracking-tight text-[#101828]">
        {title}
      </h1>
      <p className="text-sm text-[#667085]">
        Manage and monitor your dashboard activity.
      </p>
    </div>
  );
}
