import React from "react";
import { SC } from "../theme";
import { useLang } from "../context/LanguageContext";
import type { PRRequest } from "./mockData";

interface Props {
  requests: PRRequest[];
  onSelect: (r: PRRequest) => void;
}

export const RequestsList: React.FC<Props> = ({ requests, onSelect }) => {
  const { t, lang } = useLang();
  return (
    <div>
      <p style={{ fontSize:13, color:"#4A5568", marginBottom:20 }}>
        {requests.length} {t("records","سجل")}
      </p>
      <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#F8F9FB" }}>
              {[t("PR No.","رقم الطلب"), t("Date","التاريخ"), t("Requested By","مقدم الطلب"),
                t("Description","الوصف"), t("Unit","الوحدة"), t("Type of Work","نوع العمل"),
                t("Status","الحالة"), t("Total Contract Value (SAR)","إجمالي القيمة (ريال)"), ""].map(h => (
                <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:10, fontWeight:700,
                  color:"#8A96A3", borderBottom:"1px solid #E2E6EA", textTransform:"uppercase",
                  letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map(r => {
              const sc = SC[r.status] ?? SC.draft;
              return (
                <tr key={r.id} style={{ borderBottom:"1px solid #E2E6EA", cursor:"pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F8F9FB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding:"10px 12px", fontFamily:"monospace", fontSize:11, fontWeight:700, color:"#0066CC" }}>{r.id}</td>
                  <td style={{ padding:"10px 12px", fontSize:11, color:"#8A96A3", whiteSpace:"nowrap" }}>{r.date}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{r.requester}</div>
                    <div style={{ fontSize:10, color:"#8A96A3" }}>{r.dept}</div>
                  </td>
                  <td style={{ padding:"10px 12px", maxWidth:180 }}>
                    <div style={{ fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.desc}</div>
                    <div style={{ fontSize:10, color:"#8A96A3" }}>{r.contractor}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ fontSize:10, background:"#F8F9FB", border:"1px solid #E2E6EA", borderRadius:4, padding:"2px 8px" }}>{r.unit}</span>
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:11, color:"#4A5568", whiteSpace:"nowrap" }}>{r.workType}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:sc.bg,
                      color:sc.txt, border:`1px solid ${sc.bdr}`, fontSize:10, fontWeight:700,
                      padding:"2px 9px", borderRadius:20, whiteSpace:"nowrap" }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:sc.dot }}/>
                      {sc.label[lang as "en"|"ar"]}
                    </span>
                  </td>
                  <td style={{ padding:"10px 12px", fontFamily:"monospace", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                    SAR {r.amount.toLocaleString()}
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <button onClick={() => onSelect(r)}
                      style={{ background:"#F8F9FB", border:"1px solid #E2E6EA", borderRadius:5, padding:"4px 12px", fontSize:11, cursor:"pointer" }}>
                      {t("View","عرض")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
