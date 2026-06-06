import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import NotFound from "./components/NotFound";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyEmail from "./pages/get-started/VerifyEmail";
import Username from "./pages/get-started/Username";
import AccountConfiguration from "./pages/get-started/AccountConfiguration";
import ReactQueryProviders from "./components/ReactQueryProviders";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import GoogleCallback from "./components/GoogleCallback";
import BindEmail from "./pages/get-started/BindEmail";
import CreateWallet from "./pages/get-started/CreateWallet";
import GetStarted from "./pages/get-started/GetStarted";
import WalletCreatedSuccess from "./pages/get-started/WalletCreatedSuccess";
import ContributeApp from "./pages/dashboard/ContributeApp";
import MyApplications from "./pages/dashboard/MyApplications";
import TaskDetails from "./pages/dashboard/TaskDetails";
import ApplyTask from "./pages/dashboard/ApplyTask";
import QuestMarketplace from "./pages/quest/QuestMarketplace";
import { QuestProvider } from "./context/QuestContext";
import QuestDetailPage from "./pages/quest/QuestDetailsPage";
import ApplyQuestPage from "./pages/quest/ApplyQuestPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import SigninWithTwitter from "./pages/get-started/SigninWithTwitter";
import ContributorProfilePage from "./pages/profiles/ContributorProfilePage";
import { AuthProvider } from "./context/AuthContext";
import CreateXQuestPage from "./pages/quest/CreateXQuestPage";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage";
import MyContributions from "./pages/dashboard/MyContributions";
import MyEarnings from "./pages/dashboard/MyEarnings";
import ComingSoonPage from "./pages/quest/ComingSoonPage";

import { SocketFiProvider } from "@socketfi/react";
import { setSocketfiSession } from "./store/socketfiAuthSlice";
import { useWallet } from "./hooks/useWallet";

const FEATURES = {
  tasks: false,
  quests: true,
  questCreate: true,
  leaderboard: false,
  earnings: false,
  contributions: true,
  profile: false,
};

function featureRoute(isLive, Component, comingSoonProps = {}) {
  return isLive
    ? Component
    : function ComingSoonRoute() {
        return <ComingSoonPage {...comingSoonProps} />;
      };
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },

      {
        path: "tasks",
        Component: featureRoute(FEATURES.tasks, ContributeApp, {
          title: "Tasks are coming soon",
          description:
            "Task discovery is being prepared. You can continue using available features for now.",
          badge: "Tasks",
        }),
      },

      {
        path: "quests",
        Component: featureRoute(FEATURES.quests, QuestMarketplace, {
          title: "Quests are coming soon",
          description:
            "Quest discovery is being prepared and will be available soon.",
          badge: "Quests",
        }),
      },

      {
        path: "leaderboard",
        Component: featureRoute(FEATURES.leaderboard, LeaderboardPage, {
          title: "Leaderboard is coming soon",
          description:
            "Contributor rankings are being prepared and will be available soon.",
          badge: "Leaderboard",
        }),
      },

      {
        path: "earnings",
        Component: featureRoute(FEATURES.earnings, MyEarnings, {
          title: "Earnings are coming soon",
          description:
            "Reward tracking and claiming will be available soon. For now, you can continue participating in live opportunities.",
          badge: "Earnings",
        }),
      },

      {
        path: "contributions",
        Component: featureRoute(FEATURES.contributions, MyContributions, {
          title: "Contributions are coming soon",
          description:
            "Your contribution history will appear here once the feature is live.",
          badge: "Contributions",
        }),
      },

      {
        path: "quests/:questId",
        Component: featureRoute(FEATURES.quests, QuestDetailPage, {
          title: "Quest details are coming soon",
          description:
            "Quest detail pages will be available once quests are ready.",
          badge: "Quest details",
        }),
      },

      {
        path: "quests/:questId/submit",
        Component: featureRoute(FEATURES.quests, ApplyQuestPage, {
          title: "Quest submissions are coming soon",
          description:
            "Quest submissions will be available once quests are ready.",
          badge: "Quest submissions",
        }),
      },

      {
        path: "quests/create",
        Component: featureRoute(FEATURES.questCreate, CreateXQuestPage, {
          title: "Quest creation is coming soon",
          description:
            "Quest creation is being prepared. You will be able to launch contributor campaigns soon.",
          badge: "Create quest",
        }),
      },

      {
        path: "quests/create/:questId",
        Component: featureRoute(FEATURES.questCreate, CreateXQuestPage, {
          title: "Quest drafts are coming soon",
          description:
            "Quest draft editing is being prepared and will be available soon.",
          badge: "Quest drafts",
        }),
      },

      {
        path: "quests/:questId/edit",
        Component: featureRoute(FEATURES.questCreate, CreateXQuestPage, {
          title: "Quest editing is coming soon",
          description:
            "Quest editing is being prepared and will be available soon.",
          badge: "Edit quest",
        }),
      },

      {
        path: ":taskId",
        Component: featureRoute(FEATURES.tasks, TaskDetails, {
          title: "Task details are coming soon",
          description:
            "Task detail pages are being prepared and will be available soon.",
          badge: "Task details",
        }),
      },

      {
        path: ":taskId/apply",
        Component: featureRoute(FEATURES.tasks, ApplyTask, {
          title: "Task applications are coming soon",
          description:
            "Task application flows are being prepared and will be available soon.",
          badge: "Task applications",
        }),
      },

      {
        path: "profile",
        Component: featureRoute(FEATURES.profile, ContributorProfilePage, {
          title: "Contributor profiles are coming soon",
          description:
            "Public contributor profiles are being prepared. Your activity will connect here once the feature is live.",
          badge: "Profile",
        }),
      },
    ],
  },

  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { index: true, Component: SigninWithTwitter },
      { path: "auth", Component: GetStarted },
      { path: "verify-email", Component: VerifyEmail },
      { path: "username", Component: Username },
      { path: "bind-email", Component: BindEmail },
      { path: "create-wallet", Component: CreateWallet },
      { path: "wallet-created-success", Component: WalletCreatedSuccess },
      { path: "account-configuration", Component: AccountConfiguration },
    ],
  },

  {
    path: "google",
    Component: AuthLayout,
    children: [
      { index: true, Component: GoogleCallback },
      { path: "*", Component: NotFound },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);

function AppProviders() {
  const dispatch = useDispatch();
  const { closeAuthModal } = useWallet();

  return (
    <PersistGate loading={<>Loading....</>} persistor={persistor}>
      <ReactQueryProviders>
        <QuestProvider>
          <AuthProvider>
            <SocketFiProvider
              config={{
                clientId:
                  import.meta.env.VITE_SOCKETFI_CLIENT_ID ||
                  "test_13113231122211",

                network: import.meta.env.VITE_SOCKETFI_NETWORK || "TESTNET",

                brand: {
                  appName: "Contribute",
                  primaryColor: "#2F0FD1",
                },

                onAuthSuccess: (data) => {
                  console.log("SocketFi session data:", data);

                  if (data?.session) {
                    closeAuthModal();
                    dispatch(
                      setSocketfiSession({
                        userProfile: data.session.userProfile,
                        accessToken: data.session.socketfiAccessToken,
                      }),
                    );
                  }

                  toast.success("SocketFi login successful");
                },

                onTransactionSuccess(result) {
                  console.log(
                    "Transaction result from onTransactionSuccess",
                    result,
                  );
                },

                onError: (error) => {
                  toast.error(error?.message || "SocketFi login failed");
                },
              }}
            >
              <RouterProvider router={router} />
            </SocketFiProvider>
          </AuthProvider>
        </QuestProvider>
      </ReactQueryProviders>
    </PersistGate>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="bottom-right"
      autoClose={2500}
      hideProgressBar
      closeButton={false}
      newestOnTop
      pauseOnHover
      draggable
      toastClassName="!rounded-xl !border !border-[#EAECF0] !bg-white !shadow-lg !text-sm !text-[#101828]"
      bodyClassName="!p-3"
    />

    <Provider store={store}>
      <AppProviders />
    </Provider>
  </StrictMode>,
);
