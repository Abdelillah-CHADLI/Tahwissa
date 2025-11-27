import { useState } from "react";
import RequestCard from "../../components/requests/RequestCard";
import StatsCards from "../../components/requests/StatsCards";
import TabsNavigation from "../../components/requests/TabsNavigation";
import EmptyState from "../../components/requests//EmptyState";
import PageHeader from "../../components/requests//PageHeader";
import { requests } from "../../data/requests";

function RequestsPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Filter requests based on status
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const confirmedRequests = requests.filter((r) => r.status === "confirmed");
  const declinedRequests = requests.filter((r) => r.status === "declined");

  // Define tabs with counts
  const tabs = [
    { id: "all", label: `All (${requests.length})` },
    { id: "pending", label: `Pending (${pendingRequests.length})` },
    { id: "confirmed", label: `Confirmed (${confirmedRequests.length})` },
    { id: "declined", label: `Declined (${declinedRequests.length})` },
  ];

  // Get requests to show based on active tab
  const getRequestsToShow = () => {
    if (activeTab === "all") return requests;
    if (activeTab === "pending") return pendingRequests;
    if (activeTab === "confirmed") return confirmedRequests;
    if (activeTab === "declined") return declinedRequests;
    return requests;
  };

  // Event handlers
  const handleFollowUp = (requestId: string) => {
    console.log("Follow up on request:", requestId);
    alert(`Following up on request ${requestId}`);
  };

  const handleRequestAgain = (requestId: string) => {
    console.log("Request again:", requestId);
    alert(`Creating new request based on ${requestId}`);
  };

  const handleViewDetails = (requestId: string) => {
    console.log("View details for:", requestId);
    alert(`Showing details for ${requestId}`);
  };

  const requestsToShow = getRequestsToShow();


  return (
    <div className="p-6">
      <PageHeader
        title="My Requests"
        description="Track all your tour and guide requests"
      />

      <StatsCards
        pendingCount={pendingRequests.length}
        confirmedCount={confirmedRequests.length}
        declinedCount={declinedRequests.length}
      />

      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div>
        {
          // if there are requests
          requestsToShow.length > 0 ? (
            requestsToShow.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onFollowUp={handleFollowUp}
                onRequestAgain={handleRequestAgain}
                onViewDetails={handleViewDetails}
              />
            ))
          ) :
            // if there are no requests
            (
              <EmptyState activeTab={activeTab} />
            )
        }
      </div>

    </div>

  );
}

export default RequestsPage;

