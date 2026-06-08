import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { FaCheck, FaDiscord, FaTelegram } from "react-icons/fa";
import { FaPlus, FaSquareXTwitter, FaUserLarge } from "react-icons/fa6";
import { PiGithubLogoFill } from "react-icons/pi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import {
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  setItemInSessionStorage,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { linkedAccount, updateBio, uploadProfilePicture } from "@/services";
import { ImSpinner5 } from "react-icons/im";
import { ArrowRight, CheckCircle2, Link2, UserCog } from "lucide-react";

const ACCOUNTS_TO_LINK = [
  {
    title: "Github",
    key: "github",
    icon: <PiGithubLogoFill className="text-[24px]" />,
  },
  {
    title: "Discord",
    key: "discord",
    icon: <FaDiscord className="text-[24px] text-[#5865F2]" />,
  },
  {
    title: "X Account",
    key: "twitter",
    icon: <FaSquareXTwitter className="text-[24px]" />,
  },
  {
    title: "Telegram",
    key: "telegram",
    icon: <FaTelegram className="text-[24px] text-[#23B7EC]" />,
  },
];

function AccountSocialConnection() {
  const { login, accessToken: token, username } = useAuth();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user] = useState(() => getItemFromSessionStorage("user"));

  const [imageUrl, setImageUrl] = useState(
    () => getItemFromSessionStorage("imageUrl") || null,
  );

  const [bio, setBio] = useState(() => getItemFromSessionStorage("bio") || "");

  const [linkingAccount, setLinkingAccount] = useState(null);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [telegramOtp, setTelegramOtp] = useState("");
  const [telegramPendingId, setTelegramPendingId] = useState(null);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  const { data: linkedAccountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ["linkedAccounts", token],
    queryFn: () => linkedAccount(),
    enabled: !!token,
  });

  const linkedAccounts = useMemo(() => {
    if (!linkedAccountsData?.data?.content) return [];

    const content = linkedAccountsData.data.content;

    if (Array.isArray(content)) {
      if (content.length > 0 && typeof content[0] === "string") {
        return content.map((acc) => ({
          provider: acc.toLowerCase(),
          username: null,
        }));
      }

      return content
        .map((acc) => ({
          provider: acc.provider?.toLowerCase(),
          username: acc.username || null,
        }))
        .filter((acc) => acc.provider);
    }

    if (Array.isArray(content.linkedAccounts)) {
      return content.linkedAccounts.map((acc) => ({
        provider: acc.toLowerCase(),
        username: null,
      }));
    }

    return [];
  }, [linkedAccountsData]);

  const hasProgress =
    Boolean(imageUrl) || bio.trim().length > 0 || linkedAccounts.length > 0;

  // useEffect(() => {
  //   if (!username) {
  //     //navigate("/get-started/username", { replace: true });
  //   }
  // }, [navigate, username]);

  useEffect(() => {
    if (!error) return;

    toast.error(
      message
        ? decodeURIComponent(message)
        : "An error occurred while linking your account",
    );

    navigate(".", { replace: true });
  }, [error, message, navigate]);

  const clearOnboardingStorage = () => {
    removeItemFromSessionStorage("user");
    removeItemFromSessionStorage("imageUrl");
    removeItemFromSessionStorage("bio");
  };

  const finishAccountSetup = ({ includeBio = false } = {}) => {
    login({
      token,
      email: null,
      user: {
        ...user,
        ...(imageUrl && { profileImageUrl: imageUrl }),
        ...(includeBio && bio.trim() && { bio: bio.trim() }),
      },
      otp: null,
      username: null,
    });

    clearOnboardingStorage();
    navigate("/", { replace: true });
  };

  const handleLinkAccount = async (accountType) => {
    if (accountType !== "telegram" && !token) {
      toast.error("Unable to link account. Please try again.");
      return;
    }

    if (accountType === "github" || accountType === "discord" || accountType === "twitter") {
      setLinkingAccount(accountType);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/bind-socials/${accountType}/init`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || `Failed to link ${accountType} account`);
        }
        window.location.href = `${import.meta.env.VITE_BASE_URL}${data.url}`;
      } catch (error) {
        toast.error(error.message);
        setLinkingAccount(null);
      }
      return;
    }

    if (accountType === "telegram") {
      setShowUsernameModal(true);
    }
  };

  const handleTelegramSubmitUsername = async () => {
    const cleanUsername = telegramUsername.trim().replace(/^@/, "");

    if (!cleanUsername) {
      toast.error("Please enter your Telegram username");
      return;
    }

    if (!/^[a-zA-Z0-9_]{5,32}$/.test(cleanUsername)) {
      toast.error(
        "Use 5-32 characters. Letters, numbers, and underscores only.",
      );
      return;
    }

    setLinkingAccount("telegram");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/telegram/init-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: cleanUsername }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`,
        );
        return;
      }

      if (!data?.content?.pendingId) {
        toast.error(data?.message || "Unexpected response from server");
        return;
      }

      setTelegramPendingId(data.content.pendingId);
      setShowUsernameModal(false);
      setShowInstructionModal(true);
    } catch {
      toast.error("Failed to initiate Telegram linking");
    } finally {
      setLinkingAccount(null);
    }
  };

  const handleTelegramVerifyOtp = async () => {
    const cleanOtp = telegramOtp.trim();

    if (!cleanOtp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLinkingAccount("telegram");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/telegram/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: cleanOtp }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (data?.content?.success) {
        toast.success("Telegram account linked successfully");
        handleTelegramCancel();
        window.location.reload();
      } else {
        toast.error(data?.message || "Invalid or expired OTP");
      }
    } catch {
      toast.error("Failed to verify OTP");
    } finally {
      setLinkingAccount(null);
    }
  };

  const handleTelegramCancel = () => {
    setTelegramUsername("");
    setTelegramOtp("");
    setTelegramPendingId(null);
    setLinkingAccount(null);
    setShowUsernameModal(false);
    setShowInstructionModal(false);
    setShowOtpModal(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file || uploading) return;

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

      if (!profileImageUrl) {
        toast.error("Failed to upload profile picture");
        return;
      }

      setImageUrl(profileImageUrl);
      setItemInSessionStorage("imageUrl", profileImageUrl);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      finishAccountSetup();
      return;
    }

    try {
      setSaving(true);

      const res = await updateBio(bio.trim());

      if (!res?.data?.content?.bio) {
        toast.error("Failed to save bio");
        return;
      }

      toast.success("Profile updated");
      finishAccountSetup({ includeBio: true });
    } catch {
      toast.error("Failed to save bio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <UserCog className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Set up your profile
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          Add a profile image, short bio, and linked accounts so projects can
          understand your experience.
        </p>

        {!hasProgress ? (
          <Link
            to="/"
            onClick={() => finishAccountSetup()}
            className="mt-3 inline-flex text-sm font-semibold text-[#2F0FD1] transition hover:text-[#2409B8]"
          >
            Skip for now
          </Link>
        ) : null}
      </div>

      <form onSubmit={handleSaveDetails} className="space-y-5">
        <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Label
              htmlFor="image"
              className="relative mx-auto flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#EAECF0] bg-[#F8FAFC] sm:mx-0"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Selected avatar"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <FaUserLarge className="text-[32px] text-[#B2B9C7]" />
              )}

              <Input
                onChange={handleImageSelect}
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                disabled={uploading}
              />

              <span className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAECF0] bg-white text-[#2F0FD1] shadow-sm">
                {uploading ? (
                  <ImSpinner5 className="animate-spin text-sm" />
                ) : (
                  <FaPlus className="text-sm" />
                )}
              </span>
            </Label>

            <div className="min-w-0 flex-1">
              <Label className="mb-2 block text-sm font-medium text-[#344054]">
                Short bio
              </Label>

              <Textarea
                className="min-h-[96px] resize-none rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-4 focus-visible:ring-[#EEF2FF]"
                placeholder="Briefly tell projects what you do, your skills, and what kind of tasks you prefer."
                onChange={(e) => {
                  setBio(e.target.value);
                  setItemInSessionStorage("bio", e.target.value);
                }}
                value={bio}
                maxLength={240}
              />

              <p className="mt-2 text-xs text-[#98A2B3]">
                {bio.length}/240 characters
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
              <Link2 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#101828]">
                Link social accounts
              </h3>
              <p className="text-xs text-[#667085]">
                Optional, but recommended for contributor credibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ACCOUNTS_TO_LINK.map((account) => {
              const currentLinkedAccount = linkedAccounts.find(
                (acc) => acc.provider === account.key,
              );

              const isLinked = Boolean(currentLinkedAccount);
              const isLinking = linkingAccount === account.key;

              return (
                <div
                  key={account.key}
                  className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 transition hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        {account.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#101828]">
                          {isLinked && currentLinkedAccount?.username
                            ? `@${currentLinkedAccount.username}`
                            : account.title}
                        </p>
                        <p className="text-xs text-[#667085]">
                          {isLinked ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>

                    {loadingAccounts || isLinking ? (
                      <ImSpinner5 className="shrink-0 animate-spin text-[#2F0FD1]" />
                    ) : isLinked ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#027A48]" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLinkAccount(account.key)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F0FD1] shadow-sm transition hover:bg-[#EEF2FF]"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Button
          className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          disabled={
            uploading ||
            saving ||
            (!imageUrl &&
              bio.trim().length === 0 &&
              linkedAccounts.length === 0)
          }
          type="submit"
        >
          {saving ? "Saving..." : "Continue"}
          {!saving ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>
      </form>

      <Modal
        open={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        heading="Link Telegram"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-[#667085]">
            Enter your Telegram username to start the linking process.
          </p>

          <Input
            placeholder="username"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            className="h-11 rounded-xl border-[#EAECF0] bg-white"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleTelegramSubmitUsername}
              disabled={linkingAccount === "telegram"}
              className="flex-1 rounded-xl bg-[#2F0FD1] text-white hover:bg-[#2409B8]"
            >
              {linkingAccount === "telegram" ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowUsernameModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        heading="Enter OTP"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-[#667085]">
            Enter the code sent to your Telegram account.
          </p>

          <Input
            placeholder="123456"
            value={telegramOtp}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setTelegramOtp(e.target.value);
            }}
            className="h-11 rounded-xl border-[#EAECF0] bg-white text-center text-lg font-semibold tracking-[0.35em]"
            maxLength={6}
            inputMode="numeric"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleTelegramVerifyOtp}
              disabled={linkingAccount === "telegram"}
              className="flex-1 rounded-xl bg-[#2F0FD1] text-white hover:bg-[#2409B8]"
            >
              {linkingAccount === "telegram" ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowOtpModal(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
        heading="Link Telegram"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#667085]">
            <p className="font-medium text-[#101828]">Complete these steps:</p>

            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>
                Open the{" "}
                <a
                  href="https://t.me/contributefi_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F0FD1] hover:underline"
                >
                  ContributeFi bot
                </a>
              </li>
              <li>Press /start</li>
              <li>Copy the OTP sent by the bot</li>
            </ol>

            {telegramPendingId ? (
              <p className="mt-3 text-xs text-[#98A2B3]">
                Link request created. Waiting for OTP.
              </p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowInstructionModal(false);
                setShowOtpModal(true);
              }}
              className="flex-1 rounded-xl bg-[#2F0FD1] text-white hover:bg-[#2409B8]"
            >
              Enter OTP
            </Button>

            <Button
              variant="outline"
              onClick={handleTelegramCancel}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AccountSocialConnection;
