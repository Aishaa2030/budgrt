/* eslint-disable @typescript-eslint/no-explicit-any */
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SP_CONFIG } from "../config/sharepoint";

let _sp: ReturnType<typeof spfi> | null = null;

export function initSP(context: any) {
  _sp = spfi(SP_CONFIG.siteUrl).using(SPFx(context));
}

export async function getRequests() {
  if (!_sp) throw new Error("SP not initialized");
  const items = await _sp.web
    .lists.getByTitle(SP_CONFIG.listsNames.requests)
    .items
    .select("Id","Title","PRNumber","ContractNo","Contractor","Department","WorkType","Workplace","Amount","Status","Priority","RequesterName","CostCenter","CostElement","FundingSource","WorkStatus","ScopeJSON","ApprovalsJSON","SafetyEnv","OpEfficiency","AffectsGen","SparePart","ShortDesc","CertifiedRec","Created")
    .orderBy("Created", false)
    .top(100)();
  return items.map(mapItem);
}

export async function createRequest(form: Record<string, unknown>) {
  if (!_sp) throw new Error("SP not initialized");
  const rows = (form.scopeRows as {cost:string}[]) || [];
  const total = rows.reduce((s, r) => s + (parseFloat(r.cost) || 0), 0);
  const prNumber = `PR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  await _sp.web.lists.getByTitle(SP_CONFIG.listsNames.requests).items.add({
    Title: String(form.shortDesc || prNumber),
    PRNumber: prNumber,
    ContractNo: form.contractNo,
    Contractor: form.contractorName,
    Department: form.requesterDept,
    WorkType: form.workType,
    Workplace: form.workplace,
    Amount: total,
    Status: "pending",
    Priority: "high",
    RequesterName: form.requesterName,
    CostCenter: form.costCenter,
    CostElement: form.costElement,
    FundingSource: form.fundingSource,
    WorkStatus: form.workStatus,
    ShortDesc: form.shortDesc,
    ScopeJSON: JSON.stringify(form.scopeRows || []),
    ApprovalsJSON: JSON.stringify([
      {id:1,role:"Requested By",name:form.requesterName,status:"pending",ts:null,comment:null},
      {id:2,role:"Section Head",name:"",status:"waiting",ts:null,comment:null},
      {id:3,role:"Division Manager",name:"",status:"waiting",ts:null,comment:null},
      {id:4,role:"Budget Group",name:"",status:"waiting",ts:null,comment:null},
      {id:5,role:"TSD Div. Manager",name:"",status:"waiting",ts:null,comment:null},
      {id:6,role:"SSPP Dept. Manager",name:"",status:"waiting",ts:null,comment:null},
    ]),
    SafetyEnv: form.safetyEnv,
    OpEfficiency: form.opEfficiency,
    CertifiedRec: form.certifiedRec,
    AffectsGen: form.affectsGen === "Yes",
    SparePart: form.sparePart === "Yes",
  });
  return prNumber;
}

export async function updateRequestStatus(spId: number, status: string, comment: string, approverName: string, stepIndex: number) {
  if (!_sp) throw new Error("SP not initialized");
  const item = await _sp.web.lists.getByTitle(SP_CONFIG.listsNames.requests).items.getById(spId).select("ApprovalsJSON")();
  const approvals = JSON.parse(item.ApprovalsJSON || "[]") as {status:string;ts:string|null;comment:string|null;name:string}[];
  if (approvals[stepIndex]) {
    approvals[stepIndex].status = status;
    approvals[stepIndex].ts = new Date().toISOString().replace("T"," ").slice(0,16);
    approvals[stepIndex].comment = comment;
    approvals[stepIndex].name = approverName;
  }
  const allApproved = approvals.every(a => a.status === "approved");
  const anyRejected = approvals.some(a => a.status === "rejected");
  const newStatus = anyRejected ? "rejected" : allApproved ? "approved" : "review";
  await _sp.web.lists.getByTitle(SP_CONFIG.listsNames.requests).items.getById(spId).update({
    Status: newStatus,
    ApprovalsJSON: JSON.stringify(approvals),
  });
}

function mapItem(item: Record<string, unknown>) {
  return {
    _spId: item["Id"] as number,
    id: String(item["PRNumber"] || `PR-${item["Id"]}`),
    date: String(item["Created"] || "").split("T")[0],
    requester: String(item["RequesterName"] || ""),
    dept: String(item["Department"] || ""),
    contractor: String(item["Contractor"] || ""),
    status: String(item["Status"] || "draft").toLowerCase(),
    priority: String(item["Priority"] || "medium").toLowerCase(),
    type: String(item["WorkType"] || ""),
    unit: String(item["Workplace"] || ""),
    amount: Number(item["Amount"]) || 0,
    desc: String(item["Title"] || ""),
    contractNo: String(item["ContractNo"] || ""),
    division: String(item["Division"] || ""),
    costCenter: String(item["CostCenter"] || ""),
    costElement: String(item["CostElement"] || ""),
    workplace: String(item["Workplace"] || ""),
    workType: String(item["WorkType"] || ""),
    idNumber: "",
    safetyEnv: String(item["SafetyEnv"] || ""),
    opEfficiency: String(item["OpEfficiency"] || ""),
    safetyObs: item["SafetyObs"] ? "Yes" : "No",
    safetyObsNum: String(item["SafetyObsNum"] || ""),
    affectsGen: item["AffectsGen"] ? "Yes" : "No",
    sparePart: item["SparePart"] ? "Yes" : "No",
    fundingSource: String(item["FundingSource"] || ""),
    workStatus: String(item["WorkStatus"] || ""),
    shortDesc: String(item["ShortDesc"] || ""),
    scopeRows: safeJSON(String(item["ScopeJSON"] || "[]")),
    approvals: safeJSON(String(item["ApprovalsJSON"] || "[]")),
    emsIndex: String(item["EmsIndex"] || ""),
    contractValue: String(item["ContractValue"] || ""),
    totalExpPct: String(item["TotalExpPct"] || ""),
    priceAccept: String(item["PriceAccept"] || ""),
    materialComment: String(item["MaterialComment"] || ""),
    certifiedRec: String(item["CertifiedRec"] || ""),
    canPostpone: item["CanPostpone"] ? "Yes" : "No",
    plantCanDo: item["PlantCanDo"] ? "Yes" : "No",
    purchasedBefore: item["PurchasedBefore"] ? "Yes" : "No",
    criticalEquip: item["CriticalEquip"] ? "Yes" : "No",
  };
}

function safeJSON(str: string) {
  try { return JSON.parse(str); } catch { return []; }
}
