import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { ImSpinner5 } from "react-icons/im";
import { ChevronDown, Send, Star, Trophy, WalletCards, X } from "lucide-react";
import { useSocketFi } from "@socketfi/react";
import DashboardLayoutContainer from "./DashboardLayoutContainer";
import DashboardMobileHeader from "./DashboardMobileHeader";
import MobileNavigation from "../MobileNavigation";
import DashboardNavigation from "./DashboardNavigation";
import DashboardSidebarContainer from "./DashboardSidebarContainer";
import DashboardDesktopHeader from "./DashboardDesktopHeader";
import DashboardContainer from "./DashboardContainer";
import BackButton from "../BackButton";
import CustomSearch from "../Search";
import Heading from "./Heading";
import DashboardLogo from "./DashboardLogo";
import ScrollToTop from "../ScrollToTop";

import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { uploadProfilePicture } from "@/services";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTwitterAuthCallback } from "@/hooks/useTwitterAuthCallback";
import ConnectWalletModal from "@/pages/get-started/ConnectWalletModal";
import WalletKitModal from "../WalletKitModal";
import { setSocketfiSession } from "@/store/socketfiAuthSlice";
import { useDispatch } from "react-redux";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileButton({ user, onClick }) {
  const displayName = user?.name || user?.username || "Contributor";
  const initials = getInitials(displayName);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-2 rounded-2xl border border-[#EAECF0] bg-white px-2 py-2 shadow-sm transition hover:border-[#D0D5DD] hover:bg-[#F9FAFB]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF2FF] text-xs font-semibold text-[#2F0FD1]">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="hidden min-w-0 text-left sm:block">
        <p className="max-w-[150px] truncate text-sm font-semibold text-[#101828]">
          {displayName}
        </p>
        <p className="text-xs text-[#667085]">View profile</p>
      </div>

      <ChevronDown className="hidden h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:text-[#667085] sm:block" />
    </button>
  );
}

function ProfileDrawer({
  open,
  user,
  publicKey,
  uploading,
  handleImageSelect,
  onClose,
  onLogout,
}) {
  const [copied, setCopied] = useState(false);

  const displayName = user?.name || user?.username || "Contributor";
  const initials = getInitials(displayName);

  const profile = {
    name: displayName,
    email: user?.email || "No email added",
    username: user?.username || "Not set",
    role: user?.role || "Contributor",
    bio: user?.bio || "No bio added yet.",
    reputation: user?.reputation || 0,
    completedTasks: user?.completedTasks || 0,
    activeApplications: user?.activeApplications || 0,
    totalApplications: user?.totalApplications || 0,
    shortlistedApplications: user?.shortlistedApplications || 0,
    acceptedApplications: user?.acceptedApplications || 0,
    earned: user?.earned || 0,
    responseRate: user?.responseRate || "0%",
  };

  const shortPublicKey = publicKey
    ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`
    : "No wallet connected";

  const stats = [
    { label: "Reputation", value: profile.reputation, icon: Star },
    { label: "Completed", value: profile.completedTasks, icon: Trophy },
    {
      label: "Active Applications",
      value: profile.activeApplications,
      icon: Send,
    },
    { label: "Earned", value: `$${profile.earned}`, icon: WalletCards },
  ];

  const applicationStats = [
    ["Total applications", profile.totalApplications],
    ["Shortlisted", profile.shortlistedApplications],
    ["Accepted", profile.acceptedApplications],
    ["Response rate", profile.responseRate],
  ];

  const handleCopy = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy wallet address");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent
        side="right"
        className="flex h-full w-[92%] flex-col border-l border-[#EAECF0] bg-white p-0 shadow-2xl sm:max-w-md"
      >
        <SheetHeader className="border-b border-[#EAECF0] px-5 py-4 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-base font-semibold text-[#101828]">
                Profile
              </SheetTitle>
              <p className="mt-1 text-sm text-[#667085]">
                Contributor details and activity.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#667085] transition hover:bg-[#F8FAFC]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
            <div className="flex items-center gap-4">
              <Label
                htmlFor="profile-image"
                className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-sm"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-base font-semibold text-[#2F0FD1]">
                    {initials}
                  </span>
                )}

                <Input
                  onChange={handleImageSelect}
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />

                <span className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-lg bg-[#2F0FD1] text-white shadow-sm">
                  {uploading ? (
                    <ImSpinner5 className="animate-spin text-[11px]" />
                  ) : (
                    <FaPlus className="text-[10px]" />
                  )}
                </span>
              </Label>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-[#101828]">
                  {profile.name}
                </h3>
                <p className="truncate text-sm text-[#667085]">
                  @{profile.username}
                </p>
                <p className="mt-1 inline-flex rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 py-1 text-xs font-medium text-[#2F0FD1]">
                  {profile.role}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#667085]">
              {profile.bio}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm"
                >
                  <Icon className="mb-3 h-4 w-4 text-[#2F0FD1]" />
                  <p className="text-lg font-semibold text-[#101828]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#667085]">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-[#101828]">
              Application activity
            </h4>

            <div className="mt-4 space-y-3">
              {applicationStats.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2"
                >
                  <span className="text-sm text-[#667085]">{label}</span>
                  <span className="text-sm font-semibold text-[#101828]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-[#101828]">
              Account details
            </h4>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-[#667085]">Email</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#101828]">
                  {profile.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#667085]">Wallet</p>

                <div className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-2">
                  <p className="truncate font-mono text-sm font-semibold text-[#101828]">
                    {shortPublicKey}
                  </p>

                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!publicKey}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[#2F0FD1] shadow-sm transition hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="h-11 rounded-xl border border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
            >
              Edit profile
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="h-11 rounded-xl bg-[#101828] text-sm font-medium text-white transition hover:bg-[#1D2939]"
            >
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DashboardLayout() {
  const { user, isAuthenticated, setUser, token, logout } = useAuth();
  const { publicKey } = useWallet();

  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isTelegramAuthenticating, setIsTelegramAuthenticating] = useState(
    () =>
      window.location.hash && window.location.hash.includes("tgAuthResult="),
  );

  const location = useLocation();
  const {
    communityAlias: communityId,
    taskId,
    newBurst,
    burstId,
  } = useParams();
  const dispatch = useDispatch();

  useTwitterAuthCallback();

  const socketfi = useSocketFi();
  useEffect(() => {
    console.log("USE EFFECT STARTED");

    async function run() {
      try {
        const data = await socketfi.onSuccessRedirect();

        if (data) {
          dispatch(
            setSocketfiSession({
              userProfile: data.session.userProfile,
              accessToken: data.session.socketfiAccessToken,
            }),
          );
        }

        console.log("the data is", data);
      } catch (err) {
        console.error(err);
      }
    }

    run();
  }, [socketfi]);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath = pathSegments[pathSegments.length - 1];

  const handleLogout = () => {
    logout?.();
    setProfileOpen(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadProfilePicture(file);
      const profileImageUrl = response?.data?.content?.profileImageUrl;

      if (profileImageUrl) {
        setUser({
          ...user,
          profileImageUrl,
        });
        toast.success("Profile picture updated");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setUploading(false);
    }
  };

  if (isTelegramAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <ImSpinner5 className="animate-spin text-[32px] text-[#5865F2]" />
          <p className="text-sm text-[#667085]">
            Completing Telegram authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayoutContainer>
      <ScrollToTop />

      <DashboardMobileHeader>
        <MobileNavigation
          side="left"
          sheetIsOpen={sheetIsOpen}
          setSheetIsOpen={setSheetIsOpen}
          tag="dashboard"
        >
          <DashboardNavigation
            setSheetIsOpen={setSheetIsOpen}
            platform="mobile"
          />
        </MobileNavigation>

        <DashboardLogo />

        {isAuthenticated ? (
          <ProfileButton user={user} onClick={() => setProfileOpen(true)} />
        ) : (
          <div className="w-10" />
        )}
      </DashboardMobileHeader>

      <DashboardSidebarContainer>
        <div className="sticky top-0 z-10 border-b border-[#EAECF0] bg-white px-4 py-4">
          <DashboardLogo />
        </div>

        <DashboardNavigation
          setSheetIsOpen={setSheetIsOpen}
          platform="desktop"
        />
      </DashboardSidebarContainer>

      <DashboardDesktopHeader>
        <div className="min-w-0">
          <Heading />
        </div>

        <div className="flex items-center gap-3">
          {currentPath === "communities" && !communityId ? (
            <div className="hidden items-center gap-3 xl:flex">
              <CustomSearch placeholder="Search community" />
            </div>
          ) : null}

          {isAuthenticated ? (
            <ProfileButton user={user} onClick={() => setProfileOpen(true)} />
          ) : null}
        </div>
      </DashboardDesktopHeader>

      <DashboardContainer>
        <Outlet />
        <ConnectWalletModal />
        <WalletKitModal />
      </DashboardContainer>

      <ProfileDrawer
        open={profileOpen}
        user={user}
        publicKey={publicKey}
        uploading={uploading}
        handleImageSelect={handleImageSelect}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
      />
    </DashboardLayoutContainer>
  );
}

export default DashboardLayout;
