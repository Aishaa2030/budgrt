import React, { useRef, useCallback, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { SC } from "../theme";
import { useLang } from "../context/LanguageContext";
import { PrintTemplate } from "../components/PrintTemplate";
import type { PRRequest } from "./mockData";

interface Props {
  request: PRRequest;
  onBack: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export const RequestDetails: React.FC<Props> = ({ request: r, onBack, onApprove, onReject }) => {
  const { t, lang } = useLang();
  const total = r.scopeRows.reduce((s, row) => s + (parseFloat(row.cost) || 0), 0);
  const sc = SC[r.status] ?? SC.draft;

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const canDecide = (r.status === "pending" || r.status === "review") && (onApprove || onReject);

  const handleApprove = async () => {
    if (!onApprove) return;
    setBusy(true);
    await onApprove(r.id);
    setBusy(false);
  };

  const handleRejectConfirm = async () => {
    if (!onReject || !rejectReason.trim()) return;
    setBusy(true);
    await onReject(r.id, rejectReason.trim());
    setShowRejectForm(false);
    setRejectReason("");
    setBusy(false);
  };

  // ── Print / PDF ────────────────────────────────────────────────────────────
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${r.id} — Shuqaiq Purchase Request`,
    pageStyle: `
      @page { size: A4 landscape; margin: 7mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });
  const onPrintClick = useCallback(() => handlePrint(), [handlePrint]);

  return (
    <div style={{ maxWidth:960 }}>

      {/* Hidden print template */}
      <div style={{ position:"absolute", left:"-9999px", top:0 }}>
        <PrintTemplate ref={printRef} request={r}/>
      </div>

      {/* ── Back ── */}
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", marginBottom:16, fontSize:13, color:"#8A96A3" }}>
        ← {t("Back","رجوع")}
      </button>

      {/* ── Action bar ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: showRejectForm ? 10 : 20, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4, flexWrap:"wrap" }}>
            <h1 style={{ fontSize:18, fontWeight:800, fontFamily:"monospace", margin:0 }}>{r.id}</h1>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:sc.bg,
              color:sc.txt, border:`1px solid ${sc.bdr}`, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot }}/>
              {sc.label[lang as "en"|"ar"]}
            </span>
          </div>
          <p style={{ fontSize:12, color:"#4A5568", margin:0 }}>{r.desc} — {r.contractor}</p>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {/* Approve / Reject — only visible when decision is possible */}
          {canDecide && (
            <>
              <button
                onClick={handleApprove}
                disabled={busy || showRejectForm}
                style={{
                  background:"#1A7F3C", border:"none", borderRadius:7, padding:"9px 18px",
                  color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
                  opacity: (busy || showRejectForm) ? 0.5 : 1, transition:"all 0.15s",
                }}>
                {busy && !showRejectForm ? "…" : `✓ ${t("Approve","اعتماد")}`}
              </button>
              <button
                onClick={() => setShowRejectForm(v => !v)}
                disabled={busy}
                style={{
                  background: showRejectForm ? "#FEE2E2" : "#FEF8E7",
                  border:`1px solid ${showRejectForm ? "#F87171" : "#F0C843"}`,
                  borderRadius:7, padding:"9px 16px",
                  color: showRejectForm ? "#B71C1C" : "#8B5E00",
                  fontSize:13, cursor:"pointer", opacity: busy ? 0.5 : 1, transition:"all 0.15s",
                }}>
                {showRejectForm ? `✕ ${t("Cancel","إلغاء")}` : `✕ ${t("Reject","رفض")}`}
              </button>
            </>
          )}

          <button
            onClick={onPrintClick}
            style={{ background:"#EBF3FC", border:"1px solid #90C3F5", borderRadius:7, padding:"9px 18px",
              color:"#0066CC", fontSize:13, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", gap:8, transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#0066CC";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#EBF3FC";e.currentTarget.style.color="#0066CC";}}>
            📄 {t("Preview & Export PDF","معاينة وتصدير PDF")}
          </button>
        </div>
      </div>

      {/* ── Inline rejection form ── */}
      {showRejectForm && (
        <div style={{
          background:"#FFF5F5", border:"1px solid #FED7D7", borderRadius:10,
          padding:"16px 18px", marginBottom:20,
        }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#B71C1C", marginBottom:10 }}>
            {t("Rejection Reason (required):","سبب الرفض (مطلوب):")}
          </div>
          <textarea
            autoFocus rows={3}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder={t("Describe why this request is being rejected…","اذكر سبب رفض هذا الطلب…")}
            style={{
              width:"100%", borderRadius:7, padding:"10px 12px", fontSize:13,
              border:`1.5px solid ${rejectReason.trim() ? "#F87171" : "#E2E6EA"}`,
              outline:"none", resize:"vertical", lineHeight:1.6, color:"#0D1B2E",
            }}
            onFocus={e => (e.target.style.borderColor="#F87171")}
            onBlur={e => (e.target.style.borderColor = rejectReason.trim() ? "#F87171" : "#E2E6EA")}
          />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:10 }}>
            <button onClick={() => { setShowRejectForm(false); setRejectReason(""); }}
              style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:6, padding:"7px 16px", fontSize:12, cursor:"pointer", color:"#6B85A3" }}>
              {t("Cancel","إلغاء")}
            </button>
            <button
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || busy}
              style={{
                background: !rejectReason.trim() ? "#fca5a5" : "#B71C1C",
                border:"none", borderRadius:6, padding:"7px 22px",
                color:"#fff", fontSize:12, fontWeight:700,
                cursor: !rejectReason.trim() ? "not-allowed" : "pointer",
              }}>
              {busy ? "…" : `✕ ${t("Confirm Rejection","تأكيد الرفض")}`}
            </button>
          </div>
        </div>
      )}

      {/* ── Rejection reason banner (when already rejected) ── */}
      {r.status === "rejected" && r.rejectionReason && (
        <div style={{
          background:"#FEF0F0", border:"1px solid #F5A0A0", borderRadius:10,
          padding:"14px 18px", marginBottom:20,
          display:"flex", gap:12, alignItems:"flex-start",
        }}>
          <span style={{ fontSize:18, flexShrink:0 }}>⚠</span>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:"#B71C1C", textTransform:"uppercase", marginBottom:4 }}>
              {t("Rejection Reason","سبب الرفض")}
            </div>
            <div style={{ fontSize:13, color:"#7F1D1D", lineHeight:1.6 }}>{r.rejectionReason}</div>
          </div>
        </div>
      )}

      {/* ── Detail grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
        <div>
          {/* Request details */}
          <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, padding:"16px 18px", marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#4A5568", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
              {t("Request Details","تفاصيل الطلب")}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                [t("Requested By","مقدم الطلب"),                   r.requester],
                [t("Department","القسم"),                           r.dept],
                [t("Contractor Company Name","اسم شركة المقاول"),  r.contractor],
                [t("Plant Unit / Workplace","وحدة المحطة"),         r.unit],
                [t("Type of Work","نوع العمل"),                     r.workType],
                [t("Date Submitted","تاريخ الإرسال"),              r.date],
                [t("Total Contract Value (SAR)","إجمالي القيمة"),  `SAR ${r.amount.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ background:"#F8F9FB", borderRadius:6, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:"#8A96A3", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:12, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope table */}
          <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, overflow:"hidden", marginBottom:14 }}>
            <div style={{ padding:"10px 18px", borderBottom:"1px solid #E2E6EA", background:"#F8F9FB",
              fontSize:11, fontWeight:800, color:"#4A5568", textTransform:"uppercase", letterSpacing:"0.07em" }}>
              📐 {t("Detailed Scope of Work","نطاق العمل التفصيلي")}
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr style={{ background:"#F8F9FB" }}>
                    {["S.N", t("Description","الوصف"), "WO", t("Clause","البند"), t("Func. Location","الموقع"),
                      t("Qty","الكمية"), t("Start","البداية"), t("End","النهاية"), t("Cost (SAR)","التكلفة (ريال)")].map(h => (
                      <th key={h} style={{ padding:"7px 8px", textAlign:"left", fontSize:10, fontWeight:700, color:"#8A96A3", borderBottom:"1px solid #E2E6EA" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.scopeRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #E2E6EA" }}>
                      <td style={{ padding:"7px 8px", color:"#B0BAC4" }}>{row.li || i+1}</td>
                      <td style={{ padding:"7px 8px" }}>{row.wod}</td>
                      <td style={{ padding:"7px 8px", fontFamily:"monospace", color:"#8A96A3" }}>{row.wo}</td>
                      <td style={{ padding:"7px 8px" }}>{row.cl}</td>
                      <td style={{ padding:"7px 8px" }}>{row.fl}</td>
                      <td style={{ padding:"7px 8px" }}>{row.qty}</td>
                      <td style={{ padding:"7px 8px", color:"#8A96A3" }}>{row.sd}</td>
                      <td style={{ padding:"7px 8px", color:"#8A96A3" }}>{row.ed}</td>
                      <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:600, color:"#1A7F3C", fontFamily:"monospace" }}>
                        {parseFloat(row.cost||"0").toLocaleString("en-SA",{minimumFractionDigits:2})}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background:"#F8F9FB" }}>
                    <td colSpan={8} style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, fontSize:11 }}>
                      {t("Total without VAT","الإجمالي بدون ضريبة")}
                    </td>
                    <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:"#1A7F3C", fontFamily:"monospace" }}>
                      SAR {total.toLocaleString("en-SA",{minimumFractionDigits:2})}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Justifications */}
          {(r.safetyEnv || r.opEfficiency || r.certifiedRec) && (
            <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, padding:"16px 18px" }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#4A5568", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
                🛡️ {t("Justifications","المبررات")}
              </div>
              {r.safetyEnv&&<div style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#8A96A3", textTransform:"uppercase", marginBottom:3 }}>{t("Safety / Environment","السلامة / البيئة")}</div>
                <div style={{ fontSize:12, background:"#F8F9FB", borderRadius:6, padding:"8px 10px" }}>{r.safetyEnv}</div>
              </div>}
              {r.opEfficiency&&<div style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#8A96A3", textTransform:"uppercase", marginBottom:3 }}>{t("Operational Efficiency","كفاءة التشغيل")}</div>
                <div style={{ fontSize:12, background:"#F8F9FB", borderRadius:6, padding:"8px 10px" }}>{r.opEfficiency}</div>
              </div>}
              {r.certifiedRec&&<div>
                <div style={{ fontSize:10, color:"#8A96A3", textTransform:"uppercase", marginBottom:3 }}>{t("Certified Recommendation","التوصية المعتمدة")}</div>
                <div style={{ fontSize:12, background:"#F8F9FB", borderRadius:6, padding:"8px 10px" }}>{r.certifiedRec}</div>
              </div>}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"#fff", border:"1px solid #E2E6EA", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#4A5568", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
              💰 {t("Financial","البيانات المالية")}
            </div>
            {[
              [t("Contract No.","رقم العقد"),                  r.contractNo],
              [t("Contract Value","قيمة العقد"),               `SAR ${Number(r.contractValue||0).toLocaleString()}`],
              [t("Expenditure to Date","الصرف حتى تاريخه"),   r.totalExpPct ? r.totalExpPct+"%" : "—"],
              [t("Cost Center","مركز التكلفة"),                r.costCenter],
              [t("Cost Element","عنصر التكلفة"),               r.costElement],
              [t("Funding Source","مصدر التمويل"),             r.fundingSource],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0",
                borderBottom:"1px solid #E2E6EA", fontSize:11 }}>
                <span style={{ color:"#8A96A3" }}>{k}</span>
                <span style={{ fontWeight:600, textAlign:"right", maxWidth:150 }}>{v||"—"}</span>
              </div>
            ))}
          </div>

          <div style={{ background:"#EBF3FC", border:"1px solid #90C3F5", borderRadius:10, padding:"12px 14px", fontSize:11, color:"#0066CC" }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>📄 {t("PDF Export Tip","تلميح تصدير PDF")}</div>
            <div style={{ lineHeight:1.7, color:"#1A4A8A" }}>
              {t(
                'Click "Preview & Export PDF" → set "Save as PDF" → A4 Landscape → disable Headers/Footers.',
                'اضغط "معاينة وتصدير PDF" → اختر "حفظ كـ PDF" → A4 أفقي → بدون رأس/تذييل.'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
