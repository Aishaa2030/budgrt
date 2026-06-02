/* eslint-disable */
import React, { useState } from "react";
import { useLang } from "../context/LanguageContext";

export const AdminPanel: React.FC = () => {
  const { t } = useLang();
  const [view, setView] = useState<string | null>(null);

  const CARDS = [
    { id:"users",     icon:"👥", title:t("Users Management",          "إدارة المستخدمين"),  sub:t("Users, Roles & Departments","المستخدمون والأدوار والأقسام"),        color:"#0066CC" },
    { id:"workflows", icon:"🔀", title:t("Approval Workflows",        "مسارات الموافقة"),   sub:t("Approval Workflows Configuration","إعداد مسارات الموافقة"),          color:"#5B21B6" },
    { id:"tables",    icon:"🗄️", title:t("Data Tables",               "جداول البيانات"),    sub:t("Contractors, Plants, Work Types","المقاولون والمحطات وأنواع الأعمال"),color:"#0F766E" },
    { id:"pdf",       icon:"📄", title:t("PDF Templates",             "قوالب PDF"),         sub:t("PDF Templates & Branding","قوالب وعلامة شركة الكهرباء"),            color:"#B45309" },
    { id:"notif",     icon:"🔔", title:t("Notification Rules",        "قواعد الإشعارات"),   sub:t("Email & Teams Triggers","مشغلات البريد الإلكتروني وتيمز"),           color:"#C2410C" },
    { id:"audit",     icon:"📊", title:t("Audit Log Export",          "سجل المراجعات"),     sub:t("Export Audit Log to Excel / PDF","تصدير السجل إلى Excel / PDF"),     color:"#1A7F3C" },
  ];

  const card = CARDS.find(c => c.id === view);

  if (view && card) {
    return (
      <div>
        <button onClick={() => setView(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:16, color:"#8A96A3" }}>
          ← {t("Back to Administration","العودة للإدارة")}
        </button>
        <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, padding:"20px 24px",
          display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:48, height:48, borderRadius:10, background:card.color+"18",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{card.icon}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800 }}>{card.title}</div>
            <div style={{ fontSize:12, color:"#8A96A3" }}>{card.sub}</div>
          </div>
        </div>
        <div style={{ background:"#EBF3FC", border:"1px solid #90C3F5", borderRadius:8, padding:"14px 18px", fontSize:13, color:"#0066CC" }}>
          ℹ {t("Connect this sub-view to SharePoint / Dataverse via Power Automate.",
               "اربط هذه الشاشة بـ SharePoint / Dataverse عبر Power Automate.")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize:13, color:"#4A5568", marginBottom:24 }}>
        {t("System configuration · Shuqaiq Power Plant Procurement Portal",
           "إعدادات النظام · بوابة طلبات الشراء — محطة شقيق")}
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        {CARDS.map(c => (
          <div key={c.id} style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:12, overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"box-shadow 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)")}>
            <div style={{ height:4, background:c.color }}/>
            <div style={{ padding:"20px 20px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:c.color+"18",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:"#8A96A3" }}>{c.sub}</div>
                </div>
              </div>
              <button onClick={() => setView(c.id)}
                style={{ width:"100%", background:c.color, border:"none", borderRadius:7, padding:"9px 0",
                  color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                {t("Open","فتح")} / Open →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
