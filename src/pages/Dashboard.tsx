import React, { useState } from "react";
import type { PRRequest } from "./mockData";

function KPICard({ icon, labelAr, labelEn, value, color, onClick }: {
  icon: string; labelAr: string; labelEn: string;
  value: number | string; color: string; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hov ? color : "#D0DFF0"}`,
        borderRadius: 14, padding: "18px 20px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.18s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 24px ${color}22` : "0 2px 8px rgba(21,101,192,0.07)",
        display: "flex", gap: 14, alignItems: "center",
      }}>
      <div style={{
        width: 50, height: 50, borderRadius: 12,
        background: color + "18", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 24, flexShrink: 0, border: `1px solid ${color}33`,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#6B85A3", marginBottom: 2, fontWeight: 600 }}>{labelAr}</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#0D1B2E", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#6B85A3", marginTop: 3 }}>{labelEn}</div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    approved: { bg: "#EDF7F0", color: "#1A7F3C", label: "Approved"    },
    pending:  { bg: "#FEF8E7", color: "#8B5E00", label: "Pending"     },
    review:   { bg: "#E3EEF9", color: "#1565C0", label: "Under Review"},
    rejected: { bg: "#FEF0F0", color: "#B71C1C", label: "Rejected"    },
    draft:    { bg: "#F0F4F9", color: "#6B85A3", label: "Draft"       },
  };
  const c = map[status] || map.draft;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, color: c.color, border: `1px solid ${c.color}44`,
      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
      {c.label}
    </span>
  );
}

function Pri({ p }: { p: string }) {
  const map: Record<string, { color: string; label: string }> = {
    critical: { color: "#CC2222", label: "⚡ Critical" },
    high:     { color: "#C47A00", label: "▲ High"     },
    medium:   { color: "#1565C0", label: "● Medium"   },
    low:      { color: "#6B85A3", label: "▽ Low"      },
  };
  const c = map[p] || map.low;
  return <span style={{ color: c.color, fontSize: 11, fontWeight: 700 }}>{c.label}</span>;
}

interface DashboardProps {
  requests: PRRequest[];
  isLive?: boolean;
  onNavigate?: (k: string, r?: PRRequest) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ requests, isLive = false, onNavigate }) => {

  const total       = requests.length;
  const pending     = requests.filter(r => r.status === "pending").length;
  const underReview = requests.filter(r => r.status === "review").length;
  const approved    = requests.filter(r => r.status === "approved").length;
  const rejected    = requests.filter(r => r.status === "rejected").length;
  const draft       = requests.filter(r => r.status === "draft").length;
  const planned     = requests.filter(r => (r.fundingSource || "").includes("Plan in Budget")).length;
  const unplanned   = requests.filter(r => (r.fundingSource || "").includes("UnPlan")).length;
  const totalVal    = requests.reduce((s, r) => s + (r.amount || 0), 0);

  const byDept = ["Maintenance","Operations","Engineering","Safety","Procurement"].map(d => ({
    d, n: requests.filter(r => r.dept === d).length,
    p: total ? Math.round(requests.filter(r => r.dept === d).length / total * 100) : 0,
  })).filter(x => x.n > 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:26, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0D1B2E", margin:0 }}>لوحة العمليات</h1>
          <p style={{ fontSize:13, color:"#6B85A3", marginTop:4 }}>Operations Dashboard — Shuqaiq Power Plant · 2025</p>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:6, padding:"5px 13px", borderRadius:20,
          background: isLive ? "#EDF7F0" : "#FEF8E7",
          border: `1px solid ${isLive ? "#9DDFB3" : "#F0C843"}`,
          fontSize:11, fontWeight:700, color: isLive ? "#1A7F3C" : "#8B5E00",
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background: isLive ? "#1A7F3C" : "#C47A00" }}/>
          {isLive ? "🟢 Dataverse Live" : "🟡 Mock Data"}
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))", gap:12, marginBottom:14 }}>
        <KPICard icon="📋" labelAr="إجمالي الطلبات"  labelEn="Total Requests"   value={total}       color="#1565C0" onClick={() => onNavigate?.("requests")}  />
        <KPICard icon="⏳" labelAr="قيد الموافقة"     labelEn="Pending Approval" value={pending}     color="#C47A00" onClick={() => onNavigate?.("approvals")} />
        <KPICard icon="🔍" labelAr="قيد المراجعة"     labelEn="Under Review"     value={underReview} color="#7B1FA2" onClick={() => onNavigate?.("approvals")} />
        <KPICard icon="✅" labelAr="معتمدة"            labelEn="Approved"         value={approved}    color="#1A7F3C" onClick={() => onNavigate?.("requests")}  />
        <KPICard icon="✕"  labelAr="مرفوضة"           labelEn="Rejected"         value={rejected}    color="#B71C1C" onClick={() => onNavigate?.("requests")}  />
        <KPICard icon="📝" labelAr="مسودة"             labelEn="Draft"            value={draft}       color="#6B85A3" onClick={() => onNavigate?.("requests")}  />
        <KPICard icon="📅" labelAr="ميزانية مخططة"    labelEn="Planned Budget"   value={planned}     color="#0277BD" onClick={() => onNavigate?.("requests")}  />
        <KPICard icon="⚡" labelAr="ميزانية طارئة"     labelEn="Unplanned Budget" value={unplanned}   color="#E65100" onClick={() => onNavigate?.("requests")}  />
      </div>

      {/* Total Value Banner */}
      <div style={{
        background:"linear-gradient(135deg,#0D47A1,#1565C0)", borderRadius:12,
        padding:"16px 24px", marginBottom:22,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        color:"#fff", boxShadow:"0 4px 16px rgba(13,71,161,0.3)",
      }}>
        <div>
          <div style={{ fontSize:11, opacity:0.8, marginBottom:4, letterSpacing:"0.05em", textTransform:"uppercase" }}>إجمالي القيمة التعاقدية / Total Contract Value</div>
          <div style={{ fontSize:28, fontWeight:900, fontFamily:"monospace" }}>SAR {totalVal.toLocaleString("en-SA",{minimumFractionDigits:2})}</div>
        </div>
        <div style={{ fontSize:42, opacity:0.4 }}>💰</div>
      </div>

      {/* Status Distribution + sidebar */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginBottom:20 }}>
        <div style={{ background:"#fff", border:"1.5px solid #D0DFF0", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 10px rgba(21,101,192,0.06)" }}>
          <div style={{ padding:"13px 18px", borderBottom:"1px solid #D0DFF0", background:"#F8FAFD", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#0D1B2E" }}>توزيع الحالات — Status Distribution</div>
            <button onClick={() => onNavigate?.("requests")}
              style={{ background:"#E3EEF9", border:"1px solid #90BAF5", borderRadius:7, padding:"5px 14px", color:"#1565C0", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              عرض الكل →
            </button>
          </div>
          <div style={{ padding:"16px 18px" }}>
            {[
              { label:"معتمدة / Approved",     n:approved,    color:"#1A7F3C" },
              { label:"قيد الموافقة / Pending", n:pending,     color:"#C47A00" },
              { label:"قيد المراجعة / Review",  n:underReview, color:"#7B1FA2" },
              { label:"مرفوضة / Rejected",      n:rejected,    color:"#B71C1C" },
              { label:"مسودة / Draft",           n:draft,       color:"#6B85A3" },
            ].map(s => (
              <div key={s.label} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:"#2E4A6B", fontWeight:500 }}>{s.label}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:"#6B85A3" }}>{total ? Math.round(s.n/total*100) : 0}%</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#0D1B2E", minWidth:20, textAlign:"right" }}>{s.n}</span>
                  </div>
                </div>
                <div style={{ height:7, background:"#F0F4F9", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${total ? (s.n/total*100) : 0}%`, background:s.color, borderRadius:4, transition:"width 0.5s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* By Dept */}
          <div style={{ background:"#fff", border:"1.5px solid #D0DFF0", borderRadius:14, padding:"16px 18px", flex:1 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#0D1B2E", marginBottom:14, textTransform:"uppercase", letterSpacing:"0.05em" }}>حسب القسم / By Department</div>
            {byDept.map(x => (
              <div key={x.d} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:"#2E4A6B" }}>{x.d}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#0D1B2E" }}>{x.n}</span>
                </div>
                <div style={{ height:5, background:"#F0F4F9", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.max(x.p,3)}%`, background:"linear-gradient(90deg,#1565C0,#42A5F5)", borderRadius:3 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background:"#fff", border:"1.5px solid #D0DFF0", borderRadius:14, padding:"16px 18px" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#0D1B2E", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>إجراءات سريعة</div>
            {[
              { icon:"✦", ar:"طلب جديد",       en:"New Request",    key:"new",       c:"#1565C0" },
              { icon:"✅", ar:"مراجعة المعلقة", en:"Review Pending", key:"approvals", c:"#1A7F3C" },
              { icon:"📋", ar:"جميع الطلبات",   en:"All Requests",   key:"requests",  c:"#5B21B6" },
            ].map(a => (
              <button key={a.key} onClick={() => onNavigate?.(a.key)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#F8FAFD", border:"1.5px solid #D0DFF0", borderRadius:9, cursor:"pointer", width:"100%", marginBottom:7, transition:"all 0.15s", textAlign:"left" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=a.c; e.currentTarget.style.background=a.c+"11"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#D0DFF0"; e.currentTarget.style.background="#F8FAFD"; }}>
                <span style={{ fontSize:17 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:a.c }}>{a.ar}</div>
                  <div style={{ fontSize:10, color:"#6B85A3" }}>{a.en}</div>
                </div>
                <span style={{ marginLeft:"auto", color:a.c }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div style={{ background:"#fff", border:"1.5px solid #D0DFF0", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 10px rgba(21,101,192,0.06)" }}>
        <div style={{ padding:"13px 18px", borderBottom:"1px solid #D0DFF0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#F8FAFD" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#0D1B2E" }}>أحدث الطلبات — Recent Requests</div>
            <div style={{ fontSize:11, color:"#6B85A3", marginTop:2 }}>آخر {Math.min(6,requests.length)} طلبات</div>
          </div>
          <button onClick={() => onNavigate?.("requests")}
            style={{ background:"#E3EEF9", border:"1px solid #90BAF5", borderRadius:7, padding:"6px 14px", color:"#1565C0", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            عرض الكل →
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F8FAFD" }}>
                {["رقم PR","الوصف","المقاول","الأولوية","الحالة","المبلغ SAR"].map(h => (
                  <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:"#6B85A3", borderBottom:"1px solid #D0DFF0", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.slice(0,6).map(r => (
                <tr key={r.id} style={{ borderBottom:"1px solid #F0F4F9", cursor:"pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#E3EEF9")}
                  onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                  onClick={() => onNavigate?.("detail", r)}>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#1565C0" }}>{r.id}</div>
                    <div style={{ fontSize:10, color:"#6B85A3", marginTop:2 }}>{r.date}</div>
                  </td>
                  <td style={{ padding:"11px 14px", maxWidth:200 }}>
                    <div style={{ fontSize:12, color:"#0D1B2E", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.desc}</div>
                    <div style={{ fontSize:10, color:"#6B85A3", marginTop:2 }}>{r.dept}</div>
                  </td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:"#2E4A6B", whiteSpace:"nowrap" }}>{r.contractor}</td>
                  <td style={{ padding:"11px 14px" }}><Pri p={r.priority}/></td>
                  <td style={{ padding:"11px 14px" }}><Badge status={r.status}/></td>
                  <td style={{ padding:"11px 14px", fontFamily:"monospace", fontSize:12, fontWeight:600, color:"#0D1B2E", whiteSpace:"nowrap" }}>{r.amount.toLocaleString("en-SA")}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"#6B85A3", fontSize:13 }}>لا توجد طلبات / No requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
