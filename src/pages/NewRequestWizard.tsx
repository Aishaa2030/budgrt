/* eslint-disable react-hooks/static-components */
import React, { useState } from "react";
import { createRequest } from "../services/dataverseService";
import type { PRRequest } from "./mockData";

interface Props { onDone: () => void; }

// ── shared primitives ──────────────────────────────────────────────────────
const C = {
  blue:"#1565C0", blueLt:"#E3EEF9", blueBdr:"#90BAF5",
  green:"#1A7F3C", greenLt:"#EDF7F0",
  border:"#D0DFF0", surface:"#F8FAFD",
  text:"#0D1B2E", sub:"#2E4A6B", muted:"#6B85A3",
  warn:"#8B5E00", warnLt:"#FEF8E7", warnBdr:"#F0C843",
};

const inp = (focus: boolean, ro?: boolean): React.CSSProperties => ({
  background: ro ? C.surface : "#fff",
  border: `1.5px solid ${focus ? C.blue : C.border}`,
  borderRadius: 10, padding:"12px 16px", fontSize:13,
  height: 44,
  color: ro ? C.muted : C.text, width:"100%", outline:"none",
  boxShadow: focus && !ro ? `0 0 0 3px rgba(21,101,192,0.15), 0 1px 3px rgba(0,0,0,0.08)` : "0 1px 2px rgba(0,0,0,0.05)",
  transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
});

function FLabel({ ar, en, req }: { ar: string; en: string; req?: boolean }) {
  return (
    <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:8, letterSpacing:"0.3px" }}>
      {ar} <span style={{ letterSpacing:"0.05em", fontWeight:500, color:"#64748B" }}>/ {en}</span>
      {req && <span style={{ color:"#DC2626", marginLeft:2 }}>*</span>}
    </label>
  );
}

function FInput({ ar, en, value, onChange, placeholder, readOnly, hint, type="text" }: {
  ar:string; en:string; value:string; onChange?:(v:string)=>void;
  placeholder?:string; readOnly?:boolean; hint?:string; type?:string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <FLabel ar={ar} en={en} req={!readOnly}/>
      <input type={type} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={inp(focus, readOnly)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}/>
      {hint && <span style={{ fontSize:11, color:C.muted, fontWeight:500 }}>{hint}</span>}
    </div>
  );
}

function FSelect({ ar, en, value, onChange, options }: {
  ar:string; en:string; value:string; onChange:(v:string)=>void; options:string[];
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <FLabel ar={ar} en={en} req/>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inp(focus), cursor:"pointer" }}
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
    <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:32, boxShadow:"0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, background:C.surface,
        display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{arTitle}</span>
        {enTitle && <span style={{ fontSize:12, fontWeight:600, color:C.blue, textTransform:"uppercase", letterSpacing:"0.06em", marginLeft:"auto" }}>— {enTitle}</span>}
      </div>
      <div style={{ padding:"24px 24px" }}>{children}</div>
    </div>
  );
}

function TogRow({ ar, en, value, onChange }: {
  ar:string; en:string; value:string; onChange:(v:string)=>void;
}) {
  const isYes = value === "Yes", isNo = value === "No";
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"14px 18px", background:"#fff",
      border:`1.5px solid ${C.border}`,
      borderLeft: `4px solid ${isYes ? C.blue : isNo ? "#EEA020" : C.border}`,
      borderRadius:10, gap:12, marginBottom:12,
      boxShadow:"0 1px 2px rgba(0,0,0,0.05)",
    }}>
      <div>
        <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{ar}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{en}</div>
      </div>
      <div style={{ display:"flex", gap:0, borderRadius:8, overflow:"hidden", border:`1.5px solid ${C.border}`, flexShrink:0 }}>
        {[["No","لا"],["Yes","نعم"]].map(([v,label]) => (
          <button key={v} onClick={() => onChange(v)}
            style={{
              padding:"7px 16px", fontSize:12, fontWeight:600, border:"none", cursor:"pointer",
              background: value===v ? (v==="Yes" ? C.blue : "#EEA020") : "#fff",
              color: value===v ? "#fff" : C.muted, transition:"all 0.2s",
              height: 36,
            }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TogBtn({ label, active, onClick, color="#fff", activeColor=C.blue }: {
  label:string; active:boolean; onClick:()=>void; color?:string; activeColor?:string;
}) {
  return (
    <button onClick={onClick} style={{
      padding:"8px 16px", borderRadius:8, fontSize:13, cursor:"pointer",
      border: `1.5px solid ${active ? activeColor : C.border}`,
      background: active ? (activeColor === C.blue ? C.blueLt : "#EDF7F0") : "#fff",
      color: active ? activeColor : C.sub,
      fontWeight: active ? 600 : 500, transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
      height: 40,
    }}>{label}</button>
  );
}

const GRID2: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 };
const GRID3: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 };

// ── Main component ──────────────────────────────────────────────────────────
export const NewRequestWizard: React.FC<Props> = ({ onDone }) => {
  const [step, setStep]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [F, setF] = useState({
    date: today, contractNo:"", powerPlant:"SHUQAIQ STEAM POWER PLANT",
    contractorName:"", workplace:"", workType:"",
    requesterName:"", idNumber:"", dept:"", division:"", costCenter:"", costElement:"",
    shortDesc:"", contractLineItem:false, quotation:false, materialBudget:false,
    purchasedBefore:"", plantCanDo:"", canPostpone:"",
    fundingSource:"", workStatus:"",
    affectsGen:"", criticalEquip:"", safetyObs:"", safetyObsNum:"", sparePart:"",
    safetyEnv:"", opEfficiency:"", certifiedRec:"",
    scopeRows: [] as { li:string;cl:string;wo:string;wod:string;fl:string;qty:string;sd:string;ed:string;cost:string }[],
    pledged: false,
  });
  const upd = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));

  const STEPS = [
    { ar:"المعلومات العامة",    en:"GENERAL INFO"   },
    { ar:"معلومات العقد",       en:"CONTRACT INFO"  },
    { ar:"نطاق العمل",         en:"SCOPE"          },
    { ar:"المبررات",           en:"JUSTIFICATION"  },
    { ar:"المراجعة والإرسال",  en:"REVIEW"         },
  ];

  const total = F.scopeRows.reduce((s,r) => s+(parseFloat(r.cost)||0), 0);

  const saveToSharePoint = async (req: PRRequest, prId: string): Promise<boolean> => {
    const siteUrl = "https://seccomsa.sharepoint.com/sites/EmployeeTasks";
    try {
      const digestRes = await fetch(`${siteUrl}/_api/contextinfo`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Accept": "application/json;odata=verbose" },
      });
      const digestData = await digestRes.json();
      const digest: string = digestData?.d?.GetContextWebInformation?.FormDigestValue ?? "";

      const body = {
        __metadata: { type: "SP.Data.PR_x0020_Requests_x0020_MainListItem" },
        Title: req.shortDesc || prId,
        PRNumber: prId,
        ContractNo: req.contractNo,
        Contractor: req.contractor,
        Department: req.dept,
        WorkType: req.workType,
        Workplace: req.workplace,
        Amount: req.amount,
        Status: "pending",
        Priority: "medium",
        RequesterName: req.requester,
        CostCenter: req.costCenter,
        CostElement: req.costElement,
        FundingSource: req.fundingSource,
        WorkStatus: req.workStatus,
        ShortDesc: req.shortDesc,
        ScopeJSON: JSON.stringify(req.scopeRows || []),
      };

      const res = await fetch(
        `${siteUrl}/_api/web/lists/getbytitle('PR Requests Main')/items`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digest,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("[SP] createItem failed:", res.status, errText.slice(0, 300));
        return false;
      }
      return true;
    } catch (e) {
      console.error("[SP] saveToSharePoint error:", e);
      return false;
    }
  };

  const handleSubmit = async () => {
    const year = new Date().getFullYear();
    const prId = `PR-${year}-${String(Date.now()).slice(-4)}`;
    const newReq: PRRequest = {
      id: prId, date: F.date, requester: F.requesterName, dept: F.dept,
      contractor: F.contractorName, status: "pending", priority: "medium",
      type: F.workType, unit: F.workplace, amount: total, desc: F.shortDesc,
      contractNo: F.contractNo, division: F.division, costCenter: F.costCenter,
      costElement: F.costElement, workplace: F.workplace, workType: F.workType,
      idNumber: F.idNumber, safetyEnv: F.safetyEnv, opEfficiency: F.opEfficiency,
      safetyObs: F.safetyObs, affectsGen: F.affectsGen, sparePart: F.sparePart,
      criticalEquip: F.criticalEquip, fundingSource: F.fundingSource,
      workStatus: F.workStatus, shortDesc: F.shortDesc, scopeRows: F.scopeRows,
      emsIndex: "", contractValue: "", totalExpPct: "", priceAccept: "",
      materialComment: "", certifiedRec: F.certifiedRec,
    };
    setSubmitting(true);

    try {
      const listInfoRes = await fetch(
        `https://seccomsa.sharepoint.com/sites/EmployeeTasks/_api/web/lists/getbytitle('PR Requests Main')?$select=Title,EntityTypeName`,
        {
          credentials: "same-origin",
          headers: { "Accept": "application/json;odata=verbose" }
        }
      );
      const listInfo = await listInfoRes.json();
      console.log("List EntityTypeName:", listInfo?.d?.EntityTypeName);
    } catch(e) {
      console.log("List info fetch failed:", e);
    }

    const guid = await createRequest(newReq);
    if (!guid) await saveToSharePoint(newReq, prId);
    setSubmitting(false);
    alert(guid
      ? `✓ Request ${prId} submitted to Dataverse successfully!`
      : `✓ Request ${prId} submitted! (Dataverse sync pending — check connection.)`
    );
    onDone();
  };

  const addRow = () => setF(p => ({ ...p, scopeRows:[...p.scopeRows,{li:String(p.scopeRows.length+1),cl:"",wo:"",wod:"",fl:"",qty:"",sd:"",ed:"",cost:""}] }));
  const delRow = (i:number) => setF(p => ({ ...p, scopeRows: p.scopeRows.filter((_,j)=>j!==i) }));
  const updRow = (i:number, k:string, v:string) => setF(p => ({ ...p, scopeRows: p.scopeRows.map((r,j)=>j===i?{...r,[k]:v}:r) }));

  // ── Step bar ───────────────────────────────────────────────────────────
  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28, overflowX:"auto", paddingBottom:4 }}>
      {STEPS.map((s,i) => {
        const done=i<step, active=i===step;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<STEPS.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:90 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:12, fontWeight:800,
                background: done?"#1A7F3C" : active?C.blue : "#fff",
                border: `2px solid ${done?"#1A7F3C":active?C.blue:C.border}`,
                color: (done||active)?"#fff" : C.muted,
                boxShadow: active ? `0 0 0 4px ${C.blueLt}` : "none",
                transition:"all 0.2s",
              }}>{done?"✓":i+1}</div>
              <div style={{ fontSize:9, fontWeight:700, marginTop:4, textAlign:"center",
                color:active?C.blue:done?"#1A7F3C":C.muted, textTransform:"uppercase", maxWidth:80 }}>
                {s.en}
              </div>
              <div style={{ fontSize:9, color:active?C.blue:done?"#1A7F3C":C.muted, textAlign:"center", maxWidth:80 }}>
                {s.ar}
              </div>
            </div>
            {i<STEPS.length-1 && (
              <div style={{ flex:1, height:2, background:done?"#1A7F3C":C.border, margin:"0 3px 18px", borderRadius:1 }}/>
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Note box ───────────────────────────────────────────────────────────
  const NoteBox = () => (
    <div style={{ background:C.warnLt, border:`1.5px solid ${C.warnBdr}`, borderRadius:10, padding:"12px 16px", fontSize:12, color:C.warn, marginBottom:24, boxShadow:"0 1px 2px rgba(0,0,0,0.05)" }}>
      <strong>ملاحظة:</strong> الأسعار مبنية على نطاق العمل والتفاصيل الواردة في العقد المذكور أعلاه.<br/>
      <span style={{ opacity:0.85, lineHeight:1.5, display:"block", marginTop:4 }}>NOTE: Attached assessment report based on scope of work and pricing details mentioned in the above contract.</span>
    </div>
  );

  // ── Steps ──────────────────────────────────────────────────────────────
  const Step0 = () => (
    <>
      <Section icon="📌" arTitle="رأس الطلب" enTitle="REQUEST HEADER">
        <div style={GRID3}>
          <FInput ar="رقم الطلب" en="PR NO." value="AUTO-GENERATED" readOnly hint="يُنشأ عند الإرسال"/>
          <FInput ar="التاريخ" en="DATE (G)" type="date" value={F.date} onChange={v=>upd("date",v)}/>
          <FInput ar="رقم العقد" en="CONTRACT NO." value={F.contractNo} onChange={v=>upd("contractNo",v)} placeholder="CNT-2025-XXXX"/>
        </div>
        <div style={{ ...GRID2, marginTop:20 }}>
          <FInput ar="المحطة" en="POWER PLANT" value={F.powerPlant} onChange={v=>upd("powerPlant",v)}/>
          <FInput ar="المقاول" en="CONTRACTOR NAME" value={F.contractorName} onChange={v=>upd("contractorName",v)} placeholder="Company name"/>
        </div>
      </Section>

      <Section icon="🏭" arTitle="موقع العمل ونوعه">
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#334155", marginBottom:12 }}>وحدة المحطة / PLANT UNIT <span style={{ color:"#DC2626" }}>*</span></div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {["Unit 1","Unit 2","Unit 3","Unit 4","BOP","Admin"].map(w => (
              <TogBtn key={w} label={w} active={F.workplace===w} onClick={()=>upd("workplace",F.workplace===w?"":w)}/>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:"#334155", marginBottom:12 }}>نوع العمل / TYPE OF WORK <span style={{ color:"#DC2626" }}>*</span></div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {["Manpower","Safety Observation","PM work","CM work","Repairs","Outage Work"].map(t => (
              <TogBtn key={t} label={t} active={F.workType===t} onClick={()=>upd("workType",F.workType===t?"":t)}/>
            ))}
          </div>
        </div>
      </Section>

      <Section icon="👤" arTitle="معلومات مقدم الطلب">
        <div style={GRID3}>
          <FInput ar="الاسم" en="REQUESTER NAME" value={F.requesterName} onChange={v=>upd("requesterName",v)} placeholder="Full name"/>
          <FInput ar="رقم الهوية" en="ID NUMBER" value={F.idNumber} onChange={v=>upd("idNumber",v)} placeholder="Employee ID"/>
          <FSelect ar="القسم" en="DEPARTMENT" value={F.dept} onChange={v=>upd("dept",v)} options={["Maintenance","Operations","Engineering","Safety","Procurement","Finance"]}/>
          <FSelect ar="الشعبة" en="DIVISION" value={F.division} onChange={v=>upd("division",v)} options={["Generation","Transmission","Distribution","Engineering Support","HSE"]}/>
          <FInput ar="مركز التكلفة" en="COST CENTER" value={F.costCenter} onChange={v=>upd("costCenter",v)} placeholder="e.g. 1023"/>
          <FInput ar="عنصر التكلفة" en="COST ELEMENT NO." value={F.costElement} onChange={v=>upd("costElement",v)} placeholder="e.g. 5500200"/>
        </div>
      </Section>

      <Section icon="📝" arTitle="الوصف المختصر">
        <FLabel ar="الوصف المختصر للعمل" en="BRIEF WORK DESCRIPTION" req/>
        <textarea value={F.shortDesc} onChange={e=>upd("shortDesc",e.target.value)} rows={4}
          placeholder="وصف مختصر للعمل المطلوب / Brief description of required work"
          style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"12px 16px",
            color:C.text, fontSize:13, width:"100%", resize:"vertical", outline:"none", lineHeight:1.6, boxShadow:"0 1px 2px rgba(0,0,0,0.05)", transition:"all 0.2s" }}
          onFocus={e=>(e.target.style.borderColor=C.blue, e.target.style.boxShadow=`0 0 0 3px rgba(21,101,192,0.15), 0 1px 3px rgba(0,0,0,0.08)`)}
          onBlur={e=>(e.target.style.borderColor=C.border, e.target.style.boxShadow="0 1px 2px rgba(0,0,0,0.05)")}/>
        <div style={{ marginTop:16, display:"flex", gap:20, flexWrap:"wrap" }}>
          {[{k:"contractLineItem",l:"Contract Line Item"},{k:"quotation",l:"Quotation"},{k:"materialBudget",l:"Material Thru Contract Budget"}].map(c=>(
            <label key={c.k} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.sub, cursor:"pointer" }}>
              <input type="checkbox" checked={(F as never)[c.k]} onChange={e=>upd(c.k,e.target.checked)}
                style={{ width:16, height:16, accentColor:C.blue, cursor:"pointer" }}/>{c.l}
            </label>
          ))}
        </div>
      </Section>
    </>
  );

  const Step1 = () => (
    <>
      <Section icon="📋" arTitle="معلومات العقد" enTitle="CONTRACT INFORMATION">
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
          {["Plan in Budget (Div. Manager)","UnPlan in Budget (Plant Manager)"].map(opt=>(
            <TogBtn key={opt} label={opt} active={F.fundingSource===opt} onClick={()=>upd("fundingSource",opt)}/>
          ))}
        </div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {["Started","Not Started"].map(opt=>(
            <TogBtn key={opt} label={`Work Status: ${opt}`} active={F.workStatus===opt}
              activeColor={C.green} onClick={()=>upd("workStatus",opt)}/>
          ))}
        </div>
      </Section>

      <Section icon="❓" arTitle="أسئلة التقييم السريع">
        <TogRow ar="هل تم الشراء من هذا العقد سابقاً؟" en="Purchased from this contract before?" value={F.purchasedBefore} onChange={v=>upd("purchasedBefore",v)}/>
        <TogRow ar="هل يمكن تنفيذ العمل بواسطة فريق المحطة؟" en="Can work be completed by plant team?" value={F.plantCanDo} onChange={v=>upd("plantCanDo",v)}/>
        <TogRow ar="هل يمكن تأجيل العمل؟" en="Can work be postponed?" value={F.canPostpone} onChange={v=>upd("canPostpone",v)}/>
        <TogRow ar="هل يؤثر العمل على طاقة توليد الوحدة أو المحطة؟" en="Does this work affect unit or plant generation capacity?" value={F.affectsGen} onChange={v=>upd("affectsGen",v)}/>
        <TogRow ar="هل يتعلق بنظام أو معدة حيوية؟" en="Related to critical system / equipment?" value={F.criticalEquip} onChange={v=>upd("criticalEquip",v)}/>
        <TogRow ar="ملاحظة السلامة النشطة (خطر متوسط/عالٍ)؟" en="Active Safety Observation (Medium/High Risk)?" value={F.safetyObs} onChange={v=>upd("safetyObs",v)}/>
        <TogRow ar="هل يتطلب العمل قطع غيار / مواد؟" en="Does this work require spare parts / materials?" value={F.sparePart} onChange={v=>upd("sparePart",v)}/>
        {F.affectsGen==="Yes" && (
          <div style={{ background:"#FEF0F0", border:"1px solid #F5A0A0", borderRadius:8, padding:"12px 14px", fontSize:12, color:"#B71C1C", marginTop:12 }}>
            ⚡ تمت إضافة موافقة إدارة التوليد تلقائياً / Generation Management approval added automatically.
          </div>
        )}
      </Section>
    </>
  );

  const Step2 = () => (
    <>
      <NoteBox/>
      <Section icon="📐" arTitle="نطاق العمل التفصيلي" enTitle="SCOPE OF WORK">
        <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.border}`, boxShadow:"0 1px 2px rgba(0,0,0,0.05)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.surface, borderBottom:`1.5px solid ${C.border}` }}>
                {["#","Line Item","Clause","WO Number","Description","Func. Location","Qty","Start","End","Cost (SAR)",""].map(h=>(
                  <th key={h} style={{ padding:"12px 10px", color:C.muted, fontSize:11, fontWeight:700, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
  {F.scopeRows.length === 0 && (
    <tr>
      <td colSpan={11} style={{ padding: 28, textAlign: "center", color: C.muted, fontSize: 12 }}>
        لا توجد بنود / No items — click "+ إضافة بند"
      </td>
    </tr>
  )}
  
  {F.scopeRows.map((r, i) => (
    <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition:"background 0.2s" }}>
      {/* رقم البند */}
      <td style={{ padding: "10px 8px", color: C.muted, fontWeight:500 }}>{i + 1}</td>
      
      {/* الحقول الديناميكية */}
      {(["li", "cl", "wo", "wod", "fl", "qty", "sd", "ed", "cost"] as const).map((k, ki) => (
        <td key={k} style={{ padding: "6px 6px" }}>
          <input 
            type={k === "sd" || k === "ed" ? "date" : "text"} 
            value={r[k as keyof typeof r] || ""} 
            onChange={e => updRow(i, k as never, e.target.value)} 
            style={{ 
              background: "#fff", 
              border: `1px solid ${C.border}`, 
              borderRadius: 6, 
              padding: "6px 8px",
              fontSize: 12, 
              width: [90, 80, 90, 130, 110, 50, 110, 110, 100][ki], 
              outline: "none", 
              color: C.text,
              transition: "all 0.2s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
            onFocus={e => (e.target.style.borderColor = C.blue, e.target.style.boxShadow = `0 0 0 3px rgba(21,101,192,0.1), 0 1px 2px rgba(0,0,0,0.08)`)}
            onBlur={e => (e.target.style.borderColor = C.border, e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)")}
          />
        </td>
      ))}
      
      {/* زر الحذف */}
      <td style={{ padding: "6px 8px" }}>
        <button 
          onClick={() => delRow(i)} 
          style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: 16, padding: "4px", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#991B1B")}
          onMouseLeave={e => (e.currentTarget.style.color = "#DC2626")}
        >
          ✕
        </button>
      </td>
    </tr>
  ))}
</tbody>
            <tfoot>
              <tr style={{ background:C.blueLt, borderTop:`1.5px solid ${C.border}` }}>
                <td colSpan={10} style={{ padding:"14px 12px", textAlign:"right", fontSize:13, fontWeight:600, color:C.text }}>
                  إجمالي / Total without VAT:&nbsp;
                  <span style={{ color:C.green, fontFamily:"monospace", fontSize:15, fontWeight:700 }}>SAR {total.toLocaleString("en-SA",{minimumFractionDigits:2})}</span>
                </td>
                <td/>
              </tr>
            </tfoot>
          </table>
        </div>
        <button onClick={addRow} style={{ marginTop:16, display:"flex", alignItems:"center", gap:8, background:"none",
          border:`2px dashed ${C.blue}`, borderRadius:8, padding:"10px 20px",
          color:C.blue, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", height:44 }}
          onMouseEnter={e => (e.currentTarget.style.background = `${C.blueLt}40`)}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          + إضافة بند / Add Row
        </button>
      </Section>
    </>
  );

  const Step3 = () => (
    <Section icon="🛡️" arTitle="المبررات والتأثيرات" enTitle="JUSTIFICATIONS">
      {[
        { k:"safetyEnv",   l:"• SAFETY & ENVIRONMENTAL IMPACT",      ph:"Safety or environmental impact…" },
        { k:"opEfficiency",l:"• OPERATIONAL EQUIPMENT EFFICIENCY",    ph:"Operational efficiency impact…"  },
        { k:"certifiedRec",l:"• CERTIFIED RECOMMENDATION",           ph:"Certified technical recommendation…" },
      ].map(item=>(
        <div key={item.k} style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.blue, letterSpacing:"0.05em", marginBottom:8 }}>{item.l}</div>
          <textarea value={(F as never)[item.k]} onChange={e=>upd(item.k,e.target.value)} rows={4}
            placeholder={item.ph}
            style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"12px 16px",
              color:C.text, fontSize:13, width:"100%", resize:"vertical", outline:"none", boxShadow:"0 1px 2px rgba(0,0,0,0.05)", transition:"all 0.2s" }}
            onFocus={e=>(e.target.style.borderColor=C.blue, e.target.style.boxShadow=`0 0 0 3px rgba(21,101,192,0.15), 0 1px 3px rgba(0,0,0,0.08)`)}
            onBlur={e=>(e.target.style.borderColor=C.border, e.target.style.boxShadow="0 1px 2px rgba(0,0,0,0.05)")}/>
        </div>
      ))}
    </Section>
  );

  const Step4 = () => {
    const items: [string,string][] = [
      ["المحطة / POWER PLANT", F.powerPlant||"—"],
      ["رقم العقد / CONTRACT NO.", F.contractNo||"—"],
      ["التاريخ / DATE", F.date||"—"],
      ["مقدم الطلب / REQUESTED BY", F.requesterName||"—"],
      ["القسم / DEPARTMENT", F.dept||"—"],
      ["الشعبة / DIVISION", F.division||"—"],
      ["المقاول / CONTRACTOR", F.contractorName||"—"],
      ["موقع العمل / WORKPLACE", F.workplace||"—"],
      ["نوع العمل / WORK TYPE", F.workType||"—"],
      ["مركز التكلفة / COST CENTER", F.costCenter||"—"],
      ["عنصر التكلفة / COST ELEMENT", F.costElement||"—"],
      ["مصدر التمويل / FUNDING", F.fundingSource||"—"],
    ];
    return (
      <>
        <Section icon="📋" arTitle="ملخص الطلب" enTitle="REQUEST SUMMARY">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {items.map(([k,v])=>(
              <div key={k} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6, fontWeight:600 }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Pledge */}
        <div style={{ background:C.blueLt, border:`1.5px solid ${C.blueBdr}`, borderRadius:10, padding:"16px 20px", marginBottom:24, boxShadow:"0 1px 2px rgba(0,0,0,0.05)" }}>
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
  };

  // ── Bottom nav ─────────────────────────────────────────────────────────
  const Nav = () => (
    <div style={{ display:"flex", justifyContent:"space-between", marginTop:32, gap:12 }}>
      <button onClick={()=>step===0?onDone():setStep(s=>s-1)}
        style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"11px 24px", color:C.sub, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.2s", height:44 }}>
        {step===0 ? "إلغاء / Cancel" : "← السابق / Previous"}
      </button>
      <div style={{ display:"flex", gap:12 }}>
        {step<4 && (
          <button style={{ background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"11px 20px", color:C.muted, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.2s", height:44 }}>
            حفظ مسودة / Save Draft
          </button>
        )}
        <button
          onClick={() => { if (step < 4) setStep(s => s + 1); else handleSubmit(); }}
          disabled={submitting}
          style={{ background:step===4?C.green:C.blue, border:"none", borderRadius:8, padding:"11px 28px",
            color:"#fff", fontSize:13, fontWeight:600, transition:"all 0.2s", height:44,
            boxShadow:"0 2px 4px rgba(0,0,0,0.1)",
            cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "جاري الإرسال…" : step===4 ? "✓ إرسال الطلب / Submit Request" : "التالي / Continue →"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:920, margin:"0 auto" }}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:32, fontWeight:500, letterSpacing:"0.3px" }}>
        محطة شقيق للطاقة · رقم الطلب يُولَّد تلقائياً عند الإرسال ·&nbsp;
        Shuqaiq Power Plant · PR number auto-generated on submission
      </p>
      <StepBar/>
      {step===0 && <Step0/>}
      {step===1 && <Step1/>}
      {step===2 && <Step2/>}
      {step===3 && <Step3/>}
      {step===4 && <Step4/>}
      <Nav/>
    </div>
  );
};
