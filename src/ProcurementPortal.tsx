import { useState, useEffect } from "react";
import { LanguageProvider }  from "./context/LanguageContext";
import { UserProvider }      from "./context/UserContext";
import { Layout }            from "./components/Layout";
import { Dashboard }         from "./pages/Dashboard";
import { RequestsList }      from "./pages/Requests";
import { NewRequestWizard }  from "./pages/NewRequestWizard";
import { ApprovalsView }     from "./pages/ApprovalsView";
import { RequestDetails }    from "./pages/RequestDetails";
import { MOCK_REQUESTS }     from "./pages/mockData";
import { fetchRequests, approveRequest, rejectRequest } from "./services/dataverseService";
import type { PRRequest }    from "./pages/mockData";

export default function ProcurementPortal() {
  const [active,   setActive]   = useState("dashboard");
  const [selected, setSelected] = useState<PRRequest | null>(null);
  const [requests, setRequests] = useState<PRRequest[]>(MOCK_REQUESTS);
  const [isLive,   setIsLive]   = useState(false);

  // Attempt Dataverse on mount; fall back to mock data silently
  useEffect(() => {
    fetchRequests()
      .then(data => { if (data.length > 0) { setRequests(data); setIsLive(true); } })
      .catch(() => {});
  }, []);

  const navigate = (key: string, req?: PRRequest) => {
    if (req) {
      // Always use the latest version from the requests array
      const latest = requests.find(r => r.id === req.id) ?? req;
      setSelected(latest);
    }
    setActive(key);
  };

  // Optimistically update local state, then persist to Dataverse
  const handleApprove = async (id: string) => {
    const apply = (r: PRRequest): PRRequest =>
      r.id === id ? { ...r, status: "approved", rejectionReason: undefined } : r;
    setRequests(prev => prev.map(apply));
    setSelected(prev => (prev ? apply(prev) : prev));
    await approveRequest(id);
  };

  const handleReject = async (id: string, reason: string) => {
    const apply = (r: PRRequest): PRRequest =>
      r.id === id ? { ...r, status: "rejected", rejectionReason: reason } : r;
    setRequests(prev => prev.map(apply));
    setSelected(prev => (prev ? apply(prev) : prev));
    await rejectRequest(id, reason);
  };

  // Keep selected in sync with requests after updates
  const currentRequest = selected
    ? (requests.find(r => r.id === selected.id) ?? selected)
    : null;

  return (
    <LanguageProvider>
      <UserProvider>
        <Layout active={active} setActive={(k) => { setActive(k); setSelected(null); }}>

          {active === "dashboard" && (
            <Dashboard requests={requests} isLive={isLive} onNavigate={navigate} />
          )}

          {active === "requests" && !selected && (
            <RequestsList requests={requests} onSelect={(r) => navigate("detail", r)} />
          )}

          {active === "detail" && currentRequest && (
            <RequestDetails
              request={currentRequest}
              onBack={() => { setSelected(null); setActive("requests"); }}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {active === "new" && (
            <NewRequestWizard onDone={() => setActive("dashboard")} />
          )}

          {active === "approvals" && (
            <ApprovalsView
              requests={requests}
              onSelect={(r) => navigate("detail", r)}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

        </Layout>
      </UserProvider>
    </LanguageProvider>
  );
}
