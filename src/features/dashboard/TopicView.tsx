import { Navigate, useParams } from "react-router-dom";
import { comparisons } from "./data";
import ComparisonPanel from "./components/ComparisonPanel";
import ArrivedViaSearchBanner from "../../shared/components/ArrivedViaSearchBanner";

export default function TopicView() {
  const { topicId } = useParams<{ topicId: string }>();
  const comparison = comparisons.find((c) => c.id === topicId);

  if (!comparison) {
    return <Navigate to={`/dashboard/topic/${comparisons[0].id}`} replace />; 
  }

  return (
    <div>
      <ArrivedViaSearchBanner />
      <ComparisonPanel comparison={comparison} />
    </div>
  );
}
