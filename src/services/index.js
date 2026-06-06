import api from "@/lib/api";

export function createAccount(data) {
  const requestPayload = {
    method: "EMAIL",
    email: data.email,
    password: data.password,
  };

  return api.post(`${import.meta.env.VITE_BASE_URL}/auth`, requestPayload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function resendOTP(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    email: data.email,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/send-otp`,
    requestPayload,
  );
}

export function bindEmail(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    email: data.email,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/check-email-before-send-otp`,
    requestPayload,
  );
}

export function verifyEmail(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    otpCode: data.otp,
    email: data.email,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
    requestPayload,
  );
}

export function createUsername(data) {
  const requestPayload = {
    username: data.username,
  };

  return api.patch(
    `${import.meta.env.VITE_BASE_URL}/users/username`,
    requestPayload,
  );
}

export function checkUsernameAvailability(username) {
  return api.get(
    `${import.meta.env.VITE_BASE_URL}/users/check-username?username=${username}`,
  );
}

export function createWallet(network) {
  return api.post(`${import.meta.env.VITE_BASE_URL}/auth/create-wallet`, {
    network,
  });
}

export function linkedAccount() {
  return api.get(`${import.meta.env.VITE_BASE_URL}/users/configured-accounts`);
}

export function getUser() {
  return api.get(`${import.meta.env.VITE_BASE_URL}/users/user`);
}

export function linkGithub() {
  return api.get(`${import.meta.env.VITE_BASE_URL}/auth/github`, {});
}

export function connectWithEmail(data) {
  const requestPayload = {
    method: "EMAIL",
    email: data.email,
    password: data.password,
  };

  return api.post(`${import.meta.env.VITE_BASE_URL}/auth`, requestPayload);
}

export function initiateWalletChallenge(publicKey, network) {
  return api.post(`${import.meta.env.VITE_BASE_URL}/auth/init-wallet`, {
    publicKey,
    network,
  });
}

export function verifyWalletChallenge(signedChallengeXdr, publicKey, network) {
  return api.post(`${import.meta.env.VITE_BASE_URL}/auth/`, {
    method: "WALLET",
    signedChallengeXdr,
    publicKey,
    network,
  });
}

export function createCommunity(data) {
  const requestPayload = {
    communityName: data.communityName,
    communityAlias: data.communityUsername,
    communityDescription: data.communityDescription,
    communityVisibility: "public",
    communityLinks: [
      { title: "Website", url: data.websitePage },
      { title: "GitHub", url: data.githubPage },
      { title: "Twitter", url: data.twitterPage },
      { title: "Instagram", url: data.instagramPage },
    ],
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/communities`,
    requestPayload,
  );
}

export function createGrowthQuest(payload, communityId) {
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/${communityId}/growth`,
    payload,
  );
}

export function completeTask(payload, taskId) {
  console.log({ payload, taskId });
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/tasks/${taskId}/complete`,
    payload,
  );
}

export function createOnChainQuest(payload, communityId) {
  console.log({ payload, communityId });
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/${communityId}/on-chain`,
    payload,
  );
}

export function loadContractSpec(payload) {
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/load-contract-spec`,
    payload,
  );
}

export function createTechnicalQuest(payload, communityId) {
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/${communityId}/technical`,
    payload,
  );
}

export const getCommunities = async ({
  limit = 10,
  offset = 1,
  sort = "DESC",
  communityOwnerId = "",
  searchValue = "",
} = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/communities?sortBy=createdAt:${sort}&limit=${limit}&offset=${offset}&${searchValue !== "" ? `communityName=${searchValue}` : ""}&${communityOwnerId !== "" ? `communityOwnerId=${communityOwnerId} ` : ""}`,
  );

  return data.content;
};

export const getQuests = async ({
  limit = 10,
  offset = 1,
  sort = "DESC",
  isActive,
} = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/quests?sortBy=createdAt:${sort}&limit=${limit}&offset=${offset}&${isActive ? `isActive=${isActive}` : ""}`,
  );

  return data.content;
};

export const getQuestsByCommunity = async ({
  limit = 10,
  offset = 1,
  sort = "DESC",
  communityId,
} = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/quests/community/${communityId}?sortBy=createdAt:${sort}&limit=${limit}&offset=${offset}`,
  );

  return data.content;
};

export const getQuest = async (taskId) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/quests/${taskId}`,
  );

  return data.content;
};

export const getMemberCommunities = async ({ limit = 10, offset = 1 } = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/members/my-communities?includeRemoved=false&limit=${limit}&offset=${offset}`,
  );

  return data.content;
};

export const getCommunity = async (communityId) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/communities/${communityId}`,
  );

  return data.content;
};

export function joinCommunity(communityId) {
  const requestPayload = {
    communityId,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/members/join`,
    requestPayload,
  );
}

export function leaveCommunity(communityId, memberId) {
  const requestPayload = {
    memberId,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/members/leave/${communityId}`,
    requestPayload,
  );
}

export const uploadProfilePicture = (file) => {
  const formData = new FormData();

  formData.append("image", file);

  return api.patch(
    `${import.meta.env.VITE_BASE_URL}/users/upload-profile-picture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const uploadCommunityCover = (file, communityId) => {
  const formData = new FormData();

  formData.append("image", file);

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/communities/upload-logo-cover/${communityId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const uploadBurstImage = (file) => {
  const formData = new FormData();
  formData.append("images", file);

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/bursts/upload-images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const createBurst = (data) => {
  return api.post(`${import.meta.env.VITE_BASE_URL}/bursts`, data);
};

export const getBursts = ({
  limit = 10,
  offset = 1,
  sort = "DESC",
  filter = "all",
} = {}) => {
  return api.get(
    `${import.meta.env.VITE_BASE_URL}/bursts?sortBy=createdAt:${sort}&limit=${limit}&offset=${offset}&filter=${filter}`,
  );
};

export const getBurst = async (burstId) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/bursts/${burstId}`,
  );

  return data.content;
};

export const updateBio = (bio) => {
  return api.patch(`${import.meta.env.VITE_BASE_URL}/users/update-profile`, {
    bio,
  });
};

export function initSignTransaction(data) {
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/init-sign-transaction`,
    data,
  );
}

export function submitTransactionExternal(data) {
  return api.post(
    `${import.meta.env.VITE_BASE_URL}/quests/submit-transaction-external`,
    data,
  );
}
