import React, { useState } from "react";
import seLogo from "./images/AW_SE_LOGO_PRIM_EN_RGB.svg";

interface JCCForm {
  // Header
  contractNo: string;
  serviceOrderNo: string;
  dateOfContract: string;
  contractorName: string;
  location: string;
  siteDeliveryDate: string;
  contractPeriodMonths: string;
  contractCompletionDate: string;
  actualCompletionDate: string;
  penaltyPeriod: string;
  // Work description
  descriptionOfWork: string;
  remarks: string;
  totalCostSAR: string;
  // Signatures
  sesReceiverName: string;
  approvalManagerName: string;
  approvalManagerTitle: string;
  contractorRepName: string;
  sectorHeadName: string;
}

const EMPTY: JCCForm = {
  contractNo: "",
  serviceOrderNo: "",
  dateOfContract: "",
  contractorName: "",
  location: "SSPP",
  siteDeliveryDate: "",
  contractPeriodMonths: "",
  contractCompletionDate: "",
  actualCompletionDate: "",
  penaltyPeriod: "N/A",
  descriptionOfWork: "",
  remarks: "",
  totalCostSAR: "",
  sesReceiverName: "",
  approvalManagerName: "",
  approvalManagerTitle: "Project Manager",
  contractorRepName: "",
  sectorHeadName: "",
};

// ── PDF BUILDER — matches Excel JCC format EXACTLY ──
function buildJCCPDF(f: JCCForm): string {
  const border = "1px solid #000";
  const cellStyle = `border:${border};padding:4px 6px;font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;vertical-align:top;`;
  const labelStyle = `${cellStyle}background:#f5f5f5;`;

  return `
<div style="font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;width:190mm;padding:5mm;color:#000">

  <!-- CONFIDENTIAL HEADER -->
  <div style="text-align:center;color:#CC0000;font-size:8pt;font-weight:bold;margin-bottom:4mm">
    داخلي مقيد - Confidential Internal
  </div>

  <!-- COMPANY HEADER: Logo left + bilingual text -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:4mm">
    <tr>
      <td style="width:20%;vertical-align:middle">
        <img src="${seLogo}" style="width:60px;height:auto"/>
      </td>
      <td style="width:40%;vertical-align:top;font-family:Arial;font-size:11pt;font-weight:bold;line-height:1.8">
        Saudi Energy<br/>
        Energy Production Operation BU SOA<br/>
        Shuqaiq Steam PP Sector
      </td>
      <td style="width:40%;vertical-align:top;font-family:Arial;font-size:11pt;font-weight:bold;text-align:right;line-height:1.8">
        السعودية للطاقة<br/>
        وحدة اعمال عمليات انتاج الطاقة الجنوبي<br/>
        قطاع محطة طاقة الشقيق البخارية
      </td>
    </tr>
  </table>

  <!-- MAIN FORM TABLE -->
  <table style="width:100%;border-collapse:collapse">

    <!-- Contract No Row -->
    <tr>
      <td colspan="2" style="${labelStyle}width:50%">Contract No. / Service Order No.</td>
      <td colspan="2" style="${labelStyle}width:50%;text-align:right">رقم العقد / التعميد:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.contractNo || ""}${f.serviceOrderNo ? " / " + f.serviceOrderNo : ""}</td>
      <td colspan="2" style="${cellStyle};text-align:center">${f.serviceOrderNo || ""}${f.contractNo ? " / " + f.contractNo : ""}</td>
    </tr>

    <!-- Date of Contract Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Date of Contract:</td>
      <td style="${labelStyle}"></td>
      <td style="${labelStyle};text-align:right">تاريخ العقد</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.dateOfContract || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Contractor Name Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Contractor's Name:</td>
      <td colspan="2" style="${labelStyle};text-align:right">إسم المقاول:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.contractorName || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Location Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Location:<br/>${f.location || "SSPP"}</td>
      <td colspan="2" style="${labelStyle};text-align:right">الموقع:<br/>محطة طاقة الشقيق البخارية</td>
    </tr>

    <!-- Site Delivery Date Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Site Delivery Date:<br/>${f.siteDeliveryDate || ""}</td>
      <td colspan="2" style="${labelStyle};text-align:right">تاريخ إستلام الموقع:<br/></td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.siteDeliveryDate || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Contract Period Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Contract Period:</td>
      <td colspan="2" style="${labelStyle};text-align:right">مدة العقد:</td>
    </tr>
    <tr>
      <td style="${cellStyle}">${f.contractPeriodMonths || ""}</td>
      <td style="${cellStyle}">Months</td>
      <td style="${cellStyle};text-align:right">أشهر</td>
      <td style="${cellStyle}"></td>
    </tr>

    <!-- Contract Completion Date Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Contract Completion Date:</td>
      <td colspan="2" style="${labelStyle};text-align:right">تاريخ إنتهاء العقد:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.contractCompletionDate || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Actual Completion Date Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Actual Completion Date:</td>
      <td colspan="2" style="${labelStyle};text-align:right">التاريخ الفعلي للإنتهاء:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">${f.actualCompletionDate || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Penalty Period Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Penalty Period, if applicable: ${f.penaltyPeriod || "N/A"}</td>
      <td colspan="2" style="${labelStyle};text-align:right">مدة العقوبة إذا ماطبقت: ${f.penaltyPeriod === "N/A" ? "لا يوجد" : f.penaltyPeriod || "لا يوجد"}</td>
    </tr>

    <!-- Description of Work Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Description of Work accepted:</td>
      <td colspan="2" style="${labelStyle};text-align:right">وصف الأعمال المستلمة:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle};min-height:40px;white-space:pre-wrap">${f.descriptionOfWork || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Remarks Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">Remarks:</td>
      <td colspan="2" style="${labelStyle};text-align:right">ملاحظات:</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle};min-height:30px">${f.remarks || ""}</td>
      <td colspan="2" style="${cellStyle}"></td>
    </tr>

    <!-- Total Cost Row -->
    <tr>
      <td colspan="2" style="${cellStyle};white-space:pre-wrap">Work Done\nBy Total Cost Of\n${f.totalCostSAR || "0.00"} SAR</td>
      <td colspan="2" style="${cellStyle};text-align:right;white-space:pre-wrap">تم اداء الاعمال\nبمبلغ اجمالي</td>
    </tr>

    <!-- SES Receiver Row -->
    <tr>
      <td colspan="2" style="${labelStyle}">SES receiver</td>
      <td style="${labelStyle}"></td>
      <td style="${labelStyle};text-align:right">مستلم الصحيفة</td>
    </tr>
    <tr>
      <td colspan="2" style="${cellStyle}">sign</td>
      <td style="${cellStyle}"></td>
      <td style="${cellStyle};text-align:right">التوقيع</td>
    </tr>

  </table>

  <!-- SIGNATURES TABLE — matches Excel rows 33-42 exactly -->
  <table style="width:100%;border-collapse:collapse;margin-top:2mm">

    <!-- Row 33-34: Approval | Contractor headers -->
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold;background:#f5f5f5">
        الإعتماد<br/>Approval
      </td>
      <td colspan="2" style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold;background:#f5f5f5">
        المقاول<br/>Contractor
      </td>
    </tr>

    <!-- Row 35-36: Manager label | Contractor Name | Name label -->
    <tr>
      <td rowspan="2" style="border:1px solid #000;padding:5px 6px;width:12%;font-family:Arial;font-size:9pt;font-weight:bold;vertical-align:middle"></td>
      <td rowspan="2" style="border:1px solid #000;padding:5px 8px;width:38%;text-align:right;font-family:Arial;font-size:10pt;font-weight:bold;vertical-align:middle">
        مدير ادارة المساندة الفنية :
      </td>
      <td style="border:1px solid #000;padding:5px 8px;width:35%;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold">
        ${f.approvalManagerName || ""}
      </td>
      <td rowspan="2" style="border:1px solid #000;padding:5px 8px;width:15%;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold;vertical-align:middle">
        الاسم<br/>Name
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:9pt;color:#555">
      </td>
    </tr>

    <!-- Row 37-38: Job Title row -->
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;vertical-align:middle"></td>
      <td style="border:1px solid #000;padding:5px 8px;vertical-align:middle"></td>
      <td style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold">
        ${f.approvalManagerTitle || "Project Manager"}
      </td>
      <td style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold">
        الوظيفة<br/>Job Title
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 6px;height:14px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
    </tr>

    <!-- Row 39-42: Sector Head rowspan + Sign label -->
    <tr>
      <td rowspan="4" style="border:1px solid #000;padding:5px 6px;font-family:Arial;font-size:9pt;font-weight:bold;vertical-align:middle;text-align:center">
        رئيس قطاع<br/>محطة طاقة<br/>الشقيق :
      </td>
      <td style="border:1px solid #000;padding:5px 8px;text-align:right;font-family:Arial;font-size:10pt;font-weight:bold">
        رئيس قطاع محطة طاقة الشقيق :
      </td>
      <td style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold">
        ${f.sectorHeadName || ""}
      </td>
      <td rowspan="4" style="border:1px solid #000;padding:5px 8px;text-align:center;font-family:Arial;font-size:10pt;font-weight:bold;vertical-align:middle">
        التوقيع<br/>Sign
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 8px;height:20px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 8px;height:14px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:5px 8px;height:14px"></td>
      <td style="border:1px solid #000;padding:5px 8px"></td>
    </tr>

  </table>

  <!-- CONFIDENTIAL FOOTER -->
  <div style="text-align:center;color:#CC0000;font-size:9pt;font-weight:bold;margin-top:4mm;border-top:1px solid #ccc;padding-top:2mm;font-family:Arial">
    مصنف مقيد داخلي من شركة الكهرباء السعودية - Classified as Confidential Internal by SEC
  </div>

</div>`;
}

// ── FORM INPUT COMPONENTS ──
function FLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: "#2E4A6B",
      letterSpacing: "0.05em", textTransform: "uppercase" as const,
      display: "block", marginBottom: 5 }}>
      {text}{required && <span style={{ color: "#B71C1C" }}> *</span>}
    </label>
  );
}

function FInput({ label, value, onChange, placeholder, required, type = "text" }: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
      {label && <FLabel text={label} required={required} />}
      <input type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ background: "#fff",
          border: `1.5px solid ${focus ? "#1565C0" : "#D0DFF0"}`,
          borderRadius: 8, padding: "9px 13px",
          color: "#0D1B2E", fontSize: 13, outline: "none",
          width: "100%", boxSizing: "border-box" as const }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)} />
    </div>
  );
}

function FTextarea({ label, value, onChange, placeholder, rows = 3 }: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
      {label && <FLabel text={label} />}
      <textarea value={value} onChange={e => onChange(e.target.value)}
        rows={rows} placeholder={placeholder}
        style={{ background: "#fff",
          border: `1.5px solid ${focus ? "#1565C0" : "#D0DFF0"}`,
          borderRadius: 8, padding: "9px 13px",
          color: "#0D1B2E", fontSize: 13, outline: "none",
          width: "100%", resize: "vertical" as const,
          lineHeight: 1.6, boxSizing: "border-box" as const }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)} />
    </div>
  );
}

function Section({ title, icon, children }: {
  title: string; icon: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #D0DFF0",
      borderRadius: 12, overflow: "hidden", marginBottom: 16,
      boxShadow: "0 2px 8px rgba(21,101,192,0.05)" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #D0DFF0",
        background: "#F8FAFD", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#1565C0",
          letterSpacing: "0.07em", textTransform: "uppercase" as const }}>{title}</span>
      </div>
      <div style={{ padding: "18px 20px", display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ── PDF PREVIEW MODAL ──
function JCCModal({ form, onClose }: { form: JCCForm; onClose: () => void }) {
  const html = buildJCCPDF(form);

  const print = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<!DOCTYPE html>
<html>
<head>
<style>
  @page { size: A4 portrait; margin: 8mm; }
  body { margin: 0; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>${html}</body>
</html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0,
      background: "rgba(13,71,161,0.55)", zIndex: 9999,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "24px 0" }}>
      <div style={{ background: "#fff", borderRadius: 14,
        width: "calc(100% - 48px)", maxWidth: 900,
        boxShadow: "0 24px 64px rgba(13,71,161,0.25)" }}>

        {/* Modal Header */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #D0DFF0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#F8FAFD", borderRadius: "14px 14px 0 0" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0D1B2E" }}>
              📜 Job Completion Certificate — شهادة الإنجاز
            </div>
            <div style={{ fontSize: 11, color: "#6B85A3", marginTop: 2 }}>
              {form.contractorName || "—"} · {form.dateOfContract || "—"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={print}
              style={{ background: "#1565C0", border: "none", borderRadius: 8,
                padding: "10px 22px", color: "#fff", fontSize: 13,
                fontWeight: 700, cursor: "pointer" }}>
              🖨️ طباعة / Print PDF
            </button>
            <button onClick={onClose}
              style={{ background: "#FEF0F0", border: "1px solid #F5A0A0",
                borderRadius: 8, padding: "10px 16px", color: "#B71C1C",
                fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ✕ إغلاق
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div style={{ padding: "24px", background: "#666" }}>
          <div style={{ background: "#fff", margin: "0 auto",
            maxWidth: 820, boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            transform: "scale(0.92)", transformOrigin: "top center" }}
            dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        {/* Print tip */}
        <div style={{ padding: "12px 22px", borderTop: "1px solid #D0DFF0",
          background: "#E3EEF9", borderRadius: "0 0 14px 14px",
          fontSize: 11, color: "#1565C0" }}>
          ℹ File → Print → Save as PDF · A4 Portrait · ازل Headers/Footers
        </div>
      </div>
    </div>
  );
}

// ── MAIN JCC COMPONENT ──
export const JCC: React.FC = () => {
  const [F, setF] = useState<JCCForm>(EMPTY);
  const [showPDF, setShowPDF] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const upd = (k: keyof JCCForm, v: string) =>
    setF(prev => ({ ...prev, [k]: v }));

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {showPDF && <JCCModal form={F} onClose={() => setShowPDF(false)} />}

      {/* Page Header */}
      <div style={{ marginBottom: 24, display: "flex",
        justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0D1B2E", margin: 0 }}>
            شهادة الإنجاز — Job Completion Certificate
          </h1>
          <p style={{ fontSize: 13, color: "#6B85A3", marginTop: 5 }}>
            Shuqaiq Power Plant · أدخل البيانات ثم اطبع الشهادة الرسمية
          </p>
        </div>
        <button onClick={() => setShowPDF(true)}
          style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "12px 28px", background: "#E8F0FE",
            border: "2px solid #90BAF5", borderRadius: 14,
            color: "#1565C0", fontSize: 14, fontWeight: 700,
            cursor: "pointer", transition: "all 0.18s",
            boxShadow: "0 2px 8px rgba(21,101,192,0.1)" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1565C0";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#E8F0FE";
            e.currentTarget.style.color = "#1565C0";
          }}>
          📄 Preview &amp; Export PDF
        </button>
      </div>

      {/* SECTION 1: Contract Info */}
      <Section title="Contract Information — معلومات العقد" icon="📋">
        <FInput label="Contract No. / رقم العقد" value={F.contractNo}
          onChange={v => upd("contractNo", v)} placeholder="e.g. 4400017880" required />
        <FInput label="Service Order No. / رقم التعميد" value={F.serviceOrderNo}
          onChange={v => upd("serviceOrderNo", v)} placeholder="e.g. 8500154622" />
        <FInput label="Date of Contract / تاريخ العقد" value={F.dateOfContract}
          onChange={v => upd("dateOfContract", v)} type="date" required />
        <FInput label="Contractor's Name / اسم المقاول" value={F.contractorName}
          onChange={v => upd("contractorName", v)} placeholder="Company name" required />
        <FInput label="Location / الموقع" value={F.location}
          onChange={v => upd("location", v)} placeholder="SSPP" />
        <FInput label="Site Delivery Date / تاريخ إستلام الموقع" value={F.siteDeliveryDate}
          onChange={v => upd("siteDeliveryDate", v)} type="date" />
        <FInput label="Contract Period (Months) / مدة العقد" value={F.contractPeriodMonths}
          onChange={v => upd("contractPeriodMonths", v)} placeholder="e.g. 2" />
        <FInput label="Contract Completion Date / تاريخ إنتهاء العقد" value={F.contractCompletionDate}
          onChange={v => upd("contractCompletionDate", v)} type="date" />
        <FInput label="Actual Completion Date / التاريخ الفعلي للإنتهاء" value={F.actualCompletionDate}
          onChange={v => upd("actualCompletionDate", v)} type="date" required />
        <FInput label="Penalty Period / مدة العقوبة" value={F.penaltyPeriod}
          onChange={v => upd("penaltyPeriod", v)} placeholder="N/A" />
      </Section>

      {/* SECTION 2: Work Details */}
      <Section title="Work Details — تفاصيل العمل" icon="📝">
        <div style={{ gridColumn: "1 / -1" }}>
          <FTextarea label="Description of Work Accepted / وصف الأعمال المستلمة"
            value={F.descriptionOfWork}
            onChange={v => upd("descriptionOfWork", v)}
            placeholder={"Services\n1*Group A\n..."} rows={4} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <FTextarea label="Remarks / ملاحظات" value={F.remarks}
            onChange={v => upd("remarks", v)}
            placeholder="Any remarks..." rows={2} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <FInput label="Total Cost (SAR) / المبلغ الإجمالي" value={F.totalCostSAR}
            onChange={v => upd("totalCostSAR", v)}
            placeholder="e.g. 39,232.18" required />
        </div>
      </Section>

      {/* SECTION 3: Signatures */}
      <Section title="Signatures & Approval — التوقيعات والاعتماد" icon="✍️">
        <FInput label="SES Receiver / مستلم الصحيفة" value={F.sesReceiverName}
          onChange={v => upd("sesReceiverName", v)} placeholder="Name" />
        <FInput label="Approval Manager Name / مدير الاعتماد" value={F.approvalManagerName}
          onChange={v => upd("approvalManagerName", v)} placeholder="Full name" required />
        <FInput label="Approval Manager Title / المسمى الوظيفي" value={F.approvalManagerTitle}
          onChange={v => upd("approvalManagerTitle", v)} placeholder="Project Manager" />
        <FInput label="Contractor Representative / ممثل المقاول" value={F.contractorRepName}
          onChange={v => upd("contractorRepName", v)} placeholder="Name" />
        <FInput label="Sector Head / رئيس قطاع محطة طاقة الشقيق" value={F.sectorHeadName}
          onChange={v => upd("sectorHeadName", v)} placeholder="Full name" />
      </Section>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between",
        paddingTop: 16, borderTop: "1px solid #D0DFF0" }}>
        <button onClick={() => setF(EMPTY)}
          style={{ background: "#fff", border: "1.5px solid #D0DFF0",
            borderRadius: 9, padding: "11px 24px",
            color: "#0D1B2E", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          مسح الحقول / Clear
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => notify("تم الحفظ / Saved")}
            style={{ background: "#fff", border: "1.5px solid #D0DFF0",
              borderRadius: 9, padding: "11px 18px",
              color: "#6B85A3", fontSize: 13, cursor: "pointer" }}>
            حفظ مسودة / Save Draft
          </button>
          <button onClick={() => setShowPDF(true)}
            style={{ background: "#1565C0", border: "none", borderRadius: 9,
              padding: "11px 28px", color: "#fff", fontSize: 13,
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(21,101,192,0.3)" }}>
            📄 معاينة وطباعة / Preview & Print
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          padding: "13px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: "#EDF7F0", border: "1.5px solid #9DDFB3",
          color: "#1A7F3C", boxShadow: "0 8px 24px rgba(21,101,192,0.15)" }}>
          {toast}
        </div>
      )}
    </div>
  );
};
