import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../services/userService";

async function saveToSharePoint(form: any) {
  const siteUrl = "https://seccomsa.sharepoint.com/sites/EmployeeTasks";
  const listName = "Budgrt";
  const total = (form.scopeRows || []).reduce((s: number, r: any) => s + (parseFloat(r.cost) || 0), 0);
  const prNumber = `PR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

  const digestRes = await fetch(`${siteUrl}/_api/contextinfo`, {
    method: "POST",
    headers: { "Accept": "application/json;odata=verbose" },
    credentials: "include",
  });
  const digestData = await digestRes.json();
  const digest = digestData.d.GetContextWebInformation.FormDigestValue;

  const body = {
    __metadata: { type: "SP.Data.BudgrtListItem" },
    Title: form.shortDesc || prNumber,
    PRNumber: prNumber,
    ContractNo: form.contractNo || "",
    Contractor: form.contractorName || "",
    Department: form.requesterDept || "",
    WorkType: form.workType || "",
    Workplace: form.workplace || "",
    Amount: total,
    Status: "pending",
    Priority: "high",
    RequesterName: form.requesterName || "",
    CostCenter: form.costCenter || "",
    CostElement: form.costElement || "",
    FundingSource: form.fundingSource || "",
    WorkStatus: form.workStatus || "",
    ShortDesc: form.shortDesc || "",
    ScopeJSON: JSON.stringify(form.scopeRows || []),
    ApprovalsJSON: JSON.stringify([
      {id:1,role:"Requested By",name:form.requesterName,status:"pending",ts:null,comment:null},
      {id:2,role:"Section Head",name:"",status:"waiting",ts:null,comment:null},
      {id:3,role:"Division Manager",name:"",status:"waiting",ts:null,comment:null},
      {id:4,role:"Budget Group",name:"",status:"waiting",ts:null,comment:null},
      {id:5,role:"TSD Div. Manager",name:"",status:"waiting",ts:null,comment:null},
      {id:6,role:"SSPP Dept. Manager",name:"",status:"waiting",ts:null,comment:null},
    ]),
    SafetyEnv: form.safetyEnv || "",
    OpEfficiency: form.opEfficiency || "",
    CertifiedRec: form.certifiedRec || "",
  };

  const res = await fetch(
    `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SharePoint error: ${res.status} — ${err.slice(0, 200)}`);
  }

  return prNumber;
}

interface Props { onDone: () => void; }

type ScopeRow = { li:string; cl:string; wo:string; wod:string; fl:string; qty:string; sd:string; ed:string; cost:string };

type FormState = {
  date:string; contractNo:string; powerPlant:string;
  contractorName:string; workplace:string; workType:string;
  requesterName:string; idNumber:string; dept:string; division:string;
  costCenter:string; costElement:string; workerNumber:string;
  shortDesc:string; contractLineItem:boolean; quotation:boolean; materialBudget:boolean;
  certifiedRec:string;
  emsIndex:string; contractValue:string; totalExpPct:string;
  priceAccept:string; materialComment:string; purchasedBefore:string;
  planType:string; workStatus:string;
  plantCanDo:string; canPostpone:string;
  affectsGen:string; criticalEquip:string; safetyObs:string; safetyObsNum:string; sparePart:string;
  scopeRows:ScopeRow[];
  safetyEnv:string; opEfficiency:string;
  pledgeName:string; pledgeId:string; pledged:boolean;
};

// ── Constants ───────────────────────────────────────────────────────────────
const C = {
  blue:"#1565C0", blueLt:"#E3EEF9", blueBdr:"#90BAF5",
  green:"#1A7F3C", greenLt:"#EDF7F0",
  border:"#D0DFF0", surface:"#F8FAFD",
  text:"#0D1B2E", sub:"#2E4A6B", muted:"#6B85A3",
};

const STEPS = [
  { ar:"المعلومات العامة",   en:"GENERAL INFO"  },
  { ar:"معلومات العقد",      en:"CONTRACT INFO" },
  { ar:"نطاق العمل",        en:"SCOPE"         },
  { ar:"المبررات",          en:"JUSTIFICATION" },
  { ar:"المراجعة والإرسال", en:"REVIEW"        },
];

const GRID2: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 };
const GRID3: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 };

// FIX 2: equal-gap container for toggle groups
const togContainer: React.CSSProperties = { display:"flex", flexWrap:"wrap", gap:10 };

const inp = (focus: boolean, ro?: boolean): React.CSSProperties => ({
  background: ro ? C.surface : "#fff",
  border: `1.5px solid ${focus ? C.blue : C.border}`,
  borderRadius: 8, padding:"10px 14px", fontSize:13,
  color: ro ? C.muted : C.text, width:"100%", outline:"none",
  boxShadow: focus && !ro ? `0 0 0 3px rgba(21,101,192,0.1)` : "none",
  transition:"all 0.2s",
});

// ── Primitives (all outside — FIX 1) ───────────────────────────────────────

function FLabel({ ar, en, req }: { ar:string; en:string; req?:boolean }) {
  return (
    <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:"0.3px" }}>
      {ar} <span style={{ color:C.muted, fontWeight:500 }}>/ {en}</span>
      {req && <span style={{ color:"#DC2626", marginLeft:2 }}>*</span>}
    </label>
  );
}

function FInput({ ar, en, value, onChange, placeholder, readOnly, hint, type="text", req }: {
  ar:string; en:string; value:string; onChange?:(v:string)=>void;
  placeholder?:string; readOnly?:boolean; hint?:string; type?:string; req?:boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <FLabel ar={ar} en={en} req={req ?? !readOnly}/>
      <input type={type} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        style={{ ...inp(focus, readOnly), height:44 }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}/>
      {hint && <span style={{ fontSize:11, color:C.muted }}>{hint}</span>}
    </div>
  );
}

function FTextarea({ ar, en, value, onChange, placeholder, rows=3, req }: {
  ar:string; en:string; value:string; onChange:(v:string)=>void;
  placeholder?:string; rows?:number; req?:boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <FLabel ar={ar} en={en} req={req}/>
      <textarea value={value} onChange={e=>onChange(e.target.value)}
        rows={rows} placeholder={placeholder}
        style={{ ...inp(focus), resize:"vertical", lineHeight:1.6 }}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
    </div>
  );
}

function FSelect({ ar, en, value, onChange, options, req }: {
  ar:string; en:string; value:string; onChange:(v:string)=>void; options:string[]; req?:boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <FLabel ar={ar} en={en} req={req ?? true}/>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inp(focus), height:44, cursor:"pointer" }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
        <option value="">اختر / Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Section({ icon, arTitle, enTitle, children }: {
  icon:string; arTitle:string; enTitle?:string; children:React.ReactNode;
}) {
  return (
    <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:24, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        {enTitle && <span style={{ fontSize:11, fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:"0.06em" }}>— {enTitle}</span>}
        <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{arTitle}</span>
      </div>
      <div style={{ padding:"20px 24px" }}>{children}</div>
    </div>
  );
}

function TogRow({ ar, en, value, onChange }: {
  ar:string; en:string; value:string; onChange:(v:string)=>void;
}) {
  const isYes = value==="Yes", isNo = value==="No";
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"13px 16px", background:"#fff",
      border:`1.5px solid ${C.border}`,
      borderLeft:`4px solid ${isYes ? C.blue : isNo ? "#EEA020" : C.border}`,
      borderRadius:9, gap:12, marginBottom:10,
    }}>
      <div>
        <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{ar}</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{en}</div>
      </div>
      <div style={{ display:"flex", borderRadius:8, overflow:"hidden", border:`1.5px solid ${C.border}`, flexShrink:0 }}>
        {[["No","لا"],["Yes","نعم"]].map(([v,label]) => (
          <button key={v} onClick={() => onChange(v)}
            style={{
              padding:"7px 16px", fontSize:12, fontWeight:600, border:"none", cursor:"pointer",
              background: value===v ? (v==="Yes" ? C.blue : "#EEA020") : "#fff",
              color: value===v ? "#fff" : C.muted, transition:"all 0.2s",
            }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// FIX 2: updated TogBtn with equal-width flex behaviour
function TogBtn({ label, active, onClick, activeColor=C.blue }: {
  label:string; active:boolean; onClick:()=>void; activeColor?:string;
}) {
  return (
    <button onClick={onClick} style={{
      padding:"9px 0",
      minWidth:110,
      flex:"1 1 auto",
      maxWidth:160,
      borderRadius:8,
      border:`1.5px solid ${active ? activeColor : "#D0DFF0"}`,
      background: active ? (activeColor===C.green ? C.greenLt : "#E3EEF9") : "#FFFFFF",
      color: active ? activeColor : "#2E4A6B",
      fontSize:13,
      fontWeight: active ? 700 : 500,
      cursor:"pointer",
      textAlign:"center",
      transition:"all 0.15s",
    }}>{label}</button>
  );
}

// ── StepBar (FIX 1: moved outside) ─────────────────────────────────────────
function StepBar({ step }: { step:number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
      {STEPS.map((s,i) => {
        const done=i<step, active=i===step;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<STEPS.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:90 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:12, fontWeight:800,
                background: done?"#1A7F3C":active?C.blue:"#fff",
                border:`2px solid ${done?"#1A7F3C":active?C.blue:C.border}`,
                color:(done||active)?"#fff":C.muted,
                boxShadow: active?`0 0 0 4px ${C.blueLt}`:"none", transition:"all 0.2s",
              }}>{done?"✓":i+1}</div>
              <div style={{ fontSize:9, fontWeight:700, marginTop:4, textAlign:"center",
                color:active?C.blue:done?"#1A7F3C":C.muted, textTransform:"uppercase", maxWidth:80 }}>{s.en}</div>
              <div style={{ fontSize:9, color:active?C.blue:done?"#1A7F3C":C.muted, textAlign:"center", maxWidth:80 }}>{s.ar}</div>
            </div>
            {i<STEPS.length-1 && (
              <div style={{ flex:1, height:2, background:done?"#1A7F3C":C.border, margin:"0 3px 18px", borderRadius:1 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 0 (FIX 1: moved outside) ──────────────────────────────────────────
function Step0({ F, upd }: { F:FormState; upd:(k:string,v:unknown)=>void }) {
  return (
    <>
      <Section icon="📌" arTitle="رأس الطلب" enTitle="REQUEST HEADER">
        <div style={GRID3}>
          <FInput ar="رقم الطلب" en="PR NO." value="AUTO-GENERATED" readOnly hint="يُنشأ عند الإرسال"/>
          <FInput ar="التاريخ" en="DATE (G)" type="date" value={F.date} onChange={v=>upd("date",v)} req/>
          <FInput ar="رقم العقد" en="CONTRACT NO." value={F.contractNo} onChange={v=>upd("contractNo",v)} placeholder="CNT-2025-XXXX" req/>
        </div>
        <div style={{ ...GRID2, marginTop:16 }}>
          <FInput ar="المحطة" en="POWER PLANT" value={F.powerPlant} onChange={v=>upd("powerPlant",v)} req/>
          <FInput ar="المقاول" en="CONTRACTOR NAME" value={F.contractorName} onChange={v=>upd("contractorName",v)} placeholder="Company name" req/>
        </div>
      </Section>

      <div style={{ background:"#FFFDE7", border:"1px solid #F0C843", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#5D4037", marginBottom:20 }}>
        <strong>NOTE:</strong> Attached assessment report based on the scope of work and pricing details mentioned in the above contract.
        <span style={{ display:"block", marginTop:6, lineHeight:1.8 }}>
          * Print the contract line item<br/>
          * You can use the file Consumer contracts from the Shared folder
        </span>
      </div>

      <Section icon="🏭" arTitle="موقع العمل ونوعه" enTitle="WORKPLACE & WORK TYPE">
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", marginBottom:10 }}>
            موقع العمل / WORKPLACE <span style={{ color:"#DC2626" }}>*</span>
          </div>
          <div style={togContainer}>
            {["Unit 1","Unit 2","Unit 3","Unit 4","BOP","Admin"].map(w => (
              <TogBtn key={w} label={w} active={F.workplace===w} onClick={()=>upd("workplace",F.workplace===w?"":w)}/>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", marginBottom:10 }}>
            نوع العمل / TYPE & SELECT ONE <span style={{ color:"#DC2626" }}>*</span>
          </div>
          <div style={togContainer}>
            {["Manpower","Repairs","Safety observation","PM work","CM work","Outage work"].map(t => (
              <TogBtn key={t} label={t} active={F.workType===t} onClick={()=>upd("workType",F.workType===t?"":t)}/>
            ))}
          </div>
        </div>
      </Section>

      <Section icon="👤" arTitle="معلومات مقدم الطلب" enTitle="REQUESTER INFORMATION">
        <div style={GRID3}>
          <FInput ar="الاسم" en="REQUESTED BY" value={F.requesterName} onChange={v=>upd("requesterName",v)} placeholder="Full name" req/>
          <FInput ar="رقم الهوية" en="ID NUMBER" value={F.idNumber} onChange={v=>upd("idNumber",v)} placeholder="Employee ID" req={false}/>
          <FSelect ar="القسم" en="DEPARTMENT" value={F.dept} onChange={v=>upd("dept",v)} options={["Maintenance","Operations","Engineering","Safety","Procurement","Finance"]}/>
          <FSelect ar="شعبة مقدم الطلب" en="DIVISION FOR REQUESTER" value={F.division} onChange={v=>upd("division",v)} options={["Generation","Transmission","Distribution","Engineering Support","HSE"]}/>
          <FInput ar="مركز التكلفة" en="COST CENTER" value={F.costCenter} onChange={v=>upd("costCenter",v)} placeholder="e.g. 1023" req={false}/>
          <FInput ar="رقم عنصر التكلفة" en="COST ELEMENT NO." value={F.costElement} onChange={v=>upd("costElement",v)} placeholder="e.g. 5500200" req={false}/>
        </div>
      </Section>

      <Section icon="📋" arTitle="أوامر العمل" enTitle="WORK ORDERS">
        <FTextarea ar="رقم أمر العمل" en="WORKER ORDER NUMBER (WO)"
          value={F.workerNumber} onChange={v=>upd("workerNumber",v)}
          rows={2} placeholder="e.g. WO-2025-441, WO-2025-442"/>
        <div style={{ marginTop:4, fontSize:11, color:C.muted }}>
          أدخل أرقام أوامر العمل المرتبطة بهذا الطلب / Enter related WO numbers
        </div>
      </Section>

      <Section icon="📝" arTitle="الوصف المختصر" enTitle="SHORT DESCRIPTION">
        <FTextarea ar="الوصف المختصر للعمل" en="SHORT DESCRIPTION FOR THE JOB"
          value={F.shortDesc} onChange={v=>upd("shortDesc",v)}
          rows={4} req placeholder="وصف مختصر للعمل المطلوب / Brief description of required work"/>
        <div style={{ marginTop:14, display:"flex", gap:20, flexWrap:"wrap" }}>
          {[
            {k:"contractLineItem", l:"Contract Line Item"},
            {k:"quotation",        l:"Quotation"},
            {k:"materialBudget",   l:"Purchasing materials thru Contract Budget"},
          ].map(c=>(
            <label key={c.k} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.sub, cursor:"pointer" }}>
              <input type="checkbox" checked={(F as Record<string,unknown>)[c.k] as boolean}
                onChange={e=>upd(c.k,e.target.checked)}
                style={{ width:16, height:16, accentColor:C.blue, cursor:"pointer" }}/>{c.l}
            </label>
          ))}
        </div>
      </Section>

      <Section icon="✍️" arTitle="التوصية المعتمدة" enTitle="CERTIFIED RECOMMENDATION">
        <FTextarea ar="التوصية المعتمدة" en="CERTIFIED RECOMMENDATION"
          value={F.certifiedRec} onChange={v=>upd("certifiedRec",v)}
          rows={3} placeholder="أدخل التوصية المعتمدة للعمل المطلوب / Enter certified recommendation"/>
      </Section>
    </>
  );
}

// ── Step 1 (FIX 1: moved outside) ──────────────────────────────────────────
function Step1({ F, upd, balanceVal }: { F:FormState; upd:(k:string,v:unknown)=>void; balanceVal:string }) {
  const acceptStyle = (v:"accept"|"reject"): React.CSSProperties => ({
    padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600,
    border:`1.5px solid ${F.priceAccept===v ? (v==="accept"?C.green:"#DC2626") : C.border}`,
    background: F.priceAccept===v ? (v==="accept"?C.greenLt:"#FEF2F2") : "#fff",
    color: F.priceAccept===v ? (v==="accept"?C.green:"#DC2626") : C.muted,
    cursor:"pointer", transition:"all 0.2s",
  });
  return (
    <>
      <Section icon="📋" arTitle="معلومات العقد" enTitle="CONTRACT INFORMATION">
        <div style={GRID3}>
          <FInput ar="رقم العقد" en="CONTRACT NO." value={F.contractNo} onChange={v=>upd("contractNo",v)} placeholder="CNT-2025-XXXX" req={false}/>
          <FInput ar="مركز التكلفة" en="COST CENTER" value={F.costCenter} onChange={v=>upd("costCenter",v)} placeholder="e.g. 1023" req={false}/>
          <FInput ar="رقم عنصر التكلفة" en="COST ELEMENT NO." value={F.costElement} onChange={v=>upd("costElement",v)} placeholder="e.g. 5500200" req={false}/>
        </div>
      </Section>

      <Section icon="🧾" arTitle="المواد" enTitle="MATERIAL PURCHASE">
        <div style={GRID3}>
          <FInput ar="#EMS - Index" en="EMS INDEX" value={F.emsIndex} onChange={v=>upd("emsIndex",v)} placeholder="EMS-XXXX" req={false}/>
          <FInput ar="قيمة العقد" en="CONTRACT VALUE (SAR)" value={F.contractValue} onChange={v=>upd("contractValue",v)} placeholder="0.00" req/>
          <FInput ar="نسبة الصرف" en="TOTAL EXPENDITURE (%)" value={F.totalExpPct} onChange={v=>upd("totalExpPct",v)} placeholder="0" req/>
        </div>
        <div style={{ marginTop:16 }}>
          <FInput ar="الرصيد المتبقي" en="BALANCE" value={balanceVal ? `SAR ${balanceVal}` : ""} readOnly
            hint="يُحسب تلقائياً = قيمة العقد × (1 − نسبة الصرف) / Auto-calculated"/>
        </div>
        <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", marginBottom:10 }}>
            تقييم السعر / MATERIAL COMMENT ON PRICE
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <button onClick={()=>upd("priceAccept","accept")} style={acceptStyle("accept")}>✓ Accept</button>
            <button onClick={()=>upd("priceAccept","reject")} style={acceptStyle("reject")}>✕ Reject</button>
          </div>
          <FTextarea ar="تعليق على السعر" en="MATERIAL COMMENT ON THE PRICE (Accept or deny then explain)"
            value={F.materialComment} onChange={v=>upd("materialComment",v)}
            rows={2} placeholder="اقبل أو ارفض ثم وضح السبب / Accept or deny then explain…"/>
        </div>
        <div style={{ marginTop:16 }}>
          <TogRow ar="هل سبق الشراء من هذا العقد؟" en="Purchased from contract before?" value={F.purchasedBefore} onChange={v=>upd("purchasedBefore",v)}/>
        </div>
      </Section>

      {/* FIX 2: Funding Source as equal toggle buttons */}
      <Section icon="💰" arTitle="مصدر التمويل" enTitle="FUNDING SOURCE">
        <div style={togContainer}>
          <TogBtn label="Plan in Budget (Div. Manager)"    active={F.planType==="plan"}   onClick={()=>upd("planType","plan")}/>
          <TogBtn label="UnPlan in Budget (Plant Manager)" active={F.planType==="unplan"} onClick={()=>upd("planType","unplan")}/>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", fontSize:12, color:C.sub, lineHeight:1.8, marginTop:14 }}>
          * IF Amount Less Than 1M → Division Manager<br/>
          * IF Amount Less Than 10M → Plant Manager<br/>
          * IF Req have Spare Part → Plant Manager
        </div>
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", marginBottom:10 }}>
            حالة العمل / WORK STATUS
          </div>
          <div style={togContainer}>
            {["Started","Not Started"].map(opt => (
              <TogBtn key={opt} label={opt} active={F.workStatus===opt} activeColor={C.green} onClick={()=>upd("workStatus",opt)}/>
            ))}
          </div>
        </div>
      </Section>

      <Section icon="❓" arTitle="أسئلة التقييم السريع" enTitle="QUICK ASSESSMENT">
        <TogRow ar="هل سبق الشراء من هذا العقد؟" en="Purchased from contract before?" value={F.purchasedBefore} onChange={v=>upd("purchasedBefore",v)}/>
        <TogRow ar="هل يمكن تنفيذ العمل بواسطة فريق المحطة؟" en="Can the work be completed by the plant team?" value={F.plantCanDo} onChange={v=>upd("plantCanDo",v)}/>
        <TogRow ar="هل يمكن تأجيله للميزانية القادمة؟" en="Can the work be postponed to the next budget?" value={F.canPostpone} onChange={v=>upd("canPostpone",v)}/>
        <TogRow ar="هل يؤثر على توليد الوحدة أو المحطة؟" en="Affect to unit/plant generation?" value={F.affectsGen} onChange={v=>upd("affectsGen",v)}/>
        <TogRow ar="هل يتعلق بنظام أو معدة حيوية؟" en="Related to critical system/Equipment?" value={F.criticalEquip} onChange={v=>upd("criticalEquip",v)}/>
        <TogRow ar="ملاحظة السلامة متوسطة/عالية؟" en="Safety observation medium/high?" value={F.safetyObs} onChange={v=>upd("safetyObs",v)}/>
        {F.safetyObs==="Yes" && (
          <div style={{ paddingLeft:24, marginTop:-4, marginBottom:10 }}>
            <FInput ar="رقم الملاحظة" en="OBSERVATION NUMBER" value={F.safetyObsNum} onChange={v=>upd("safetyObsNum",v)} placeholder="OBS-XXXX" req={false}/>
          </div>
        )}
        <TogRow ar="هل يحتاج قطع غيار أو مواد؟" en="Spare parts/materials required?" value={F.sparePart} onChange={v=>upd("sparePart",v)}/>
        {F.affectsGen==="Yes" && (
          <div style={{ background:"#FEF0F0", border:"1px solid #F5A0A0", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#B71C1C", marginTop:8 }}>
            ⚡ تمت إضافة موافقة إدارة التوليد تلقائياً / Generation Management approval added automatically.
          </div>
        )}
      </Section>
    </>
  );
}

// ── Step 2 (FIX 1: moved outside) ──────────────────────────────────────────
function Step2({ scopeRows, total, addRow, delRow, updRow }: {
  scopeRows:ScopeRow[]; total:number;
  addRow:()=>void; delRow:(i:number)=>void; updRow:(i:number,k:string,v:string)=>void;
}) {
  return (
    <>
      <div style={{ background:C.blueLt, border:`1px solid ${C.blueBdr}`, borderRadius:8, padding:"10px 14px", fontSize:12, color:C.blue, marginBottom:20 }}>
        البنود يجب أن تطابق العقد بالضبط / Line items must match contract exactly.&nbsp;
        <strong>It must be exactly as per contract.</strong>
      </div>
      <Section icon="📐" arTitle="نطاق العمل التفصيلي" enTitle="DETAILED SCOPE OF WORK REQUIRED">
        <div style={{ overflowX:"auto", borderRadius:8, border:`1px solid ${C.border}` }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.surface, borderBottom:`1.5px solid ${C.border}` }}>
                {["S.N","Line Item Description","Clauses. ITEM","WO","WO Description","Func Location","Qty","START DATE","END DATE","Total Cost (SAR)",""].map(h=>(
                  <th key={h} style={{ padding:"10px 8px", color:C.muted, fontSize:11, fontWeight:700, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scopeRows.length===0 && (
                <tr><td colSpan={11} style={{ padding:28, textAlign:"center", color:C.muted, fontSize:12 }}>
                  لا توجد بنود / No items — click "+ إضافة بند"
                </td></tr>
              )}
              {scopeRows.map((r,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:"8px 8px", color:C.muted, fontWeight:500 }}>{i+1}</td>
                  {(["li","cl","wo","wod","fl","qty","sd","ed","cost"] as const).map((k,ki) => (
                    <td key={k} style={{ padding:"4px 4px" }}>
                      <input type={k==="sd"||k==="ed"?"date":"text"} value={r[k]||""}
                        onChange={e=>updRow(i,k,e.target.value)}
                        style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6,
                          padding:"5px 7px", fontSize:12, outline:"none", color:C.text,
                          width:[100,80,90,130,110,50,110,110,100][ki] }}
                        onFocus={e=>(e.target.style.borderColor=C.blue)}
                        onBlur={e=>(e.target.style.borderColor=C.border)}/>
                    </td>
                  ))}
                  <td style={{ padding:"4px 6px" }}>
                    <button onClick={()=>delRow(i)} style={{ background:"none", border:"none", color:"#DC2626", cursor:"pointer", fontSize:15 }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:C.blueLt, borderTop:`1.5px solid ${C.border}` }}>
                <td colSpan={10} style={{ padding:"12px 10px", textAlign:"right", fontSize:13, fontWeight:600, color:C.text }}>
                  إجمالي بدون ضريبة القيمة المضافة / Total cost without VAT:&nbsp;
                  <span style={{ color:C.green, fontFamily:"monospace", fontSize:15, fontWeight:700 }}>
                    SAR {total.toLocaleString("en-SA",{minimumFractionDigits:2})}
                  </span>
                </td>
                <td/>
              </tr>
            </tfoot>
          </table>
        </div>
        <button onClick={addRow} style={{ marginTop:14, display:"flex", alignItems:"center", gap:8,
          background:"none", border:`2px dashed ${C.blue}`, borderRadius:8,
          padding:"9px 18px", color:C.blue, fontSize:13, fontWeight:600, cursor:"pointer" }}>
          + إضافة بند / Add Row
        </button>
      </Section>
    </>
  );
}

// ── Step 3 (FIX 1: moved outside) ──────────────────────────────────────────
function Step3({ F, upd }: { F:FormState; upd:(k:string,v:unknown)=>void }) {
  return (
    <>
      <Section icon="🛡️" arTitle="المبررات والتأثيرات" enTitle="JUSTIFICATIONS">
        <div style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:16 }}>Impact on the Unit in terms of:</div>
        <div style={{ marginBottom:20 }}>
          <FTextarea ar="• السلامة والبيئة" en="SAFETY OR ENVIRONMENT"
            value={F.safetyEnv} onChange={v=>upd("safetyEnv",v)}
            rows={4} placeholder="Safety or environmental impact…"/>
        </div>
        <div style={{ marginBottom:4 }}>
          <FTextarea ar="• كفاءة المعدات التشغيلية" en="OPERATIONAL EQUIPMENT EFFICIENCY"
            value={F.opEfficiency} onChange={v=>upd("opEfficiency",v)}
            rows={4} placeholder="Operational efficiency impact…"/>
        </div>
        <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.sub, marginBottom:12 }}>تأكيد المعايير / IMPACT CONFIRMATION:</div>
          {[
            {k:"safetyObs",    l:"Safety observation medium/high (observation number: ____________)"},
            {k:"affectsGen",   l:"Affect to unit/plant generation"},
            {k:"criticalEquip",l:"Related to critical system/Equipment"},
          ].map(c=>(
            <label key={c.k} style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:C.sub, cursor:"pointer", marginBottom:10 }}>
              <input type="checkbox" checked={(F as Record<string,unknown>)[c.k]==="Yes"}
                onChange={e=>upd(c.k,e.target.checked?"Yes":"")}
                style={{ width:16, height:16, accentColor:C.blue }}/>{c.l}
            </label>
          ))}
        </div>
      </Section>

      <div style={{ background:C.blueLt, border:`1.5px solid ${C.blueBdr}`, borderRadius:10, padding:"16px 20px", marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.blue, marginBottom:8 }}>تعهد / PLEDGE</div>
        <div style={{ fontSize:13, color:C.text, marginBottom:4 }}>
          I pledge that the requested service is included in the contract and I bear full responsibility in the event of a violation of this.
        </div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>أتعهد بأن الخدمة المطلوبة مدرجة في العقد وأتحمل المسؤولية الكاملة.</div>
        <div style={GRID3}>
          <FInput ar="الاسم" en="NAME" value={F.pledgeName} onChange={v=>upd("pledgeName",v)} placeholder="Full name" req={false}/>
          <FInput ar="رقم الهوية" en="ID NUMBER" value={F.pledgeId} onChange={v=>upd("pledgeId",v)} placeholder="Employee ID" req={false}/>
          <div>
            <FLabel ar="التوقيع" en="SIGNATURE"/>
            <div style={{ height:44, borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"flex-end", paddingBottom:6, color:C.muted, fontSize:13 }}>
              _________________________
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Step 4 (FIX 1: moved outside) ──────────────────────────────────────────
function Step4({ F, upd, total, balanceVal }: { F:FormState; upd:(k:string,v:unknown)=>void; total:number; balanceVal:string }) {
  const fundingLabel = F.planType==="plan"
    ? "Plan in Budget (Div. Manager)"
    : F.planType==="unplan" ? "UnPlan in Budget (Plant Manager)" : "—";

  const items: [string,string,boolean?][] = [
    ["PR NO.","AUTO-GENERATED"],
    ["رقم العقد / CONTRACT NO.",F.contractNo||"—"],
    ["التاريخ / DATE (G)",F.date||"—"],
    ["المحطة / POWER PLANT",F.powerPlant||"—"],
    ["المقاول / CONTRACTOR NAME",F.contractorName||"—"],
    ["مقدم الطلب / REQUESTED BY",F.requesterName||"—"],
    ["شعبة مقدم الطلب / DIVISION FOR REQUESTER",F.division||"—"],
    ["القسم / DEPARTMENT",F.dept||"—"],
    ["مركز التكلفة / COST CENTER",F.costCenter||"—"],
    ["عنصر التكلفة / COST ELEMENT",F.costElement||"—"],
    ["رقم أمر العمل / WORKER ORDER NUMBER",F.workerNumber||"—"],
    ["مصدر التمويل / FUNDING SOURCE",fundingLabel,true],
    ["نوع العمل / WORK TYPE",F.workType||"—"],
    ["موقع العمل / WORKPLACE",F.workplace||"—"],
    ["حالة العمل / WORK STATUS",F.workStatus||"—"],
    ["الرصيد المتبقي / BALANCE",balanceVal?`SAR ${balanceVal}`:"—"],
  ];

  const approvalSteps = [
    "REQUESTED BY","Section Head","Division Manager",
    ...(F.affectsGen==="Yes"?["Generation Management"]:[]),
    "Review by: Budget Group","Review by: TSD Div. Manager",
    ...(F.sparePart==="Yes"||total>=1000000?["Plant Manager"]:[]),
    "SSPP Department Manager (Approval)",
  ];

  return (
    <>
      <Section icon="📋" arTitle="ملخص الطلب" enTitle="SUMMARY">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {items.map(([k,v,hl])=>(
            <div key={k} style={{ background:C.surface, border:`1px solid ${hl?C.blueBdr:C.border}`, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:5, fontWeight:700 }}>{k}</div>
              <div style={{ fontSize:13, fontWeight:700, color:hl?C.blue:C.text }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="⚡" arTitle="مسار الموافقة" enTitle="APPROVAL ROUTING">
        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
          {approvalSteps.map((s,i)=>(
            <React.Fragment key={s}>
              <div style={{
                background:i===approvalSteps.length-1?C.green:i===0?C.blue:"#fff",
                border:`1.5px solid ${i===approvalSteps.length-1?C.green:i===0?C.blue:C.border}`,
                borderRadius:8, padding:"8px 12px", fontSize:11, fontWeight:600,
                color:(i===0||i===approvalSteps.length-1)?"#fff":C.sub,
                whiteSpace:"nowrap", margin:"4px 0",
              }}>{s}</div>
              {i<approvalSteps.length-1&&<div style={{ color:C.muted, fontSize:16, margin:"0 4px" }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ padding:"12px 16px", background:C.blueLt, border:`1px solid ${C.blueBdr}`, borderRadius:8, fontSize:13, fontWeight:600, color:C.blue }}>
          {F.planType==="plan"?"✓ Plan in Budget → Division Manager Final Approval"
            :F.planType==="unplan"?"✓ UnPlan in Budget → Plant Manager Final Approval"
            :"Select a funding source to see final approver"}
        </div>
      </Section>

      <div style={{ background:C.blueLt, border:`1.5px solid ${C.blueBdr}`, borderRadius:10, padding:"16px 20px", marginBottom:24 }}>
        <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }}>
          <input type="checkbox" checked={F.pledged} onChange={e=>upd("pledged",e.target.checked)}
            style={{ width:18, height:18, marginTop:2, accentColor:C.blue, cursor:"pointer", flexShrink:0 }}/>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4 }}>
              أتعهد بأن الخدمة المطلوبة مدرجة في العقد وأتحمل المسؤولية الكاملة.
            </div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>
              I pledge that the requested service is included in the contract and I bear full responsibility in the event of a violation of this.
            </div>
          </div>
        </label>
      </div>
    </>
  );
}

// ── Nav (FIX 1: moved outside) ──────────────────────────────────────────────
function Nav({ step, onPrev, onNext, submitting }: {
  step:number; onPrev:()=>void; onNext:()=>void; submitting:boolean;
}) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, gap:12 }}>
      <button onClick={onPrev}
        style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"11px 24px", color:C.sub, fontSize:13, fontWeight:500, cursor:"pointer" }}>
        {step===0 ? "إلغاء / Cancel" : "← السابق / Previous"}
      </button>
      <div style={{ display:"flex", gap:10 }}>
        {step<4 && (
          <button style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"11px 20px", color:C.muted, fontSize:13, fontWeight:500, cursor:"pointer" }}>
            حفظ مسودة / Save Draft
          </button>
        )}
        <button onClick={onNext} disabled={submitting}
          style={{ background:step===4?C.green:C.blue, border:"none", borderRadius:8, padding:"11px 28px",
            color:"#fff", fontSize:13, fontWeight:600, cursor:submitting?"wait":"pointer",
            opacity:submitting?0.7:1, transition:"all 0.2s", boxShadow:"0 2px 4px rgba(0,0,0,0.1)" }}>
          {submitting?"جاري الإرسال…":step===4?"✓ إرسال الطلب / Submit Request":"التالي / Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export const NewRequestWizard: React.FC<Props> = ({ onDone }) => {
  const [step, setStep]           = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };
  const today = new Date().toISOString().split("T")[0];

  const [F, setF] = useState<FormState>({
    date:today, contractNo:"", powerPlant:"SHUQAIQ STEAM POWER PLANT",
    contractorName:"", workplace:"", workType:"",
    requesterName:"", idNumber:"", dept:"", division:"", costCenter:"", costElement:"",
    workerNumber:"", shortDesc:"", contractLineItem:false, quotation:false, materialBudget:false,
    certifiedRec:"", emsIndex:"", contractValue:"", totalExpPct:"",
    priceAccept:"", materialComment:"", purchasedBefore:"", planType:"", workStatus:"",
    plantCanDo:"", canPostpone:"", affectsGen:"", criticalEquip:"", safetyObs:"",
    safetyObsNum:"", sparePart:"", scopeRows:[],
    safetyEnv:"", opEfficiency:"", pledgeName:"", pledgeId:"", pledged:false,
  });

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setF(p => ({ ...p, requesterName:user.displayName||p.requesterName, dept:user.department||p.dept }));
    });
  }, []);

  const upd = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const total = F.scopeRows.reduce((s,r) => s+(parseFloat(r.cost)||0), 0);

  const balanceVal = (() => {
    const cv = parseFloat(F.contractValue.replace(/,/g,"")) || 0;
    const pct = parseFloat(F.totalExpPct) || 0;
    if (!cv) return "";
    return (cv*(1-pct/100)).toLocaleString("en-SA",{minimumFractionDigits:2,maximumFractionDigits:2});
  })();

  const addRow = () => setF(p=>({...p,scopeRows:[...p.scopeRows,{li:String(p.scopeRows.length+1),cl:"",wo:"",wod:"",fl:"",qty:"",sd:"",ed:"",cost:""}]}));
  const delRow = (i:number) => setF(p=>({...p,scopeRows:p.scopeRows.filter((_,j)=>j!==i)}));
  const updRow = (i:number,k:string,v:string) => setF(p=>({...p,scopeRows:p.scopeRows.map((r,j)=>j===i?{...r,[k]:v}:r)}));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const prNum = await saveToSharePoint(F);
      setSubmitting(false);
      notify(`✓ تم حفظ الطلب ${prNum} في SharePoint بنجاح!`);
      setTimeout(onDone, 2500);
    } catch (e) {
      console.error("SharePoint save failed:", e);
      setSubmitting(false);
      notify(`⚠ فشل الحفظ في SharePoint — ${String(e).slice(0, 80)}`);
      // Stay on form so user can retry
    }
  };

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:28, fontWeight:500 }}>
        محطة شقيق للطاقة · رقم الطلب يُولَّد تلقائياً عند الإرسال · Shuqaiq Power Plant · PR number auto-generated on submission
      </p>
      <StepBar step={step}/>
      {step===0 && <Step0 F={F} upd={upd}/>}
      {step===1 && <Step1 F={F} upd={upd} balanceVal={balanceVal}/>}
      {step===2 && <Step2 scopeRows={F.scopeRows} total={total} addRow={addRow} delRow={delRow} updRow={updRow}/>}
      {step===3 && <Step3 F={F} upd={upd}/>}
      {step===4 && <Step4 F={F} upd={upd} total={total} balanceVal={balanceVal}/>}
      <Nav
        step={step}
        onPrev={() => step===0 ? onDone() : setStep(s=>s-1)}
        onNext={() => { if (step<4) setStep(s=>s+1); else handleSubmit(); }}
        submitting={submitting}
      />
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999,
          padding:"13px 22px", borderRadius:10, fontSize:13, fontWeight:600,
          background: toast.startsWith("✓") ? "#EDF7F0" : "#FEF8E7",
          border: `1.5px solid ${toast.startsWith("✓") ? "#9DDFB3" : "#F0C843"}`,
          color: toast.startsWith("✓") ? "#1A7F3C" : "#8B5E00",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
          {toast}
        </div>
      )}
    </div>
  );
};
