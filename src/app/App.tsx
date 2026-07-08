import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import TopNav from "../layout/TopNav";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import TopicView from "../features/dashboard/TopicView";
import { comparisons } from "../features/dashboard/data";
import QuestLayout from "../features/quest/QuestLayout";
import LevelView from "../features/quest/LevelView";
import RequireLevelUnlocked from "../features/quest/RequireLevelUnlocked";
import QuestComplete from "../features/quest/QuestComplete";
import NotFound from "../shared/components/NotFound";
import type { Tab } from "../shared/types/navigation";
import RequireAuth from "../features/auth/RequireAuth";
import AccountPage from "../features/auth/AccountPage";
import LoginPage from "../features/auth/LoginPage";
import { useTheme } from "../contexts/ThemeContext";

const LibraryLayout = lazy(() => import("../features/library/LibraryLayout"));
const DataTablePage = lazy(() => import("../features/library/DataTablePage"));
const ComponentsPage = lazy(() => import("../features/library/ComponentsPage"));

export default function App() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const activeTab: Tab = pathname.startsWith("/quest") ? "game" : "dashboard";

  useEffect(() => {
    document.title = activeTab === "game" ? "Official Quest - JS vs TS" : "Dashboard - JS vs TS";
  }, [activeTab]);

  const backgroundClasses =
    theme === "dark"
      ? "bg-gradient-to-b from-[#2a3a30] to-[#11201a]"
      : "bg-gradient-to-b from-parchmentDark to-parchment";

  return (
    <div className={`min-h-screen overflow-x-hidden ${backgroundClasses}`}>

      <TopNav />

      <div className="max-w-6xl mx-auto px-3 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8">
        <Header />

        <main className="bg-parchment border-2 border-gold rounded-lg p-4 sm:p-6 shadow-xl overflow-hidden">
          <Routes>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to={`topic/${comparisons[0].id}`} replace />} />

              <Route path="topic/:topicId" element={<TopicView />} />
            </Route>

            <Route path="/quest" element={<QuestLayout />}>
              <Route index element={<Navigate to="level/1" replace />} />

              <Route
                path="level/:levelId"
                element={
                  <RequireLevelUnlocked>
                    <LevelView />
                  </RequireLevelUnlocked>
                }
              />
              <Route path="complete" element={<QuestComplete />} />
            </Route>

            <Route
              path="/library"
              element={
                <Suspense fallback={<div className="text-ink/60 text-sm py-8 text-center">Loading...</div>}>
                  <LibraryLayout />
                </Suspense>
              }
            >
              <Route index element={<Navigate to="data-table" replace />} />
              <Route path="data-table" element={<DataTablePage />} />
              <Route path="components" element={<ComponentsPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
