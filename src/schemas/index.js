import { validateUrl } from "@/utils";
import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const ConnectWithEmailSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const BindEmailSchema = z.object({
  email: z.string().min(1, "Email is required"),
});

export const VerifyEmailSchema = z.object({
  otp: z
    .string()
    .nonempty("OTP is required")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const UsernameSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
});

const urlSchema = (message) =>
  z
    .string()
    .trim()
    .nonempty(message)
    .transform((val) => (val.startsWith("http") ? val : `https://${val}`))
    .refine(validateUrl, { message });

const optionalUrlSchema = (message) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    urlSchema(message).optional(),
  );

export const CreateCommunitySchema = z.object({
  communityName: z.string().nonempty("Community name is required"),
  communityUsername: z
    .string()
    .nonempty("Community username is required")
    .min(6, "Community must be at least 6 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  websitePage: urlSchema("Enter a valid Website URL"),
  githubPage: optionalUrlSchema("Enter a valid GitHub URL"),
  twitterPage: optionalUrlSchema("Enter a valid Twitter URL"),
  instagramPage: optionalUrlSchema("Enter a valid Instagram URL"),
  communityDescription: z.string().optional(),
});

const numberOrNullSchema = z.preprocess(
  (val) => (val === undefined || val === "" || Number.isNaN(val) ? null : val),
  z.number().nullable(),
);

const GrowthTaskSchema = z.object({
  type: z
    .string()
    .nonempty("Task type is required")
    .refine(
      (val) =>
        [
          "Post on Twitter",
          "Follow on Twitter",
          "Comment on Twitter",
          "Like Tweet",
          "Post on Discord",
          "Join Telegram Channel",
          "Post on Telegram Group",
        ].includes(val),
      { message: "Invalid task type" },
    ),
  tokensPerTask: numberOrNullSchema,
  pointsPerTask: numberOrNullSchema,
  twitterUrl: optionalUrlSchema("Invalid Twitter URL"),
  tweetUrl: optionalUrlSchema("Invalid Tweet URL"),
  discordLink: optionalUrlSchema("Invalid Discord invite link"),
  telegramLink: optionalUrlSchema("Invalid Telegram link"),
  telegramGroupLink: optionalUrlSchema("Invalid Telegram group link"),

  channelId: z.string().nullish(),
  keywordValidation: z.string().nullish(),
});

export const CreateBurstSchema = z
  .object({
    burstTitle: z.string().nonempty("Burst title is required"),
    platform: z
      .string({ required_error: "Platform is required" })
      .min(1, "Platform is required"),
    selectionMethod: z
      .string({ required_error: "Selection method is required" })
      .min(1, "Selection method is required"),
    numberOfSelections: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === "" ? undefined : Number(val)))
      .refine((val) => val !== undefined, {
        message: "Number of selections is required",
      })
      .pipe(z.number().min(1)),
    tokenContract: z.string().nonempty("Token contract is required"),
    conversation: z.string().nonempty("Conversation is required"),
    tokensForWinner: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === "" ? undefined : Number(val)))
      .refine((val) => val !== undefined, {
        message: "Number of tokens for winner is required",
      })
      .pipe(z.number().min(1)),
    sentimentCheck: z.string().min(1, "Sentiment check is required"),
    requireImage: z.boolean().default(false),
    referenceImages: z
      .union([z.array(z.string()), z.any()])
      .optional()
      .refine((files) => {
        if (!files || !Array.isArray(files)) return true;
        return files.length <= 3;
      }, "Maximum 3 images allowed"),
  })
  .refine(
    (data) => {
      const files = data.referenceImages;
      const len = Array.isArray(files) ? files.length : 0;
      return !data.requireImage || len > 0;
    },
    {
      message: "Please upload at least 1 reference image",
      path: ["referenceImages"],
    },
  );

export const CompleteBurstCreateSchema = z
  .object({
    startDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    endDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    trendAge: z
      .string({ required_error: "Post start time is required" })
      .min(1, "Post start time is required"),
    autoPostSelected: z.boolean().default(false),
    aiCheckSelected: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date is required",
        code: "custom",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date must be greater than or equal to today",
        code: "custom",
      });
    }

    if (!data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date is required",
        code: "custom",
      });
    }

    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: "custom",
      });
    }
  });

export const CreateGrowthQuestSchema = z
  .object({
    questTitle: z.string().nonempty("Quest title is required"),
    questDescription: z.string().nonempty("Description is required"),
    rewardType: z
      .string()
      .nonempty("Reward type is required")
      .refine((val) => ["Token", "Points"].includes(val), {
        message: "Invalid reward type",
      }),
    tokenContract: z.string().nullish(),
    numberOfWinners: numberOrNullSchema,
    winnerSelectionMethod: z.string().nullish(),
    runContinuously: z.boolean().default(false),
    makeConcurrent: z.boolean().default(false),
    rewardAllWithPoints: z.boolean().default(false),
    startDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    endDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    rewardMode: z
      .string()
      .nullish()
      .refine((val) => val !== null && val.length > 0, {
        message: "Reward mode is required",
      })
      .refine(
        (val) => val === "Overall Reward" || val === "Individual Task Reward",
        {
          message: "Invalid reward mode",
        },
      ),
    tokensPerWinner: numberOrNullSchema,
    pointsPerWinner: numberOrNullSchema,
    extraPoints: numberOrNullSchema,
    tasks: z.array(GrowthTaskSchema).nonempty("At least one task is required"),
  })
  .superRefine((data, ctx) => {
    if (data.rewardType === "Token") {
      if (!data.tokenContract || data.tokenContract.trim() === "") {
        ctx.addIssue({
          path: ["tokenContract"],
          message: "Token contract is required",
          code: "custom",
        });
      }

      if (
        !data.winnerSelectionMethod ||
        data.winnerSelectionMethod.trim() === ""
      ) {
        ctx.addIssue({
          path: ["winnerSelectionMethod"],
          message: "Winner selection method is required",
          code: "custom",
        });
      }

      if (!data.numberOfWinners) {
        ctx.addIssue({
          path: ["numberOfWinners"],
          message: "Number of winners is required",
          code: "custom",
        });
      } else if (data.numberOfWinners < 0) {
        ctx.addIssue({
          path: ["numberOfWinners"],
          message: "Number of winners cannot be negative",
          code: "custom",
        });
      }
    }

    if (data.rewardAllWithPoints) {
      if (!data.extraPoints) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value is required",
          code: "custom",
        });
      } else if (data.extraPoints < 0) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value cannot be negative",
          code: "custom",
        });
      }
    }

    if (!data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date is required",
        code: "custom",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date must be greater than or equal to today",
        code: "custom",
      });
    }

    if (!data.runContinuously) {
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
          code: "custom",
        });
      }
    }

    if (
      !data.runContinuously &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: "custom",
      });
    }

    if (data.rewardMode === "Overall Reward") {
      if (data.rewardType === "Token" && !data.tokensPerWinner) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner is required",
          code: "custom",
        });
      } else if (data.tokensPerWinner < 0) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner cannot be negative",
          code: "custom",
        });
      }

      if (data.rewardType === "Points" && !data.pointsPerWinner) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner is required",
          code: "custom",
        });
      } else if (data.pointsPerWinner < 0) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner cannot be negative",
          code: "custom",
        });
      }
    }

    data.tasks.forEach((task, index) => {
      const taskPath = ["tasks", index];

      if (data.rewardMode === "Individual Task Reward") {
        if (data.rewardType === "Token") {
          if (!task.tokensPerTask) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task is required",
              code: "custom",
            });
          } else if (task.tokensPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task cannot be negative",
              code: "custom",
            });
          }
        }

        if (data.rewardType === "Points") {
          if (!task.pointsPerTask) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task is required",
              code: "custom",
            });
          } else if (task.pointsPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task cannot be negative",
              code: "custom",
            });
          }
        }
      }

      switch (task.type) {
        case "Follow on Twitter":
          if (!task.twitterUrl) {
            ctx.addIssue({
              path: [...taskPath, "twitterUrl"],
              message: "Twitter URL is required",
              code: "custom",
            });
          }
          break;

        case "Like Tweet":
        case "Comment on Twitter":
          if (!task.tweetUrl) {
            ctx.addIssue({
              path: [...taskPath, "tweetUrl"],
              message: "Tweet URL is required",
              code: "custom",
            });
          }
          break;

        case "Post on Discord":
          if (!task.discordLink) {
            ctx.addIssue({
              path: [...taskPath, "discordLink"],
              message: "Discord invite link is required",
              code: "custom",
            });
          }
          if (!task.channelId) {
            ctx.addIssue({
              path: [...taskPath, "channelId"],
              message: "Channel ID is required",
              code: "custom",
            });
          }
          break;

        case "Join Telegram Channel":
          if (!task.telegramLink) {
            ctx.addIssue({
              path: [...taskPath, "telegramLink"],
              message: "Telegram link is required",
              code: "custom",
            });
          }
          break;

        case "Post on Telegram Group":
          if (!task.telegramGroupLink) {
            ctx.addIssue({
              path: [...taskPath, "telegramGroupLink"],
              message: "Telegram group link is required",
              code: "custom",
            });
          }
          break;
      }
    });
  });

const OnChainTaskSchema = z.object({
  function: z.string().min(1, "Function name is required"),
  description: z.string().min(1, "Task description is required"),
  link: optionalUrlSchema("Enter a valid link"),
  tokensPerTask: numberOrNullSchema,
  pointsPerTask: numberOrNullSchema,
});

export const CreateOnChainQuestSchema = z
  .object({
    questTitle: z.string().nonempty("Quest title is required"),
    questDescription: z.string().nonempty("Description is required"),
    rewardType: z
      .string()
      .nonempty("Reward type is required")
      .refine((val) => ["Token", "Points"].includes(val), {
        message: "Invalid reward type",
      }),
    networkType: z
      .string()
      .nonempty("Network type is required")
      .refine((val) => ["TESTNET", "PUBLIC"].includes(val), {
        message: "Invalid network type",
      }),
    tokenContract: z.string().nullish(),
    numberOfWinners: numberOrNullSchema,
    winnerSelectionMethod: z.string().nullish(),
    runContinuously: z.boolean().default(false),
    makeConcurrent: z.boolean().default(false),
    rewardAllWithPoints: z.boolean().default(false),
    startDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    endDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.date().nullable(),
    ),
    verificationMode: z
      .string()
      .nullish()
      .refine((val) => val !== null && val.length > 0, {
        message: "Verification mode is required",
      })
      .refine(
        (val) =>
          val === "Contract Invocation" || val === "Observe Account Calls",
        {
          message: "Invalid reward mode",
        },
      ),
    rewardMode: z
      .string()
      .nullish()
      .refine((val) => val !== null && val.length > 0, {
        message: "Reward mode is required",
      })
      .refine(
        (val) => val === "Overall Reward" || val === "Individual Task Reward",
        {
          message: "Invalid reward mode",
        },
      ),
    tokensPerWinner: numberOrNullSchema,
    pointsPerWinner: numberOrNullSchema,
    extraPoints: numberOrNullSchema,
    contractAddress: z.string().nonempty("Contract address is required"),
    callerAccountId: z.string().nullish(),
    tasks: z.array(OnChainTaskSchema).min(1, "At least one task is required"),
  })
  .superRefine((data, ctx) => {
    if (data.rewardType === "Token") {
      if (!data.tokenContract || data.tokenContract.trim() === "") {
        ctx.addIssue({
          path: ["tokenContract"],
          message: "Token contract is required",
          code: "custom",
        });
      }

      if (
        !data.winnerSelectionMethod ||
        data.winnerSelectionMethod.trim() === ""
      ) {
        ctx.addIssue({
          path: ["winnerSelectionMethod"],
          message: "Winner selection method is required",
          code: "custom",
        });
      }

      if (!data.numberOfWinners) {
        ctx.addIssue({
          path: ["numberOfWinners"],
          message: "Number of winners is required",
          code: "custom",
        });
      } else if (data.numberOfWinners < 0) {
        ctx.addIssue({
          path: ["numberOfWinners"],
          message: "Number of winners cannot be negative",
          code: "custom",
        });
      }
    }

    if (data.rewardAllWithPoints) {
      if (!data.extraPoints) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value is required",
          code: "custom",
        });
      } else if (data.extraPoints < 0) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value cannot be negative",
          code: "custom",
        });
      }
    }

    if (!data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date is required",
        code: "custom",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start date must be greater than or equal to today",
        code: "custom",
      });
    }

    if (!data.runContinuously) {
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
          code: "custom",
        });
      }
    }

    if (
      !data.runContinuously &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: "custom",
      });
    }

    if (data.rewardMode === "Overall Reward") {
      if (data.rewardType === "Token" && !data.tokensPerWinner) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner is required",
          code: "custom",
        });
      } else if (data.tokensPerWinner < 0) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner cannot be negative",
          code: "custom",
        });
      }

      if (data.rewardType === "Points" && !data.pointsPerWinner) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner is required",
          code: "custom",
        });
      } else if (data.pointsPerWinner < 0) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner cannot be negative",
          code: "custom",
        });
      }
    }

    if (
      data.verificationMode === "Observe Account Calls" &&
      !data.callerAccountId
    ) {
      ctx.addIssue({
        path: ["callerAccountId"],
        message: "Caller account ID is required",
        code: "custom",
      });
    }

    data.tasks.forEach((task, index) => {
      const taskPath = ["tasks", index];

      if (data.rewardMode === "Individual Task Reward") {
        if (data.rewardType === "Token") {
          if (!task.tokensPerTask) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task is required",
              code: "custom",
            });
          } else if (task.tokensPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task cannot be negative",
              code: "custom",
            });
          }
        }

        if (data.rewardType === "Points") {
          if (!task.pointsPerTask) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task is required",
              code: "custom",
            });
          } else if (task.pointsPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task cannot be negative",
              code: "custom",
            });
          }
        }
      }
    });
  });

const LinkSchema = z.object({
  name: z.string().min(1, "Link name is required"),
  url: urlSchema("Enter a valid URL"),
});

const TechnicalTaskSchema = z.object({
  description: z.string().min(1, "Task description is required"),
  instruction: z.string().min(1, "Task instruction is required"),
  links: z.array(LinkSchema).max(5, "Maximum 5 links"),
  tokensPerTask: numberOrNullSchema,
  pointsPerTask: numberOrNullSchema,
});

export const CreateTechnicalQuestSchema = z
  .object({
    questTitle: z.string().nonempty("Quest title is required"),
    questDescription: z.string().nonempty("Description is required"),
    questType: z
      .string()
      .nonempty("Quest type is required")
      .refine((val) => ["Design", "Development"].includes(val), {
        message: "Invalid quest type",
      }),
    rewardType: z
      .string()
      .nonempty("Reward type is required")
      .refine((val) => ["Token", "Points"].includes(val), {
        message: "Invalid reward type",
      }),
    tokenContract: z.string().nullish(),
    questGoal: z
      .string()
      .nullish()
      .refine((val) => val !== null && val.length > 0, {
        message: "Quest goal is required",
      })
      .refine(
        (val) => val === "Project-based" || val === "Recruit Candidates",
        {
          message: "Invalid quest goal",
        },
      ),
    questVisibility: z.string().nullish(),
    candidateListFile: z.instanceof(File).optional().or(z.literal(null)),
    numberOfPeople: numberOrNullSchema,
    selectionMethod: z.string().nullish(),
    rewardMode: z
      .string()
      .nullish()
      .refine((val) => val !== null && val.length > 0, {
        message: "Reward mode is required",
      })
      .refine(
        (val) => val === "Overall Reward" || val === "Individual Task Reward",
        {
          message: "Invalid reward mode",
        },
      ),
    tokensPerWinner: numberOrNullSchema,
    pointsPerWinner: numberOrNullSchema,
    rewardAllWithPoints: z.boolean().default(false),
    extraPoints: numberOrNullSchema,
    tasks: z.array(TechnicalTaskSchema).min(1, "At least one task is required"),
  })
  .superRefine((data, ctx) => {
    if (data.rewardType === "Token") {
      if (!data.tokenContract || data.tokenContract.trim() === "") {
        ctx.addIssue({
          path: ["tokenContract"],
          message: "Token contract is required",
          code: "custom",
        });
      }
    }

    if (
      data.questGoal === "Project-based" ||
      (data.questGoal === "Recruit Candidates" &&
        data.questVisibility === "Open Quest")
    ) {
      if (!data.selectionMethod || data.selectionMethod.trim() === "") {
        ctx.addIssue({
          path: ["selectionMethod"],
          message: "Selection method is required",
          code: "custom",
        });
      }

      if (!data.numberOfPeople) {
        ctx.addIssue({
          path: ["numberOfPeople"],
          message: "Number of people is required",
          code: "custom",
        });
      } else if (data.numberOfPeople < 0) {
        ctx.addIssue({
          path: ["numberOfPeople"],
          message: "Number of people cannot be negative",
          code: "custom",
        });
      }
    }

    if (data.rewardAllWithPoints) {
      if (!data.extraPoints) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value is required",
          code: "custom",
        });
      } else if (data.extraPoints < 0) {
        ctx.addIssue({
          path: ["extraPoints"],
          message: "Extra points value cannot be negative",
          code: "custom",
        });
      }
    }

    if (data.rewardMode === "Overall Reward") {
      if (data.rewardType === "Token" && !data.tokensPerWinner) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner is required",
          code: "custom",
        });
      } else if (data.tokensPerWinner < 0) {
        ctx.addIssue({
          path: ["tokensPerWinner"],
          message: "Token per winner cannot be negative",
          code: "custom",
        });
      }

      if (data.rewardType === "Points" && !data.pointsPerWinner) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner is required",
          code: "custom",
        });
      } else if (data.pointsPerWinner < 0) {
        ctx.addIssue({
          path: ["pointsPerWinner"],
          message: "Points per winner cannot be negative",
          code: "custom",
        });
      }
    }

    if (
      data.questGoal === "Recruit Candidates" &&
      data.questVisibility === "Closed Quest" &&
      !data.candidateListFile
    ) {
      ctx.addIssue({
        path: ["candidateListFile"],
        message: "CSV file is required for closed recruitment quests",
        code: "custom",
      });
    }

    data.tasks.forEach((task, index) => {
      const taskPath = ["tasks", index];

      if (data.rewardMode === "Individual Task Reward") {
        if (data.rewardType === "Token") {
          if (!task.tokensPerTask) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task is required",
              code: "custom",
            });
          } else if (task.tokensPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "tokensPerTask"],
              message: "Tokens per task cannot be negative",
              code: "custom",
            });
          }
        }

        if (data.rewardType === "Points") {
          if (!task.pointsPerTask) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task is required",
              code: "custom",
            });
          } else if (task.pointsPerTask < 0) {
            ctx.addIssue({
              path: [...taskPath, "pointsPerTask"],
              message: "Points per task cannot be negative",
              code: "custom",
            });
          }
        }
      }
    });
  });

export const TaskSubmissionSchema = z.object({
  submission: z.string().min(1, "Submission is required"),
});
