import { Outlet } from "react-router-dom";
import { comparisons } from "./data";
import DashboardIntro from "./components/DashboardIntro";
import TopicSelector from "./components/TopicSelector";

export default function DashboardLayout() {
  return (
    <div>
      <DashboardIntro />
      <TopicSelector topics={comparisons} />
      <Outlet />
    </div>
  );
}
