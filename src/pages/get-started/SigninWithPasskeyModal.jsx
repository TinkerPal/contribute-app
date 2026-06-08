import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSocketFi } from "@socketfi/react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Link2,
  Loader2,
  ShieldCheck,
  UserCog,
  Wallet,
  X,
} from "lucide-react";
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
import { linkedAccount, updateBio, uploadProfilePicture } from "@/services";

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
  const content = response?.data?.content;

  if (!content) return [];

  if (Array.isArray(content)) {
    if (content.length > 0 && typeof content[0] === "string") {
      return content.map((provider) => ({
        provider: provider.toLowerCase(),
        username: null,
      }));
    }

    return content
      .map((account) => ({
        provider: account?.provider?.toLowerCase(),
        username: account?.username || null,
      }))
      .filter((account) => account.provider);
  }

  if (Array.isArray(content.linkedAccounts)) {
    return content.linkedAccounts.map((provider) => ({
      provider: provider.toLowerCase(),
      username: null,
    }));
  }

  return [];
}

function SigninWithPasskeyModal() {
  const {
    passkeyModalIsOpen,
    setPasskeyModalIsOpen,
    login,
    accessToken: token,
    username,
  } = useAuth();

  const navigate = useNavigate();

  const socketfi = useSocketFi();

  const [view, setView] = useState("passkey");
  const [isLoading, setIsLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(() => getItemFromSessionStorage("user"));

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

  const shouldFetchLinkedAccounts =
    passkeyModalIsOpen && view === "setup" && !!token;

  const {
    data: linkedAccountsData,
    isLoading: loadingAccounts,
    refetch: refetchLinkedAccounts,
  } = useQuery({
    queryKey: ["linkedAccounts", token],
    queryFn: () => linkedAccount(),
    enabled: shouldFetchLinkedAccounts,
  });

  const linkedAccounts = useMemo(
    () => normalizeLinkedAccounts(linkedAccountsData),
    [linkedAccountsData],
  );

  const hasProgress =
    Boolean(imageUrl) || bio.trim().length > 0 || linkedAccounts.length > 0;

  function resetModalState() {
    setView("passkey");
    setIsLoading(false);
    setUploading(false);
    setSaving(false);
    setLinkingAccount(null);
    setTelegramUsername("");
    setTelegramOtp("");
    setTelegramPendingId(null);
    setShowUsernameModal(false);
    setShowInstructionModal(false);
    setShowOtpModal(false);
  }

  function closeModal() {
    if (isLoading || uploading || saving || linkingAccount) return;

    setPasskeyModalIsOpen(false);
    resetModalState();
  }

  function clearOnboardingStorage() {
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
      username: username || null,
    });

    clearOnboardingStorage();
    closeModal();
  }

  async function handlePasskeyLogin() {
    try {
      setIsLoading(true);

      const session = await socketfi.authenticate();

      console.log({ session });

      const socketfiAccessToken =
        session?.session?.socketfiAccessToken || session?.socketfiAccessToken;
      const address =
        session?.session?.address?.PUBLIC || session?.session?.address?.TESTNET;
      const userId = session?.session?.userProfile?.userId;

      if (!socketfiAccessToken) {
        throw new Error("Could not retrieve SocketFi session token");
      }

      const res = await fetch(`${API_URL}/auth/verify-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socketfiAccessToken,
          address,
          userId,
        }),
      });

      const data = await res.json();

      console.log({ data });

      if (!res.ok) {
        throw new Error(
          data?.message || `Authentication failed (${res.status})`,
        );
      }

      const { token: appAccessToken, user: appUser } = data;

      if (!appAccessToken) {
        throw new Error(data?.message || "Authentication verification failed");
      }

      // login({ token: appAccessToken, user: appUser });

      // Save SocketFi wallet/address data to localStorage
      // const { address, userProfile } = session?.session || {};

      localStorage.setItem("socketfiAccessToken", socketfiAccessToken);
      localStorage.setItem("authVerified", "true");

      if (address?.TESTNET) {
        localStorage.setItem("walletAddress_TESTNET", address.TESTNET);
      }
      if (address?.PUBLIC) {
        localStorage.setItem("walletAddress_PUBLIC", address.PUBLIC);
      }
      if (address) {
        localStorage.setItem("walletAddress", JSON.stringify(address));
      }

      // Update AuthContext with the proper app-level token and user
      login({ token: appAccessToken, user: appUser });

      // Set user in local component state for setup flow
      const sessionUser =
        session?.user ||
        session?.userProfile ||
        session?.data?.user ||
        session?.data?.userProfile ||
        appUser ||
        null;

      if (sessionUser) {
        setUser(sessionUser);
        setItemInSessionStorage("user", sessionUser);
      }

      const linkedAccountsFromSession = normalizeLinkedAccounts({
        data: {
          content:
            session?.linkedAccounts ||
            session?.userProfile?.linkedAccounts ||
            session?.user?.linkedAccounts ||
            session?.data?.linkedAccounts ||
            session?.data?.userProfile?.linkedAccounts ||
            session?.data?.user?.linkedAccounts,
        },
      });

      setPasskeyModalIsOpen(false);
      resetModalState();
      navigate("/auth/connect");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Passkey sign-in failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLinkAccount(accountType) {
    if (accountType !== "telegram" && !token) {
      toast.error("Unable to link account. Please try again.");
      return;
    }

    if (
      accountType === "github" ||
      accountType === "discord" ||
      accountType === "twitter"
    ) {
      setLinkingAccount(accountType);
      try {
        const res = await fetch(
          `${API_URL}/api/bind-socials/${accountType}/init`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log({ res });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(
            data?.message || `Failed to link ${accountType} account`,
          );
        }
        setItemInSessionStorage("pendingSocialLink", accountType);
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
      toast.error(
        "Use 5-32 characters. Letters, numbers, and underscores only.",
      );
      return;
    }

    try {
      setLinkingAccount("telegram");

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
      toast.error("Failed to start Telegram linking");
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

    try {
      setLinkingAccount("telegram");

      const response = await fetch(`${API_URL}/auth/telegram/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: cleanOtp }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.content?.success) {
        toast.error(data?.message || "Invalid or expired OTP");
        return;
      }

      toast.success("Telegram account linked successfully");
      handleTelegramCancel();
      await refetchLinkedAccounts();
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

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];

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
  }

  async function handleSaveDetails(event) {
    event.preventDefault();

    if (!bio.trim()) {
      finishAccountSetup();
      return;
    }

    try {
      setSaving(true);

      const response = await updateBio(bio.trim());

      if (!response?.data?.content?.bio) {
        toast.error("Failed to save profile");
        return;
      }

      toast.success("Profile updated");
      finishAccountSetup({ includeBio: true });
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!passkeyModalIsOpen) {
      resetModalState();
    }
  }, [passkeyModalIsOpen]);

  if (!passkeyModalIsOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/45 px-4 backdrop-blur-sm">
        <div className="relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl">
          <button
            type="button"
            onClick={closeModal}
            disabled={
              isLoading || uploading || saving || Boolean(linkingAccount)
            }
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-[#98A2B3] transition hover:bg-[#F2F4F7] hover:text-[#101828] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          {view === "passkey" ? (
            <div className="text-left">
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm">
                  <Fingerprint className="h-5 w-5" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
                  {isLoading ? "Securing your session" : "Welcome back"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
                  {isLoading
                    ? "Complete passkey verification to continue."
                    : "Sign in securely with your passkey."}
                </p>
              </div>

              <div className="grid gap-3">
                <Button
                  onClick={handlePasskeyLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="group h-auto w-full justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm transition hover:border-[#2F0FD1]/30 hover:bg-[#F8FAFF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101828] text-white">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Fingerprint className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#101828]">
                        {isLoading
                          ? "Waiting for passkey..."
                          : "Continue with Passkey"}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 font-normal text-[#667085]">
                        {isLoading
                          ? "A secure SocketFi authentication window is open."
                          : "Secure sign-in powered by SocketFi embedded wallet."}
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#2F0FD1]" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#2F0FD1]" />
                  )}
                </Button>

                <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#2F0FD1] shadow-sm">
                      <Wallet className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#101828]">
                        Embedded wallet included
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#667085]">
                        Your secure SocketFi embedded wallet is created
                        automatically when you sign in with your passkey.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#475467]">
                    <ShieldCheck className="h-4 w-4 text-[#12B76A]" />
                    No seed phrases. No browser extension. Just passkeys.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-left">
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm">
                  <UserCog className="h-5 w-5" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
                  Set up your profile
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
                  Add your profile details and connect at least one social
                  account so projects can verify your contributor identity.
                </p>

                {!hasProgress ? (
                  <button
                    type="button"
                    onClick={() => finishAccountSetup()}
                    className="mt-3 inline-flex text-sm font-semibold text-[#2F0FD1] transition hover:text-[#2409B8]"
                  >
                    Skip for now
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-5">
                <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Label
                      htmlFor="profile-image"
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
                        id="profile-image"
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
                        onChange={(event) => {
                          setBio(event.target.value);
                          setItemInSessionStorage("bio", event.target.value);
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
                        Recommended for contributor credibility.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {ACCOUNTS_TO_LINK.map((account) => {
                      const currentLinkedAccount = linkedAccounts.find(
                        (linked) => linked.provider === account.key,
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
                    loadingAccounts ||
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
            </div>
          )}
        </div>
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
            onChange={(event) => setTelegramUsername(event.target.value)}
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
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "").slice(0, 6);
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
    </>
  );
}

export default SigninWithPasskeyModal;
