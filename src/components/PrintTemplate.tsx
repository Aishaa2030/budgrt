/* eslint-disable react/no-danger */
import React, { forwardRef } from "react";
import type { PRRequest } from "../pages/mockData";
import seLogoEn from "../pages/images/AW_SE_LOGO_PRIM_EN_RGB.svg";
import { sanitize } from "../utils/sanitize";

interface Props { request: PRRequest; }

export const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ request: r }, ref) => {
  if (import.meta.env.DEV) {
    console.log("[PDF Debug] PR Data:", JSON.stringify(r, null, 2));
  }

  const total = r.scopeRows.reduce((s, row) => s + (parseFloat(row.cost) || 0), 0);
  const wp = (label: string) => (r.workplace||"").toLowerCase() === label.toLowerCase();
  const wt = (label: string) => r.workType === label;

  const EMPTY_ROWS = Math.max(0, 8 - r.scopeRows.length);

  // Optional fields — now typed in PRRequest interface
  const hasContractLineItem = !!r.contractLineItem;
  const hasQuotation        = !!r.quotation;
  const hasMaterialBudget   = !!r.materialThruBudget;
  const safetyObsNum        = sanitize(r.safetyObsNum || "...........................");

  // JSX renders are XSS-safe by default; sanitize is applied where values enter HTML attributes
  const s = (v?: string) => sanitize(v || "");

  const td = (style?: React.CSSProperties): React.CSSProperties => ({
    border:"1px solid #333", padding:"1.5mm 2mm", fontSize:"7pt",
    verticalAlign:"top", ...style,
  });
  const th = (style?: React.CSSProperties): React.CSSProperties => ({
    border:"1px solid #333", padding:"1.5mm 1mm", fontSize:"7pt",
    background:"#e8e8e8", fontWeight:"bold", textAlign:"center",
    verticalAlign:"middle", ...style,
  });
  const hd = (style?: React.CSSProperties): React.CSSProperties => ({
    ...td(), background:"#f0f0f0", fontWeight:"bold", ...style,
  });

  return (
    <div ref={ref}>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          body * { visibility: hidden; }
          #spr, #spr * { visibility: visible; }
          #spr { position: fixed; inset: 0; }
        }
        #spr {
          font-family: Arial, sans-serif;
          font-size: 8pt;
          color: #000;
          width: 194mm;
          max-width: 194mm;
        }
        #spr table { border-collapse: collapse; width: 100%; }
        #spr td, #spr th { border: 1px solid #333; padding: 1.5mm 2mm; font-size: 7pt; vertical-align: top; }
      `}</style>

      <div id="spr">

        {/* ① Confidentiality banner */}
        <div style={{ textAlign:"center", color:"#CC0000", fontSize:"7pt", fontWeight:"bold", marginBottom:"2mm" }}>
          Confidential Internal — داخلي مقيد
        </div>

        {/* ② Header: Logo + Title */}
        <table style={{ marginBottom:"1px" }}>
          <tbody>
            <tr>
              <td rowSpan={2} style={{ width:"28mm", border:"1px solid #333", background:"#fff",
                textAlign:"center", verticalAlign:"middle", padding:"2mm" }}>
                <img src={seLogoEn} alt="SEC" style={{ width:"24mm", maxHeight:"18mm", objectFit:"contain", display:"block", margin:"0 auto" }}/>
              </td>
              <td style={{ border:"1px solid #333", background:"#003087", color:"#fff",
                textAlign:"center", verticalAlign:"middle", padding:"2mm" }}>
                <div style={{ fontSize:"11pt", fontWeight:"bold" }}>SHUQAIQ POWER PLANT</div>
              </td>
            </tr>
            <tr>
              <td style={{ border:"1px solid #333", background:"#003087", color:"#fff",
                textAlign:"center", padding:"1.5mm 2mm", fontSize:"9pt", fontWeight:"bold", textDecoration:"underline" }}>
                PURCHASE REQUEST UNDER CURRENT CONTRACT
              </td>
            </tr>
          </tbody>
        </table>

        {/* ③ Info table */}
        <table style={{ marginTop:"-1px" }}>
          <tbody>
            <tr>
              <td style={hd({ width:"18%" })}>PR NO.</td>
              <td style={td({ width:"32%" })}>{s(r.id)}</td>
              <td style={hd({ width:"18%" })}>CONTRACT NO:</td>
              <td style={td({ width:"32%" })}>{s(r.contractNo)}</td>
            </tr>
            <tr>
              <td style={hd()}>POWER PLANT:</td>
              <td colSpan={2} style={td()}>SHUQAIQ STEAM POWER PLANT</td>
              <td style={{ ...td(), textAlign:"right", fontWeight:"bold" }}>DATE (G): {s(r.date)}</td>
            </tr>
            <tr>
              <td style={hd()}>CONTRACTOR NAME:</td>
              <td colSpan={3} style={td()}>{s(r.contractor)}</td>
            </tr>
          </tbody>
        </table>

        {/* ④ Workplace row */}
        <table style={{ marginTop:"-1px" }}>
          <tbody>
            <tr>
              <td style={hd({ width:"15%", whiteSpace:"nowrap" })}>Workplace:</td>
              {[["Unit 1","unit 1"],["Unit 2","unit 2"],["Unit 3","unit 3"],["Unit 4","unit 4"],["BOP","bop"],["Admin","admin"]].map(([label,key])=>(
                <td key={key} style={{ ...td(), textAlign:"center" }}>
                  {wp(key)?"☑":"☐"} {label}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* ⑤ Work Type row */}
        <table style={{ marginTop:"-1px" }}>
          <tbody>
            <tr>
              <td style={hd({ width:"18%", whiteSpace:"nowrap" })}>Type &amp; Select One:</td>
              {[["Manpower","Manpower"],["Repairs","Repairs"],["Safety observation","Safety observation"],["PM work","PM work"],["CM work","CM work"],["Outage work","Outage work"]].map(([label,key])=>(
                <td key={key} style={{ ...td(), textAlign:"center", fontSize:"6.5pt" }}>
                  {wt(key)?"☑":"☐"} {label}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* ⑥ NOTE box */}
        <div style={{ border:"1px solid #333", borderTop:"none", padding:"1.5mm 2mm", fontSize:"6.5pt", background:"#fffde7" }}>
          <b>NOTE:-</b> ATTACHED ASSESSMENT REPORT BASED ON THE SCOPE OF WORK AND PRICING DETAILS MENTIONED IN THE ABOVE CONTRACT.<br/>
          * Print the contract line item
        </div>

        {/* ⑦ Short Description + checkboxes + WO numbers + certified rec */}
        <table style={{ marginTop:"1px" }}>
          <tbody>
            <tr>
              <td style={hd({ width:"25%" })}>Short Description for the Job:</td>
              <td style={td()}>{s(r.shortDesc)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ ...td(), fontSize:"7pt" }}>
                {hasContractLineItem?"☑":"☐"} Contract Line Item &nbsp;&nbsp;
                {hasQuotation?"☑":"☐"} Quotation &nbsp;&nbsp;
                {hasMaterialBudget?"☑":"☐"} Purchasing materials thru Contract Budget
              </td>
            </tr>
            {r.workerNumber && (
              <tr>
                <td style={hd()}>WORK ORDERS / WO Numbers:</td>
                <td style={td()}>{s(r.workerNumber)}</td>
              </tr>
            )}
            <tr>
              <td style={hd()}>Certified recommendation:</td>
              <td style={td()}>{s(r.certifiedRec)}</td>
            </tr>
          </tbody>
        </table>

        {/* ⑧ Scope header */}
        <div style={{ background:"#d0d0d0", fontWeight:"bold", padding:"1.5mm 2mm",
          border:"1px solid #333", borderTop:"none", textAlign:"center", fontSize:"8pt" }}>
          DETAILED SCOPE OF WORK REQUIRED
        </div>

        {/* ⑨ Scope table */}
        <table>
          <thead>
            <tr>
              <th style={th({ width:"6mm" })}>S.N</th>
              <th style={th()}>line item Description</th>
              <th style={th({ width:"16mm" })}>Clauses. ITEM</th>
              <th style={th({ width:"20mm" })}>WO</th>
              <th style={th({ width:"24mm" })}>WO description</th>
              <th style={th({ width:"22mm" })}>Func Location</th>
              <th style={th({ width:"8mm" })}>Qty</th>
              <th style={th({ width:"18mm" })}>START DATE</th>
              <th style={th({ width:"18mm" })}>END DATE</th>
              <th style={th({ width:"22mm" })}>Total Cost (SAR)</th>
            </tr>
          </thead>
          <tbody>
            {r.scopeRows.map((row,i) => (
              <tr key={i}>
                <td style={{ ...td(), textAlign:"center" }}>{row.li||i+1}</td>
                <td style={td()}>{row.li||""}</td>
                <td style={{ ...td(), textAlign:"center" }}>{row.cl||""}</td>
                <td style={td()}>{row.wo||""}</td>
                <td style={td()}>{row.wod||""}</td>
                <td style={td()}>{row.fl||""}</td>
                <td style={{ ...td(), textAlign:"center" }}>{row.qty||""}</td>
                <td style={td()}>{row.sd||""}</td>
                <td style={td()}>{row.ed||""}</td>
                <td style={{ ...td(), textAlign:"right", fontWeight:"bold" }}>
                  {row.cost ? parseFloat(row.cost).toLocaleString("en-SA",{minimumFractionDigits:2}) : ""}
                </td>
              </tr>
            ))}
            {Array.from({length:EMPTY_ROWS}).map((_,i) => (
              <tr key={`e${i}`}>
                {Array.from({length:10}).map((_,j)=><td key={j} style={td({ padding:"3mm 1mm" })}></td>)}
              </tr>
            ))}
            <tr>
              <td colSpan={9} style={{ ...td(), textAlign:"right", background:"#f0f0f0", fontWeight:"bold" }}>
                Total cost without VAT / إجمالي بدون ضريبة القيمة المضافة
              </td>
              <td style={{ ...td(), textAlign:"right", fontWeight:"bold", background:"#e8f5e9", fontSize:"7.5pt" }}>
                SAR {total.toLocaleString("en-SA",{minimumFractionDigits:2})}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ⑩ Material Purchase section */}
        <table style={{ marginTop:"2mm" }}>
          <tbody>
            <tr>
              <td colSpan={4} style={{ ...td(), background:"#e0e0e0", fontWeight:"bold", textAlign:"center", fontSize:"8pt" }}>
                Material Purchase Thru Contract
              </td>
            </tr>
            <tr>
              <td style={hd({ width:"22%" })}>#EMS - index</td>
              <td style={td({ width:"28%" })}>{s(r.emsIndex)}</td>
              <td style={hd({ width:"22%" })}>* CONTRACT VALUE:</td>
              <td style={td({ width:"28%" })}>{s(r.contractValue)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={hd()}>* TOTAL EXPENDITURE ON THE CONTRACT UP TO DATE (%):</td>
              <td style={td()}>{s(r.totalExpPct)}%</td>
              <td style={td()}></td>
            </tr>
            <tr>
              <td style={hd()}>FUNDING SOURCE</td>
              <td colSpan={3} style={td()}>
                {r.fundingSource?.includes("Plan in Budget")?"☑":"☐"} Plan in Budget (Div. Manager) &nbsp;&nbsp;
                {r.fundingSource?.includes("UnPlan")?"☑":"☐"} UnPlan in Budget (Plant Manager)
              </td>
            </tr>
            <tr>
              <td style={hd()}>COST CENTER:</td>
              <td style={td()}>{s(r.costCenter)}</td>
              <td style={hd()}>COST ELEMENT NO:</td>
              <td style={td()}>{s(r.costElement)}</td>
            </tr>
          </tbody>
        </table>

        {/* ⑪ Justifications */}
        <table style={{ marginTop:"2mm" }}>
          <tbody>
            <tr>
              <td colSpan={3} style={hd()}>Impact on the Unit in terms of:</td>
            </tr>
            <tr>
              <td style={hd({ width:"15%" })}>• Safety or Environment:</td>
              <td style={td({ width:"35%" })}>{s(r.safetyEnv)}</td>
              <td style={td()}>
                <b>• Operational Equipment Efficiency:</b><br/>{s(r.opEfficiency)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ border:"1px solid #333", borderTop:"none", padding:"1.5mm 2mm", fontSize:"7pt" }}>
          {r.safetyObs==="Yes"?"☑":"☐"} Safety observation medium/high
            (observation number: {safetyObsNum})<br/>
          {r.affectsGen==="Yes"?"☑":"☐"} Affect to unit/plant generation<br/>
          {r.criticalEquip==="Yes"?"☑":"☐"} Related to critical system/Equipment<br/><br/>
          I pledge that the requested service is included in the contract and I bear full responsibility in the event of a violation of this.<br/>
          Name: {s(r.requester) || "_________________"} &nbsp;&nbsp;
          ID number: {s(r.idNumber) || "_________________"} &nbsp;&nbsp;
          SIGNATURE: _________________
        </div>

        {/* ⑫ Signatures table */}
        <table style={{ marginTop:"2mm" }}>
          <tbody>
            <tr>
              <td style={hd()}>REQUESTED BY:</td>
              <td style={hd()}>Division For REQUESTER:</td>
              <td style={hd()}>SIGNATURE:</td>
              <td style={hd()}>SIGNATURE:</td>
            </tr>
            <tr>
              <td style={td()}>Section Head:</td>
              <td style={td()}>Division Manager:</td>
              <td style={td()}>Review by: Budget Group</td>
              <td style={td()}>Review by: TSD Div. Manager</td>
            </tr>
            <tr>
              <td style={td({ padding:"6mm 2mm" })}>NAME:</td>
              <td style={td({ padding:"6mm 2mm" })}>NAME:</td>
              <td style={td({ padding:"6mm 2mm" })}>NAME:</td>
              <td style={td({ padding:"6mm 2mm" })}>NAME:</td>
            </tr>
            <tr>
              <td style={td()}>SIGNATURE:</td>
              <td style={td()}>SIGNATURE:</td>
              <td style={td()}>SIGNATURE:</td>
              <td style={td()}>SIGNATURE:</td>
            </tr>
          </tbody>
        </table>

        {/* ⑬ Approval */}
        <table style={{ marginTop:"1mm" }}>
          <tbody>
            <tr>
              <td colSpan={4} style={{ ...td(), textAlign:"center", background:"#e0e0e0", fontWeight:"bold", fontSize:"8pt" }}>
                Approval
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ ...td(), padding:"8mm 2mm", textAlign:"center", fontWeight:"bold" }}>
                SSPP Department Manager<br/><br/>
                SIGNATURE: _______________________________
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ ...td(), fontSize:"6.5pt" }}>
                * IF Amount Less Than 1M (Div. Manager)<br/>
                * IF Amount Less Than 10M (Plant Manager)<br/>
                * IF Req have Spare Part (Plant Manager)
              </td>
              <td style={{ ...td(), fontSize:"6.5pt" }}>
                {r.fundingSource?.includes("Plan in Budget")?"☑":"☐"} Plan in Budget (Div. Manager)<br/>
                {r.fundingSource?.includes("UnPlan")?"☑":"☐"} UnPlan in Budget (Plant Manager)
              </td>
            </tr>
          </tbody>
        </table>

        {/* ⑭ Footer */}
        <div style={{ textAlign:"center", color:"#CC0000", fontSize:"7pt", fontWeight:"bold",
          marginTop:"3mm", borderTop:"1px solid #ccc", paddingTop:"1mm" }}>
          مصنف مقيد داخلي من شركة الكهرباء السعودية — Classified as Confidential Internal by SEC
        </div>

      </div>
    </div>
  );
});

PrintTemplate.displayName = "PrintTemplate";
