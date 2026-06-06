import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { SocketFiProvider } from "@socketfi/react";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import NotFound from "./components/NotFound";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyEmail from "./pages/get-started/VerifyEmail";
import Username from "./pages/get-started/Username";
import AccountConfiguration from "./pages/get-started/AccountConfiguration";
import ReactQueryProviders from "./components/ReactQueryProviders";
import { Provider } from "react-redux";
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
import EngageToEarn2 from "./pages/get-started/EngageToEarn2";
import DashboardHome from "./pages/dashboard/DashboardHome";
import SigninWithTwitter from "./pages/get-started/SigninWithTwitter";
import ContributorProfilePage from "./pages/profiles/ContributorProfilePage";
import { AuthProvider } from "./context/AuthContext";
import CreateXQuestPage from "./pages/quest/CreateXQuestPage";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage";
import MyContributions from "./pages/dashboard/MyContributions";
import MyEarnings from "./pages/dashboard/MyEarnings";
// import EngageToEarn from "./pages/get-started/EngageToEarn";

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "tasks", Component: ContributeApp },
      // { index: true, Component: EngageToEarn2 },
      { path: "quests", Component: QuestMarketplace },
      { path: "leaderboard", Component: LeaderboardPage },
      { path: "earnings", Component: MyEarnings },
      { path: "quests/:questId", Component: QuestDetailPage },
      { path: "quests/:questId/submit", Component: ApplyQuestPage },
      { path: "quests/create", Component: CreateXQuestPage },
      { path: "quests/create/:questId", Component: CreateXQuestPage },
      { path: "quests/:questId/edit", Component: CreateXQuestPage },
      { path: "contributions", Component: MyContributions },
      { path: ":taskId", Component: TaskDetails },
      { path: ":taskId/apply", Component: ApplyTask },
      { path: "profile", Component: ContributorProfilePage },
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
      <PersistGate loading={<>Loading....</>} persistor={persistor}>
        <ReactQueryProviders>
          <QuestProvider>
            <AuthProvider>
              <SocketFiProvider
                config={{
                  clientId:
                    import.meta.env.VITE_SOCKETFI_CLIENT_ID || "test_client",
                  network: import.meta.env.VITE_SOCKETFI_NETWORK || "TESTNET",
                  brand: {
                    appName: "Contribute",
                    primaryColor: "#2F0FD1",
                    // logo: "./Coins.svg",
                  },
                  onSuccess: (session) => {
                    console.log("SocketFi session:", session);
                    toast.success("SocketFi login successful");
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
    </Provider>
  </StrictMode>,
);
