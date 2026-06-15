import React, { useState } from "react";
import { COLORS, FONT_FAMILY } from "../theme";
import { useLang } from "../context/LanguageContext";
import { useUser, getInitials, getDisplayName, getDepartment } from "../context/UserContext";
import seLogoEn from "../pages/images/AW_SE_LOGO_PRIM_EN_RGB.svg";
import seLogoAr from "../pages/images/AW_SE_LOGO_PRIM_AR_RGB.svg";

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
    { key:"jcc",       icon:"📜", label: t("Job Completion Certificate","شهادة الإنجاز"),   sub: t("JCC","شهادة الإنجاز") },
    { key:"users",     icon:"👥", label: t("User Management",            "إدارة المستخدمين"), sub: t("Roles & Access","الصلاحيات") },
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
              <img
                src={isAr ? seLogoAr : seLogoEn}
                alt="Saudi Electricity"
                style={{ height:38, width:"auto", flexShrink:0, filter:"brightness(0) invert(1)" }}
              />
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
              <img
                src={isAr ? seLogoAr : seLogoEn}
                alt="Saudi Electricity"
                style={{ height:30, width:"auto", filter:"brightness(0) invert(1)" }}
              />
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
