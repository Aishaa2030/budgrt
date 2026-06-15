import React, { useState, useEffect } from "react";
import { SC } from "../theme";
import { useLang } from "../context/LanguageContext";
import { getCurrentUser } from "../services/userService";
import { updateRequestStatus } from "../services/sharepointService";
import type { PRRequest } from "./mockData";

interface Props {
  requests: PRRequest[];
  onSelect: (r: PRRequest) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

function getStepIndex(role: string): number {
  const map: Record<string, number> = {
    "Section Head": 1,
    "Division Manager": 2,
    "Budget Group": 3,
    "TSD Division Manager": 4,
    "SSPP Department Manager": 5,
    "Plant Manager": 5,
  };
  return map[role] ?? 2;
}

export const ApprovalsView: React.FC<Props> = ({ requests, onSelect, onApprove, onReject }) => {
  const { t, lang } = useLang();
  const [rejectTarget, setRejectTarget] = useState<{ id: string; reason: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [adminName, setAdminName] = useState(
    localStorage.getItem("approver_name") || ""
  );
  const [adminRole, setAdminRole] = useState(
    localStorage.getItem("approver_role") || ""
  );
  const [setupOpen, setSetupOpen] = useState(!localStorage.getItem("approver_name"));

  useEffect(() => {
    if (!adminName) {
      getCurrentUser().then(user => {
        if (user) {
          setAdminName(user.displayName);
          localStorage.setItem("approver_name", user.displayName);
        }
      });
    }
  }, []);

  const saveAdmin = () => {
    localStorage.setItem("approver_name", adminName);
    localStorage.setItem("approver_role", adminRole);
    setSetupOpen(false);
  };

  const pending = requests.filter(r => r.status === "pending" || r.status === "review");

  const handleApprove = async (id: string) => {
    const req = pending.find(r => r.id === id);
    setBusy(id);
    if (req?._spId) {
      try {
        await updateRequestStatus(req._spId as number, "approved", "", adminName, getStepIndex(adminRole));
      } catch (e) { console.error("SP update failed:", e); }
    }
    await onApprove(id);
    setBusy(null);
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    if (!rejectTarget.reason.trim()) return;
    setBusy(rejectTarget.id);
    const req = pending.find(r => r.id === rejectTarget.id);
    if (req?._spId) {
      try {
        await updateRequestStatus(req._spId as number, "rejected", rejectTarget.reason.trim(), adminName, getStepIndex(adminRole));
      } catch (e) { console.error("SP update failed:", e); }
    }
    await onReject(rejectTarget.id, rejectTarget.reason.trim());
    setRejectTarget(null);
    setBusy(null);
  };

  return (
    <div>
      {/* Admin Setup Panel */}
      <div style={{
        background: setupOpen ? "#E3EEF9" : "#F8FAFD",
        border: `1.5px solid ${setupOpen ? "#90BAF5" : "#D0DFF0"}`,
        borderRadius: 12, padding: "14px 18px", marginBottom: 20,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", cursor: "pointer"
        }} onClick={() => setSetupOpen(o => !o)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1B2E" }}>
                حساب المعتمد / Approver Account
              </div>
              <div style={{ fontSize: 11, color: "#6B85A3" }}>
                {adminName
                  ? `${adminName} — ${adminRole || "No role set"}`
                  : "Click to set your approver account"}
              </div>
            </div>
          </div>
          <span style={{ color: "#1565C0", fontSize: 13 }}>
            {setupOpen ? "▲ إخفاء" : "▼ تعديل"}
          </span>
        </div>

        {setupOpen && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#2E4A6B",
                textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                الاسم / APPROVER NAME *
              </label>
              <input
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                placeholder="Full name"
                style={{ width: "100%", padding: "9px 13px",
                  background: "#fff", border: "1.5px solid #D0DFF0",
                  borderRadius: 8, fontSize: 13, color: "#0D1B2E",
                  outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = "#1565C0")}
                onBlur={e => (e.target.style.borderColor = "#D0DFF0")}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#2E4A6B",
                textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                الصفة / APPROVER ROLE *
              </label>
              <select
                value={adminRole}
                onChange={e => setAdminRole(e.target.value)}
                style={{ width: "100%", padding: "9px 13px",
                  background: "#fff", border: "1.5px solid #D0DFF0",
                  borderRadius: 8, fontSize: 13, color: adminRole ? "#0D1B2E" : "#9EB3CC",
                  outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
                <option value="">اختر الصفة / Select Role</option>
                <option value="Section Head">Section Head / رئيس القسم</option>
                <option value="Division Manager">Division Manager / مدير الشعبة</option>
                <option value="Budget Group">Budget Group / مجموعة الميزانية</option>
                <option value="TSD Division Manager">TSD Division Manager</option>
                <option value="SSPP Department Manager">SSPP Department Manager</option>
                <option value="Plant Manager">Plant Manager / مدير المحطة</option>
              </select>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
              <button onClick={saveAdmin}
                style={{ background: "#1565C0", border: "none", borderRadius: 8,
                  padding: "10px 24px", color: "#fff", fontSize: 13,
                  fontWeight: 700, cursor: "pointer" }}>
                ✓ حفظ الحساب / Save Account
              </button>
              <button onClick={() => setSetupOpen(false)}
                style={{ background: "#fff", border: "1.5px solid #D0DFF0",
                  borderRadius: 8, padding: "10px 18px", color: "#6B85A3",
                  fontSize: 13, cursor: "pointer" }}>
                إلغاء / Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize:13, color:"#4A5568", marginBottom:20 }}>
        {pending.length} {t("items awaiting action","طلب في انتظار الإجراء")}
      </p>

      {pending.length === 0 && (
        <div style={{ background:"#EDF7F0", border:"1px solid #9DDFB3", borderRadius:10, padding:32, textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A7F3C" }}>
            {t("All caught up","لا توجد طلبات معلقة")}
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {pending.map(r => {
          const sc = SC[r.status] ?? SC.draft;
          const isRejecting = rejectTarget?.id === r.id;
          const isBusy = busy === r.id;

          return (
            <div key={r.id} style={{
              background:"#fff", border:"1px solid #E2E6EA", borderRadius:10,
              boxShadow:"0 1px 4px rgba(0,0,0,0.04)", overflow:"hidden",
            }}>
              {/* Card header */}
              <div style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#0066CC" }}>{r.id}</span>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:sc.bg,
                      color:sc.txt, border:`1px solid ${sc.bdr}`, fontSize:10, fontWeight:700,
                      padding:"2px 9px", borderRadius:20 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:sc.dot }}/>
                      {sc.label[lang as "en"|"ar"]}
                    </span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{r.desc}</div>
                  <div style={{ fontSize:11, color:"#8A96A3" }}>{r.requester} · {r.dept} · {r.contractor}</div>
                  <div style={{ fontSize:11, color:"#8A96A3", marginTop:2 }}>
                    SAR {r.amount.toLocaleString()} · {r.date} · {r.workType}
                  </div>
                </div>

                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={isBusy || isRejecting}
                    style={{
                      background: isBusy ? "#9DDFB3" : "#1A7F3C",
                      border:"none", borderRadius:6, padding:"7px 16px",
                      color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer",
                      opacity: (isBusy || isRejecting) ? 0.6 : 1, transition:"all 0.15s",
                    }}>
                    {isBusy && !isRejecting ? "…" : `✓ ${t("Approve","اعتماد")}`}
                  </button>

                  <button
                    onClick={() => setRejectTarget(isRejecting ? null : { id: r.id, reason: "" })}
                    disabled={isBusy}
                    style={{
                      background: isRejecting ? "#FEE2E2" : "#FEF8E7",
                      border:`1px solid ${isRejecting ? "#F87171" : "#F0C843"}`,
                      borderRadius:6, padding:"7px 14px",
                      color: isRejecting ? "#B71C1C" : "#8B5E00",
                      fontSize:12, cursor:"pointer", opacity: isBusy ? 0.6 : 1,
                      transition:"all 0.15s",
                    }}>
                    {isRejecting ? `✕ ${t("Cancel","إلغاء")}` : `✕ ${t("Reject","رفض")}`}
                  </button>

                  <button
                    onClick={() => onSelect(r)}
                    style={{ background:"#F8F9FB", border:"1px solid #E2E6EA", borderRadius:6, padding:"7px 14px", fontSize:12, cursor:"pointer" }}>
                    {t("View","عرض")} →
                  </button>
                </div>
              </div>

              {/* Inline rejection reason form */}
              {isRejecting && (
                <div style={{
                  borderTop:"1px solid #FED7D7", background:"#FFF5F5",
                  padding:"14px 18px",
                }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#B71C1C", marginBottom:8 }}>
                    {t("Rejection Reason (required):","سبب الرفض (مطلوب):")}
                    {adminName && (
                      <span style={{ fontSize:11, fontWeight:400, color:"#8A96A3", marginLeft:8 }}>
                        — {adminName}{adminRole ? ` (${adminRole})` : ""}
                      </span>
                    )}
                  </div>
                  <textarea
                    autoFocus
                    rows={3}
                    value={rejectTarget!.reason}
                    onChange={e => setRejectTarget(prev => prev ? { ...prev, reason: e.target.value } : prev)}
                    placeholder={t(
                      "Describe why this request is being rejected…",
                      "اذكر سبب رفض هذا الطلب…"
                    )}
                    style={{
                      width:"100%", borderRadius:7, padding:"10px 12px", fontSize:12,
                      border:`1.5px solid ${rejectTarget!.reason.trim() ? "#F87171" : "#E2E6EA"}`,
                      outline:"none", resize:"vertical", lineHeight:1.6, color:"#0D1B2E",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#F87171")}
                    onBlur={e => (e.target.style.borderColor = rejectTarget!.reason.trim() ? "#F87171" : "#E2E6EA")}
                  />
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:10 }}>
                    <button
                      onClick={() => setRejectTarget(null)}
                      style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:6, padding:"7px 16px", fontSize:12, cursor:"pointer", color:"#6B85A3" }}>
                      {t("Cancel","إلغاء")}
                    </button>
                    <button
                      onClick={handleRejectConfirm}
                      disabled={!rejectTarget!.reason.trim() || isBusy}
                      style={{
                        background: !rejectTarget!.reason.trim() ? "#fca5a5" : "#B71C1C",
                        border:"none", borderRadius:6, padding:"7px 20px",
                        color:"#fff", fontSize:12, fontWeight:700,
                        cursor: !rejectTarget!.reason.trim() ? "not-allowed" : "pointer",
                        transition:"all 0.15s",
                      }}>
                      {isBusy ? "…" : `✕ ${t("Confirm Rejection","تأكيد الرفض")}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
