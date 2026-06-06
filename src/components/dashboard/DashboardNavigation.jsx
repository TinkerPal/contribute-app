import { useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";

function DashboardNavigation({ setSheetIsOpen, platform = "desktop" }) {
  const { logout, isAuthenticated, user } = useAuth();
  const location = useLocation();

  const restrictedTitles = useMemo(
    () => [
      "Earnings",
      "Analytics",
      "Profile",
      "Notifications",
      "Help & Support",
    ],
    [],
  );

  const handleClose = () => {
    setSheetIsOpen?.(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <aside
      className={[
        "flex h-full flex-col",
        platform === "mobile" ? "px-4 py-4" : "px-4 py-5",
      ].join(" ")}
    >
      {platform === "desktop" && (
        <div className="mb-5 rounded-2xl border border-[#EEF2FF] bg-gradient-to-br from-[#FAFBFF] to-white p-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-700 uppercase">
            Contribution Hub
          </p>

          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Manage quests, contributions, rewards, and your account in one
            place.
          </p>
        </div>
      )}

      <div className="flex-1 space-y-5">
        {DASHBOARD_NAV_LINKS.map((section, index) => (
          <div key={section.heading || index} className="space-y-2">
            {section.heading ? (
              <p className="px-3 text-[11px] font-semibold tracking-[0.08em] text-[#98A2B3] uppercase">
                {section.heading}
              </p>
            ) : null}

            <ul className="space-y-1">
              {section.links.map((link, idx) => {
                const to =
                  !isAuthenticated && restrictedTitles.includes(link.title)
                    ? "/get-started"
                    : link.href;

                return (
                  <li key={`${link.title}-${idx}`}>
                    <NavLink
                      to={to}
                      onClick={handleClose}
                      className={({ isActive }) =>
                        [
                          "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-[#EEF2FF] text-[#2F0FD1] shadow-sm"
                            : "text-[#667085] hover:bg-[#F8FAFC] hover:text-[#2F0FD1]",
                        ].join(" ")
                      }
                    >
                      {link.icon ? (
                        <span className="inline-flex h-6 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#EEF2FF] transition group-hover:ring-[#D9E2FF]">
                          <link.icon className="text-[18px]" />
                        </span>
                      ) : null}

                      <span className="flex-1">{link.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {index < DASHBOARD_NAV_LINKS.length - 1 ? (
              <div className="px-2 pt-2">
                <div className="h-px bg-[#F2F4F7]" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-[#F2F4F7] pt-4">
        {isAuthenticated ? (
          <Link
            to="/"
            onClick={() => {
              logout();
              handleClose();
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#B42318] transition hover:bg-[#FEF3F2]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF3F2]">
              <GoSignOut className="text-[18px]" />
            </span>
            <span>Log Out</span>
          </Link>
        ) : (
          <Link
            to="/auth"
            onClick={handleClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#2F0FD1]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAFC]">
              <GoSignOut className="text-[18px]" />
            </span>
            <span>Login</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

export default DashboardNavigation;
