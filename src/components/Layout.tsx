import React, { useState } from "react";
import { COLORS, FONT_FAMILY } from "../theme";
import { useLang } from "../context/LanguageContext";
import { useUser, getInitials, getDisplayName, getDepartment } from "../context/UserContext";

const SELogo = () => (
  <svg viewBox="0 0 1179.71 1019.62" style={{ width:34, height:34, flexShrink:0 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="se-a" x1="407.99" y1="252.18" x2="617.91" y2="529.87" gradientUnits="userSpaceOnUse">
        <stop offset=".56" stopColor="#32c2ff"/><stop offset=".97" stopColor="#0076ff"/>
      </linearGradient>
      <radialGradient id="se-b" cx="325.33" cy="457.96" r="188.97" gradientUnits="userSpaceOnUse">
        <stop offset=".15" stopColor="#0027b9"/><stop offset="1" stopColor="#0080ff"/>
      </radialGradient>
      <linearGradient id="se-c" x1="695.81" y1="553.32" x2="1006" y2="223.13" gradientUnits="userSpaceOnUse">
        <stop offset=".12" stopColor="#00ff86"/><stop offset=".94" stopColor="#0076ff"/>
      </linearGradient>
    </defs>
      <path fill="url(#se-a)" d="M540.31,454.83h-114.53c-75.05,0-117.32-37.86-148.75-80.21h0c16.82,22.93,32.49,51.08,48.13,80.27,9.24,17.26,18.48,34.88,27.92,51.99,36.83,66.74,76.89,102.86,133.7,102.86,45.2,0,86.9-31.35,129.13-101.73,10.17-16.95,20.37-34.83,30.66-53.12,23.49-41.75,47.42-85.59,72.48-125.17h0c-36.58,56.75-77.12,125.12-178.74,125.12Z"/>
      <path fill="url(#se-b)" d="M277.03,374.62c-43.39-59.17-74.88-55.14-87.18-51.12v131.39h135.31c-15.63-29.18-31.31-57.33-48.13-80.27Z"/>
      <path fill="url(#se-c)" d="M719.05,329.71c-25.06,39.59-48.99,83.42-72.48,125.17h343.09v-247.35c-116.04-43.7-188.42-7.68-270.61,122.18Z"/>
  </svg>
);

export const Layout: React.FC<{
  active: string;
  setActive: (key: string) => void;
  children: React.ReactNode;
}> = ({ active, setActive, children }) => {
  const { lang, toggle, t } = useLang();
  const { user, loading } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const isAr = lang === "ar";

  const NAV = [
    { key:"dashboard", icon:"▦",  label: t("Operations Dashboard",      "لوحة العمليات"),   sub: t("Overview","نظرة عامة") },
    { key:"requests",  icon:"📋", label: t("Purchase Requests",         "طلبات الشراء"),    sub: t("All Records","جميع السجلات") },
    { key:"new",       icon:"✦",  label: t("New Purchase Request",      "طلب شراء جديد"),   sub: t("Create New","إنشاء جديد") },
    { key:"approvals", icon:"✅", label: t("Approval Workflow",         "سير الموافقات"),   sub: t("Pending Actions","الإجراءات المعلقة") },
  ];

  const pageTitle = NAV.find(n => n.key === active)?.label ?? t("Operations Dashboard","لوحة العمليات");

  const sidebarWidth = collapsed ? 64 : 240;

  const sidebarStyle: React.CSSProperties = {
    width: sidebarWidth,
    minHeight: "100vh",
    background: "#0A1628",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: isAr ? "auto" : 0,
    right: isAr ? 0 : "auto",
    zIndex: 300,
    boxShadow: isAr
      ? "-3px 0 16px rgba(13,71,161,0.25)"
      : "3px 0 16px rgba(13,71,161,0.25)",
    transition: "width 0.2s ease",
    overflow: "hidden",
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: isAr ? 0 : sidebarWidth,
    marginRight: isAr ? sidebarWidth : 0,
    padding: "28px 34px",
    minHeight: "100vh",
    flex: 1,
    transition: "margin 0.2s ease",
    background: COLORS.background,
  };

  const collapseIcon = isAr
    ? (collapsed ? "◀" : "▶")
    : (collapsed ? "▶" : "◀");

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* ── Sidebar ── */}
      <aside style={sidebarStyle}>
        {/* Logo + collapse button */}
        <div style={{ padding:"18px 12px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {!collapsed && (
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <SELogo/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#FFF", letterSpacing:"0.02em", whiteSpace:"nowrap" }}>
                  Shuqaiq Power Plant
                </div>
                <div style={{ fontSize:10, color:"rgba(168,184,204,0.7)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {t("Purchase Contract Request Portal","بوابة طلبات الشراء تحت العقد الحالي")}
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ display:"flex", justifyContent:"center", width:"100%" }}>
              <SELogo/>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#A8B8CC", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {collapseIcon}
            </button>
          )}
        </div>

        {/* Collapse toggle when collapsed */}
        {collapsed && (
          <div style={{ display:"flex", justifyContent:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:6, width:32, height:24, cursor:"pointer", color:"#A8B8CC", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {collapseIcon}
            </button>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding:"10px 8px", flex:1 }}>
          {NAV.map(item => {
            const isActive = active === item.key;
            return (
              <button key={item.key} onClick={() => setActive(item.key)}
                title={collapsed ? item.label : undefined}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap: collapsed ? 0 : 10,
                  padding: collapsed ? "9px 0" : "9px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius:7, border:"none", cursor:"pointer",
                  marginBottom:2, textAlign:"left", transition:"all 0.15s",
                  background: isActive ? "rgba(30,136,229,0.15)" : "transparent",
                  borderLeft: !isAr && isActive ? "3px solid #1E88E5" : "3px solid transparent",
                  borderRight: isAr && isActive ? "3px solid #1E88E5" : "3px solid transparent",
                  color: isActive ? "#FFF" : "#A8B8CC",
                  fontWeight: isActive ? 600 : 400, fontSize:13,
                  fontFamily: FONT_FAMILY,
                }}>
                <span style={{ fontSize:15 }}>{item.icon}</span>
                {!collapsed && (
                  <div style={{ textAlign: isAr ? "right" : "left" }}>
                    <div>{item.label}</div>
                    <div style={{ fontSize:9, opacity:0.6, marginTop:1 }}>{item.sub}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Language toggle */}
        {!collapsed && (
          <div style={{ padding:"0 12px 8px" }}>
            <button onClick={toggle} style={{ width:"100%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"7px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              🌐 {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        )}

        {/* User */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap: collapsed ? 0 : 8, justifyContent: collapsed ? "center" : "flex-start" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#1565C0,#42A5F5)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>
              {getInitials(getDisplayName(user))}
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#FFF" }}>
                  {loading ? "Loading..." : getDisplayName(user)}
                </div>
                <div style={{ fontSize:10, color:"rgba(168,184,204,0.7)" }}>
                  {loading ? "..." : getDepartment(user)}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={mainStyle}>
        {/* Top header bar */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:28, paddingBottom:20, borderBottom:"1px solid #D0DFF0",
        }}>
          <div>
            <div style={{ fontSize:11, color:"#6B85A3", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              {t("Shuqaiq Power Plant","محطة شقيق للطاقة")}
            </div>
            <div style={{ fontSize:20, fontWeight:900, color:"#0D1B2E" }}>{pageTitle}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={toggle} style={{
              background:"#E3EEF9", border:"1.5px solid #90BAF5", borderRadius:8,
              padding:"7px 16px", color:"#1565C0", fontSize:12, fontWeight:700, cursor:"pointer",
            }}>
              {lang === "en" ? "🌐 العربية" : "🌐 English"}
            </button>
            <div style={{ fontSize:11, color:"#6B85A3" }}>🔔</div>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1565C0,#42A5F5)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>
              {getInitials(getDisplayName(user))}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};
