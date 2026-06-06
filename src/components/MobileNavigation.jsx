import { useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileNavigation({
  side = "left",
  sheetIsOpen,
  setSheetIsOpen,
  children,
  tag,
}) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handler = () => {
      if (mediaQuery.matches) {
        setSheetIsOpen(false);
      }
    };

    handler();
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [setSheetIsOpen]);

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5EAF5] bg-white text-[#2F0FD1] shadow-sm transition hover:bg-[#F8FAFF] active:scale-[0.98] lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open mobile navigation</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className="w-[88%] border-r border-[#EEF2FF] bg-white p-0 sm:max-w-[360px]"
      >
        <SheetHeader className="border-b border-[#F2F4F7] px-5 py-4 text-left">
          <SheetTitle className="text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[22px] font-extrabold tracking-tight text-[#2F0FD1]"
              onClick={() => {
                setSheetIsOpen(false);
                window.scrollTo({ top: 0 });
              }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-bold">
                CF
              </span>
              <span>Contribute</span>
            </Link>
          </SheetTitle>

          <SheetDescription className="text-left text-sm text-[#667085]">
            {tag === "dashboard" ? "Dashboard navigation" : "Navigation"}
          </SheetDescription>
        </SheetHeader>

        <div className="h-full overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
