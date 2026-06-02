/* eslint-disable react/no-danger */
import React, { forwardRef } from "react";
import type { PRRequest } from "../pages/mockData";
import seLogoEn from "../pages/images/AW_SE_LOGO_PRIM_EN_RGB.svg";

// ── Checkbox helper ──────────────────────────────────────────────────────────
const CB = ({ checked }: { checked: boolean }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    width:"3.5mm", height:"3.5mm", border:"1px solid #444",
    fontSize:"7pt", lineHeight:1, flexShrink:0, marginRight:"1.5mm",
  }}>{checked ? "✓" : " "}</span>
);

// ── Row helper ───────────────────────────────────────────────────────────────
const Cell = ({ children, header, w, right, green, span }: {
  children?: React.ReactNode; header?: boolean; w?: string;
  right?: boolean; green?: boolean; span?: number;
}) => (
  <td
    colSpan={span}
    style={{
      border:"1px solid #333", padding:"1.5mm 2mm",
      background: header ? "#f0f0f0" : undefined,
      fontWeight: header ? "bold" : undefined,
      textAlign: right ? "right" : undefined,
      color: green ? "#1A5C30" : undefined,
      width: w,
      fontSize:"7pt",
      verticalAlign:"top",
    }}
  >{children}</td>
);

interface Props { request: PRRequest; }

export const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ request: r }, ref) => {
  const total = r.scopeRows.reduce((s, row) => s + (parseFloat(row.cost) || 0), 0);
  const wp = (label: string) => r.workplace?.toLowerCase() === label.toLowerCase();
  const wt = (label: string) => r.workType === label;

  const EMPTY_ROWS = Math.max(0, 8 - r.scopeRows.length);
  const allRows = [
    ...r.scopeRows,
    ...Array.from({ length: EMPTY_ROWS }, () => ({ li:"",cl:"",wo:"",wod:"",fl:"",qty:"",sd:"",ed:"",cost:"" })),
  ];

  return (
    <div ref={ref}>
      {/* ── Print-only page styles ──────────────────────────────────────── */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 7mm; }
          body * { visibility: hidden; }
          #shuqaiq-print-root, #shuqaiq-print-root * { visibility: visible; }
          #shuqaiq-print-root { position: fixed; inset: 0; }
        }
        #shuqaiq-print-root {
          font-family: Arial, sans-serif;
          font-size: 7pt;
          color: #000;
          width: 283mm;
          max-width: 283mm;
        }
        #shuqaiq-print-root table { border-collapse: collapse; width: 100%; }
        #shuqaiq-print-root td, #shuqaiq-print-root th {
          border: 1px solid #333;
          padding: 1.5mm 2mm;
          font-size: 7pt;
          vertical-align: top;
        }
        #shuqaiq-print-root th {
          background: #e8e8e8;
          font-weight: bold;
          text-align: center;
          font-size: 6.5pt;
        }
      `}</style>

      <div id="shuqaiq-print-root">

        {/* ① Confidentiality banner */}
        <table style={{ marginBottom:"1.5mm" }}>
          <tbody><tr>
            <td style={{ border:"none", color:"#CC0000", fontWeight:"bold", fontSize:"6.5pt", padding:"0" }}>
              Confidential Internal — مقيد داخلي
            </td>
            <td style={{ border:"none", textAlign:"right", color:"#CC0000", fontWeight:"bold", fontSize:"6.5pt", padding:"0" }}>
              Classified as Confidential Internal by SEC
            </td>
          </tr></tbody>
        </table>

        {/* ②③④ Unified header — logo rowSpan=3 keeps perfect border alignment */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:0 }}>
          <tbody>
            {/* ② Title row */}
            <tr>
              <td rowSpan={3} style={{
                width:"34mm", border:"1px solid #333", background:"#FFFFFF",
                textAlign:"center", verticalAlign:"middle", padding:"2mm",
              }}>
                <img
                  src={seLogoEn}
                  alt="Saudi Electricity Company"
                  style={{ width:"30mm", maxHeight:"22mm", height:"auto", objectFit:"contain", display:"block", margin:"0 auto" }}
                />
              </td>
              <td colSpan={6} style={{
                border:"1px solid #333", background:"#003087", color:"#FFFFFF",
                textAlign:"center", verticalAlign:"middle", padding:"3mm 2mm",
              }}>
                <div style={{ fontSize:"12pt", fontWeight:"bold", letterSpacing:"0.03em" }}>SHUQAIQ POWER PLANT</div>
                <div style={{ fontSize:"9pt", fontWeight:"bold", textDecoration:"underline", marginTop:"1mm" }}>
                  PURCHASE REQUEST UNDER CURRENT CONTRACT
                </div>
                <div style={{ fontSize:"7pt", color:"rgba(255,255,255,0.8)", marginTop:"1mm" }}>طلب شراء تحت العقد الحالي</div>
              </td>
            </tr>
            {/* ③ PR / Contract / Date */}
            <tr>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#F0F0F0", fontWeight:"bold", fontSize:"7pt", whiteSpace:"nowrap", width:"20mm" }}>PR NO.</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", color:"#00008B", fontSize:"7pt", width:"38mm" }}>{r.id}</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#F0F0F0", fontWeight:"bold", fontSize:"7pt", whiteSpace:"nowrap", width:"30mm" }}>CONTRACT NO:</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt", width:"60mm" }}>{r.contractNo||""}</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#F0F0F0", fontWeight:"bold", fontSize:"7pt", whiteSpace:"nowrap", width:"20mm" }}>DATE (G):</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{r.date||""}</td>
            </tr>
            {/* ④ Power Plant / Contractor */}
            <tr>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#F0F0F0", fontWeight:"bold", fontSize:"7pt", whiteSpace:"nowrap" }}>POWER PLANT:</td>
              <td colSpan={3} style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", fontSize:"7pt" }}>SHUQAIQ STEAM POWER PLANT</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#F0F0F0", fontWeight:"bold", fontSize:"7pt", whiteSpace:"nowrap" }}>CONTRACTOR NAME:</td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", fontSize:"7pt" }}>{r.contractor||""}</td>
            </tr>
          </tbody>
        </table>

        {/* ⑤ Workplace */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginTop:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", fontSize:"7pt", background:"#F0F0F0", whiteSpace:"nowrap", width:"22mm" }}>Workplace:</td>
            {[["Unit 1","unit 1"],["Unit 2","unit 2"],["Unit 3","unit 3"],["Unit 4","unit 4"],["BOP","bop"],["Admin","admin"]].map(([label,key])=>(
              <td key={key} style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt", whiteSpace:"nowrap", textAlign:"center" }}>
                <CB checked={wp(key)}/>{label}
              </td>
            ))}
          </tr></tbody>
        </table>

        {/* ⑥ Work Type */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginTop:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", fontSize:"7pt", background:"#F0F0F0", whiteSpace:"nowrap", width:"26mm" }}>Type &amp; Select One:</td>
            {[
              ["Manpower","Manpower"],
              ["Repair","Repairs"],
              ["Safety Obs.","Safety Observation"],
              ["PM work","PM work"],
              ["CM work","CM work"],
              ["Outage Work","Outage Work"],
              ["Contract Line Item","contractLineItem"],
              ["Quotation","Quotation"],
            ].map(([label,key])=>(
              <td key={key} style={{ border:"1px solid #333", padding:"1.5mm 1.5mm", fontSize:"6.5pt", whiteSpace:"nowrap", textAlign:"center" }}>
                <CB checked={wt(label) || wt(key)}/>{label}
              </td>
            ))}
          </tr></tbody>
        </table>

        {/* ⑦ NOTE */}
        <table style={{ marginTop:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#fffde7", fontSize:"6.5pt" }}>
              <strong>NOTE:</strong> ATTACHED ASSESSMENT REPORT BASED ON THE SCOPE OF WORK AND PRICING DETAILS MENTIONED IN THE ABOVE CONTRACT.
            </td>
          </tr></tbody>
        </table>

        {/* ⑧ Short Description */}
        <table style={{ marginTop:"-1px" }}>
          <tbody><tr>
            <Cell header w="30mm">Short Description:</Cell>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{r.shortDesc||""}</td>
          </tr></tbody>
        </table>

        {/* ⑨ Scope section header */}
        <table style={{ marginTop:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#d0d0d0", fontWeight:"bold", textAlign:"center", textTransform:"uppercase", fontSize:"7.5pt" }}>
              DETAILED SCOPE OF WORK REQUIRED
            </td>
          </tr></tbody>
        </table>

        {/* ⑩ Scope table */}
        <table style={{ marginTop:"-1px" }}>
          <thead>
            <tr style={{ background:"#e8e8e8" }}>
              <th style={{ width:"8mm" }}>S.N</th>
              <th>Line Item Description (as per contract)</th>
              <th style={{ width:"14mm" }}>Clauses Item</th>
              <th style={{ width:"24mm" }}>WO</th>
              <th style={{ width:"28mm" }}>Func. Location</th>
              <th style={{ width:"9mm" }}>Qty</th>
              <th style={{ width:"18mm" }}>Start Date</th>
              <th style={{ width:"18mm" }}>End Date</th>
              <th style={{ width:"24mm" }}>Total Cost (SAR) w/o VAT</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign:"center", border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt" }}>{row.li||""}</td>
                <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{row.wod||""}</td>
                <td style={{ textAlign:"center", border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt" }}>{row.cl||""}</td>
                <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontFamily:"monospace", fontSize:"6.5pt" }}>{row.wo||""}</td>
                <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{row.fl||""}</td>
                <td style={{ textAlign:"center", border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt" }}>{row.qty||""}</td>
                <td style={{ textAlign:"center", border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt" }}>{row.sd||""}</td>
                <td style={{ textAlign:"center", border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt" }}>{row.ed||""}</td>
                <td style={{ textAlign:"right", border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt", fontWeight: row.cost ? "bold" : "normal" }}>
                  {row.cost ? parseFloat(row.cost).toLocaleString("en-SA",{minimumFractionDigits:2}) : ""}
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr>
              <td colSpan={8} style={{ border:"1px solid #333", padding:"1.5mm 2mm", textAlign:"right", background:"#f0f0f0", fontWeight:"bold", fontSize:"7pt" }}>
                Total cost without VAT / الإجمالي بدون ضريبة القيمة المضافة
              </td>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", textAlign:"right", fontWeight:"bold", fontSize:"7.5pt", background:"#e8f5e9", color:"#1A5C30", fontFamily:"monospace" }}>
                SAR {total.toLocaleString("en-SA",{minimumFractionDigits:2})}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ⑪ Justifications & Financial */}
        <table style={{ marginTop:"2mm" }}>
          <tbody>
            <tr>
              <Cell header w="28mm">Critical Equipment:</Cell>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", width:"8mm", fontSize:"7pt" }}><CB checked={r.criticalEquip==="Yes"}/></td>
              <Cell header w="28mm">Safety / Environment:</Cell>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", width:"60mm", fontSize:"7pt" }}>{r.safetyEnv||""}</td>
              <Cell header w="28mm">Affects Plant Generation:</Cell>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}><CB checked={r.affectsGen==="Yes"}/></td>
            </tr>
            <tr>
              <Cell header>Asset / Op. Efficiency:</Cell>
              <td colSpan={3} style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{r.opEfficiency||""}</td>
              <Cell header>Spare Part Required:</Cell>
              <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}><CB checked={r.sparePart==="Yes"}/></td>
            </tr>
            <tr>
              <Cell header>Certified Recommendation:</Cell>
              <td colSpan={5} style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt", minHeight:"10mm" }}>{r.certifiedRec||""}</td>
            </tr>
          </tbody>
        </table>

        {/* ⑫ Financial Block */}
        <table style={{ marginTop:"-1px" }}>
          <tbody><tr>
            <Cell header w="30mm">Contract Value (SAR):</Cell>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", width:"50mm", fontFamily:"monospace", fontSize:"7pt" }}>
              {r.contractValue ? Number(r.contractValue).toLocaleString("en-SA",{minimumFractionDigits:2}) : ""}
            </td>
            <Cell header w="38mm">Total Expenditure to Date:</Cell>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", width:"30mm", fontFamily:"monospace", fontSize:"7pt" }}>
              {r.totalExpPct ? r.totalExpPct + "%" : ""}
            </td>
            <Cell header w="22mm">Funding Source:</Cell>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt" }}>{r.fundingSource||""}</td>
          </tr></tbody>
        </table>

        {/* ⑬ Reject (why) row */}
        <table style={{ marginTop:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontWeight:"bold", fontSize:"7pt", width:"28mm", background:"#fff0f0", color:"#8B1A1A", whiteSpace:"nowrap" }}>
              Reject (why):<br/><span style={{ fontSize:"5.5pt", fontWeight:"normal", color:"#555" }}>سبب الرفض:</span>
            </td>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt", color:"#8B1A1A", minHeight:"7mm" }}>
              {r.rejectionReason || ""}
            </td>
          </tr></tbody>
        </table>

        {/* ⑭ Confidentiality footer */}
        <div style={{ textAlign:"center", fontSize:"6pt", color:"#CC0000", fontWeight:"bold", borderTop:"1px solid #333", paddingTop:"0.5mm", marginTop:"2mm" }}>
          Classified as Confidential Internal by SEC — مصنف كـ مقيد داخلي من شركة الكهرباء السعودية
        </div>

        {/* ⑮ Signatures */}
        <table style={{ marginTop:"2mm", marginBottom:"-1px" }}>
          <tbody><tr>
            <td style={{ border:"1px solid #333", padding:"1.5mm 2mm", background:"#D0D0D0", fontWeight:"bold", textAlign:"center", fontSize:"8pt", letterSpacing:"0.04em" }}>
              APPROVAL / الاعتماد
            </td>
          </tr></tbody>
        </table>
        <table style={{ marginTop:"-1px" }}>
          <thead>
            <tr>
              {[
                "Requested By\nمقدم الطلب",
                "Section Head\nرئيس القسم",
                "Division Manager\nمدير الشعبة",
                "Budget Group Review\nمجموعة الميزانية",
                "TSD Division Manager\nمدير شعبة الخدمات",
                "SSPP Dept. Manager /\nPlant Manager",
              ].map(role=>(
                <th key={role} style={{ border:"1px solid #333", padding:"2mm", textAlign:"center", fontSize:"6.5pt", width:"16.6%", background:"#D0D0D0" }}>
                  {role.split("\n").map((line,i)=><div key={i}>{line}</div>)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                `Name: ${r.requester||""}\nEmp. No.: ${r.idNumber||""}\nDept: ${r.dept||""}`,
                "Name:\n\nSignature:",
                "Name:\n\nSignature:",
                "Name:\n\nSignature:",
                "Name:\n\nSignature:",
                "Name:\n\nSignature:",
              ].map((content,i)=>(
                <td key={i} style={{ border:"1px solid #333", padding:"2mm", fontSize:"6pt", color:"#555", height:"14mm", verticalAlign:"bottom" }}>
                  {content.split("\n").map((line,j)=>(
                    <div key={j} style={line === "Signature:" ? { borderBottom:"1px solid #333", minWidth:"40mm", marginTop:"4mm", paddingBottom:"1mm" } : {}}>
                      {line}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
});

PrintTemplate.displayName = "PrintTemplate";
