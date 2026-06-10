import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, Link2, UserCog } from "lucide-react";
import { FaDiscord, FaPlus, FaTelegram } from "react-icons/fa";
import { FaSquareXTwitter, FaUserLarge } from "react-icons/fa6";
import { PiGithubLogoFill } from "react-icons/pi";
import { ImSpinner5 } from "react-icons/im";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import {
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  setItemInSessionStorage,
} from "@/lib/utils";
import { linkedAccount, uploadProfilePicture, completeOnboarding } from "@/services";

const API_URL = "http://localhost:4000";

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

function normalizeLinkedAccounts(response) {
  console.log({ response });
  const platformProfiles = response?.data?.platformProfiles;
  if (!platformProfiles) return [];
  if (Array.isArray(platformProfiles)) {
    if (platformProfiles.length > 0 && typeof platformProfiles[0] === "string") {
      return platformProfiles.map((provider) => ({
        provider: provider.toLowerCase(),
        username: null,
      }));
    }
    return platformProfiles
      .map((account) => ({
        provider: account?.provider?.toLowerCase(),
        username: account?.username || account?.providerUsername || null,
      }))
      .filter((account) => account.provider);
  }
  if (Array.isArray(platformProfiles.linkedAccounts)) {
    return platformProfiles.linkedAccounts.map((provider) => ({
      provider: provider.toLowerCase(),
      username: null,
    }));
  }
  return [];
}

function Connect() {
  const { login, accessToken: token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const exchangedRef = useRef(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user] = useState(() => getItemFromSessionStorage("user"));

  const [imageUrl, setImageUrl] = useState(() => getItemFromSessionStorage("imageUrl") || null);

  const [bio, setBio] = useState("");

  const [linkingAccount, setLinkingAccount] = useState(null);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [telegramOtp, setTelegramOtp] = useState("");
  const [telegramPendingId, setTelegramPendingId] = useState(null);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { data: linkedAccountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ["linkedAccounts", token],
    queryFn: () => linkedAccount(),
    enabled: !!token,
  });

  const linkedAccounts = useMemo(
    () => normalizeLinkedAccounts(linkedAccountsData),
    [linkedAccountsData],
  );

  const error = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    if (!error) return;
    toast.error(
      message ? decodeURIComponent(message) : "An error occurred while linking your account",
    );
  }, [error, message]);

  useEffect(() => {
    const bind = searchParams.get("bind");
    const success = searchParams.get("success");
    const code = searchParams.get("code");

    if (!bind || !code) return;
    if (exchangedRef.current) return;
    exchangedRef.current = true;

    if (success === "false") {
      const msg = searchParams.get("error") || `${bind} binding failed`;
      toast.error(decodeURIComponent(msg));
      navigate("/auth/connect", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/bind-socials/exchange`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!data.success) {
          toast.error("Failed to complete account linking.");
          return;
        }

        login({ token: data.token, user: data.user });
        toast.success(`${bind} account linked successfully!`);
      } catch {
        toast.error("Failed to complete account linking.");
      } finally {
        navigate("/auth/connect", { replace: true });
      }
    })();
  }, [searchParams, login, navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]);

  function clearOnboardingStorage() {
    removeItemFromSessionStorage("pendingSocialLink");
    removeItemFromSessionStorage("user");
    removeItemFromSessionStorage("imageUrl");
    removeItemFromSessionStorage("bio");
  }

  function finishAccountSetup({ includeBio = false } = {}) {
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
  }

  async function handleLinkAccount(accountType) {
    if (accountType !== "telegram" && !token) {
      toast.error("Unable to link account. Please try again.");
      return;
    }

    if (accountType === "github" || accountType === "discord" || accountType === "twitter") {
      setLinkingAccount(accountType);
      try {
        const res = await fetch(`${API_URL}/api/bind-socials/${accountType}/init`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.message || `Failed to link ${accountType} account`);
        }
        window.location.href = `${API_URL}${data.url}`;
      } catch (error) {
        toast.error(error.message);
        setLinkingAccount(null);
      }
      return;
    }

    if (accountType === "telegram") {
      setShowUsernameModal(true);
    }
  }

  async function handleTelegramSubmitUsername() {
    const cleanUsername = telegramUsername.trim().replace(/^@/, "");

    if (!cleanUsername) {
      toast.error("Please enter your Telegram username");
      return;
    }

    if (!/^[a-zA-Z0-9_]{5,32}$/.test(cleanUsername)) {
      toast.error("Use 5-32 characters. Letters, numbers, and underscores only.");
      return;
    }

    setLinkingAccount("telegram");

    try {
      const response = await fetch(`${API_URL}/auth/telegram/init-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: cleanUsername }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(
          data?.message || data?.error || `Request failed with status ${response.status}`,
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
  }

  async function handleTelegramVerifyOtp() {
    const cleanOtp = telegramOtp.trim();

    if (!cleanOtp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLinkingAccount("telegram");

    try {
      const response = await fetch(`${API_URL}/auth/telegram/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: cleanOtp }),
      });

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
  }

  function handleTelegramCancel() {
    setTelegramUsername("");
    setTelegramOtp("");
    setTelegramPendingId(null);
    setLinkingAccount(null);
    setShowUsernameModal(false);
    setShowInstructionModal(false);
    setShowOtpModal(false);
  }

  async function handleImageSelect(e) {
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
      const profileImageUrl = response?.data?.data?.profileImageUrl;

      if (!profileImageUrl) {
        toast.error("Failed to upload profile picture");
        return;
      }

      setImageUrl(profileImageUrl);
      setItemInSessionStorage("imageUrl", profileImageUrl);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveDetails(e) {
    e.preventDefault();

    try {
      setSaving(true);
      await completeOnboarding(bio.trim() || undefined);
      finishAccountSetup({ includeBio: !!bio.trim() });
    } catch {
      toast.error("Failed to save bio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-150 items-start justify-center px-4 py-5 sm:items-center sm:py-6">
      <div className="w-full">
        <div className="text-left">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm">
              <UserCog className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[26px]">
              Set up your profile
            </h2>

            <p className="mx-auto mt-2 max-w-107.5 text-sm leading-6 text-[#667085]">
              Add your profile details and connect at least one social account so projects can
              verify your contributor identity.
            </p>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-3">
            <section className="rounded-2xl border border-[#EAECF0] bg-white p-3.5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <Label
                  htmlFor="image"
                  className="relative mx-auto flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#EAECF0] bg-[#F8FAFC] sm:mx-0"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Selected avatar"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <FaUserLarge className="text-[26px] text-[#B2B9C7]" />
                  )}

                  <Input
                    onChange={handleImageSelect}
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />

                  <span className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-xl border border-[#EAECF0] bg-white text-[#2F0FD1] shadow-sm">
                    {uploading ? (
                      <ImSpinner5 className="animate-spin text-xs" />
                    ) : (
                      <FaPlus className="text-xs" />
                    )}
                  </span>
                </Label>

                <div className="min-w-0 flex-1">
                  <Label className="mb-1.5 block text-sm font-medium text-[#344054]">
                    Short bio
                  </Label>

                  <Textarea
                    className="min-h-18 resize-none rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-4 focus-visible:ring-[#EEF2FF]"
                    placeholder="Tell projects what you do, your skills, and preferred tasks."
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                    value={bio}
                    maxLength={240}
                  />

                  <p className="mt-1.5 text-xs text-[#98A2B3]">{bio.length}/240 characters</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#EAECF0] bg-white p-3.5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
                  <Link2 className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#101828]">Link social accounts</h3>
                  <p className="text-xs text-[#667085]">Recommended for contributor credibility.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ACCOUNTS_TO_LINK.map((account) => {
                  const currentLinkedAccount = linkedAccounts.find(
                    (acc) => acc.provider === account.key,
                  );

                  const isLinked = Boolean(currentLinkedAccount);
                  const isLinking = linkingAccount === account.key;

                  return (
                    <div
                      key={account.key}
                      className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-2.5 transition hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
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
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F0FD1] shadow-sm transition hover:bg-[#EEF2FF]"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="sticky bottom-0 -mx-1 bg-white/95 pt-2 pb-1 backdrop-blur">
              <Button
                className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                disabled={
                  uploading ||
                  saving ||
                  (!imageUrl && bio.trim().length === 0 && linkedAccounts.length === 0)
                }
                type="submit"
              >
                {saving ? "Saving..." : "Continue"}
                {!saving ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </div>
          </form>
        </div>

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

        <Modal open={showOtpModal} onClose={() => setShowOtpModal(false)} heading="Enter OTP">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-[#667085]">
              Enter the code sent to your Telegram account.
            </p>

            <Input
              placeholder="123456"
              value={telegramOtp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setTelegramOtp(value);
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
                {linkingAccount === "telegram" ? <ImSpinner5 className="animate-spin" /> : "Verify"}
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
    </div>
  );
}

export default Connect;
