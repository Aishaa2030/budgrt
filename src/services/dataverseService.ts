import type { PRRequest, ScopeRow } from "../pages/mockData";

// ── Configuration ─────────────────────────────────────────────────────────────
// The Dataverse entity set name for table crf19_pr_request1 (plural form)
const TABLE = "crf19_pr_request1s";

// Auto-detect the org URL from the current host when deployed inside Power Apps.
// Set VITE_DATAVERSE_URL in .env for local/standalone development.
function getApiBase(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host.endsWith(".dynamics.com") || host.endsWith(".crm.dynamics.com")) {
    return `${window.location.protocol}//${window.location.host}/api/data/v9.2`;
  }
  return (import.meta.env?.VITE_DATAVERSE_URL ?? "") + "/api/data/v9.2";
}

// ── Column mapping ────────────────────────────────────────────────────────────
// IMPORTANT: Verify these logical column names match your actual Dataverse table.
// Schema names follow the crf19_ publisher prefix of the crf19_pr_request1 table.
const COL = {
  guid:            "crf19_pr_request1id",   // Primary key (auto-GUID)
  id:              "crf19_prnumber",
  date:            "crf19_date",
  requester:       "crf19_requestedby",
  dept:            "crf19_department",
  contractor:      "crf19_contractorname",
  status:          "crf19_approvalstatus",
  priority:        "crf19_priority",
  type:            "crf19_worktype",
  unit:            "crf19_unit",
  amount:          "crf19_totalamount",
  desc:            "crf19_description",
  contractNo:      "crf19_contractnumber",
  division:        "crf19_division",
  costCenter:      "crf19_costcenter",
  costElement:     "crf19_costelement",
  workplace:       "crf19_workplace",
  workType:        "crf19_worktypecategory",
  idNumber:        "crf19_employeeid",
  safetyEnv:       "crf19_safetyenvironment",
  opEfficiency:    "crf19_operationalefficiency",
  safetyObs:       "crf19_safetyobservation",
  affectsGen:      "crf19_affectsgeneration",
  sparePart:       "crf19_sparepartrequired",
  criticalEquip:   "crf19_criticalequipment",
  fundingSource:   "crf19_fundingsource",
  workStatus:      "crf19_workstatus",
  shortDesc:       "crf19_shortdescription",
  scopeRows:       "crf19_scoperows",       // JSON string of ScopeRow[]
  emsIndex:        "crf19_emsindex",
  contractValue:   "crf19_contractvalue",
  totalExpPct:     "crf19_totalexpenditurepct",
  priceAccept:     "crf19_priceacceptance",
  materialComment: "crf19_materialcomment",
  certifiedRec:       "crf19_certifiedrecommendation",
  rejectionReason:    "crf19_rejectionreason",
  workerNumber:       "crf19_workordernumber",
  contractLineItem:   "crf19_contractlineitem",
  quotation:          "crf19_quotation",
  materialThruBudget: "crf19_materialthroubudget",
  safetyObsNum:       "crf19_safetyobsnum",
} as const;

// ── Token storage ─────────────────────────────────────────────────────────────
let _token = "";

export function setToken(t: string) {
  if (!t) {
    console.warn("[Dataverse] No auth token provided");
    return;
  }
  _token = t;
  if (import.meta.env.DEV) {
    console.log("[Dataverse] Token set — length:", t.length);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "Yes";
}

function mapFromDataverse(row: Record<string, unknown>): PRRequest {
  let scopeRows: ScopeRow[] = [];
  try {
    const raw = str(row[COL.scopeRows]);
    if (raw) scopeRows = JSON.parse(raw) as ScopeRow[];
  } catch { /* malformed JSON — leave empty */ }

  return {
    id:              str(row[COL.id]),
    date:            str(row[COL.date]).substring(0, 10),
    requester:       str(row[COL.requester]),
    dept:            str(row[COL.dept]),
    contractor:      str(row[COL.contractor]),
    status:          str(row[COL.status]) || "draft",
    priority:        str(row[COL.priority]) || "medium",
    type:            str(row[COL.type]),
    unit:            str(row[COL.unit]),
    amount:          Number(row[COL.amount] ?? 0),
    desc:            str(row[COL.desc]),
    contractNo:      str(row[COL.contractNo]),
    division:        str(row[COL.division]),
    costCenter:      str(row[COL.costCenter]),
    costElement:     str(row[COL.costElement]),
    workplace:       str(row[COL.workplace]),
    workType:        str(row[COL.workType]),
    idNumber:        str(row[COL.idNumber]),
    safetyEnv:       str(row[COL.safetyEnv]),
    opEfficiency:    str(row[COL.opEfficiency]),
    safetyObs:       str(row[COL.safetyObs]) || "No",
    affectsGen:      str(row[COL.affectsGen]) || "No",
    sparePart:       str(row[COL.sparePart]) || "No",
    criticalEquip:   str(row[COL.criticalEquip]) || "No",
    fundingSource:   str(row[COL.fundingSource]),
    workStatus:      str(row[COL.workStatus]) || "Not Started",
    shortDesc:       str(row[COL.shortDesc]),
    scopeRows,
    emsIndex:        str(row[COL.emsIndex]),
    contractValue:   str(row[COL.contractValue]),
    totalExpPct:     str(row[COL.totalExpPct]),
    priceAccept:     str(row[COL.priceAccept]),
    materialComment: str(row[COL.materialComment]),
    certifiedRec:       str(row[COL.certifiedRec]),
    rejectionReason:    str(row[COL.rejectionReason]) || undefined,
    workerNumber:       str(row[COL.workerNumber]) || undefined,
    contractLineItem:   bool(row[COL.contractLineItem]),
    quotation:          bool(row[COL.quotation]),
    materialThruBudget: bool(row[COL.materialThruBudget]),
    safetyObsNum:       str(row[COL.safetyObsNum]) || undefined,
  };
}

function mapToDataverse(req: Partial<PRRequest>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const set = (col: string, val: unknown) => { if (val !== undefined) out[col] = val; };

  set(COL.id,             req.id);
  set(COL.date,           req.date);
  set(COL.requester,      req.requester);
  set(COL.dept,           req.dept);
  set(COL.contractor,     req.contractor);
  set(COL.status,         req.status);
  set(COL.priority,       req.priority);
  set(COL.type,           req.type);
  set(COL.unit,           req.unit);
  set(COL.amount,         req.amount);
  set(COL.desc,           req.desc);
  set(COL.contractNo,     req.contractNo);
  set(COL.division,       req.division);
  set(COL.costCenter,     req.costCenter);
  set(COL.costElement,    req.costElement);
  set(COL.workplace,      req.workplace);
  set(COL.workType,       req.workType);
  set(COL.idNumber,       req.idNumber);
  set(COL.safetyEnv,      req.safetyEnv);
  set(COL.opEfficiency,   req.opEfficiency);
  set(COL.safetyObs,      req.safetyObs);
  set(COL.affectsGen,     req.affectsGen);
  set(COL.sparePart,      req.sparePart);
  set(COL.criticalEquip,  req.criticalEquip);
  set(COL.fundingSource,  req.fundingSource);
  set(COL.workStatus,     req.workStatus);
  set(COL.shortDesc,      req.shortDesc);
  set(COL.emsIndex,       req.emsIndex);
  set(COL.contractValue,  req.contractValue);
  set(COL.totalExpPct,    req.totalExpPct);
  set(COL.priceAccept,    req.priceAccept);
  set(COL.materialComment, req.materialComment);
  set(COL.certifiedRec,       req.certifiedRec);
  set(COL.rejectionReason,    req.rejectionReason);
  set(COL.workerNumber,       req.workerNumber);
  set(COL.contractLineItem,   req.contractLineItem);
  set(COL.quotation,          req.quotation);
  set(COL.materialThruBudget, req.materialThruBudget);
  set(COL.safetyObsNum,       req.safetyObsNum);
  if (req.scopeRows !== undefined) out[COL.scopeRows] = JSON.stringify(req.scopeRows);

  return out;
}

// ── Safe fetch with 30s timeout ───────────────────────────────────────────────
async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(`API Error ${res.status}: ${errorText.slice(0, 200)}`);
    }
    return res;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timed out after 30 seconds");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function dvFetch(path: string, options: RequestInit = {}): Promise<Record<string, unknown> | null> {
  const base = getApiBase();
  if (!base || base === "/api/data/v9.2") throw new Error("Dataverse URL not configured");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Prefer: "return=representation",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await safeFetch(`${base}/${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 204) return null;
  return res.json() as Promise<Record<string, unknown>>;
}

// Retrieve the Dataverse GUID for a given PR number string
async function getGuid(prNumber: string): Promise<string | null> {
  const data = await dvFetch(
    `${TABLE}?$filter=${COL.id} eq '${encodeURIComponent(prNumber)}'&$select=${COL.guid}&$top=1`
  );
  const rows = (data?.value as Record<string, unknown>[] | undefined) ?? [];
  return str(rows[0]?.[COL.guid]) || null;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchRequests(): Promise<PRRequest[]> {
  try {
    const data = await dvFetch(`${TABLE}?$orderby=${COL.date} desc&$top=500`);
    return ((data?.value as Record<string, unknown>[]) ?? []).map(mapFromDataverse);
  } catch (err) {
    console.warn("[Dataverse] fetchRequests failed, falling back to mock data:", err);
    return [];
  }
}

export async function createRequest(req: PRRequest): Promise<string | null> {
  try {
    const body = mapToDataverse(req);
    const data = await dvFetch(TABLE, { method: "POST", body: JSON.stringify(body) });
    return str(data?.[COL.guid]) || null;
  } catch (err) {
    console.error("[Dataverse] createRequest failed:", err);
    return null;
  }
}

export async function approveRequest(prNumber: string): Promise<boolean> {
  try {
    const guid = await getGuid(prNumber);
    if (!guid) { console.warn("[Dataverse] approveRequest: record not found for", prNumber); return false; }
    await dvFetch(`${TABLE}(${guid})`, {
      method: "PATCH",
      body: JSON.stringify({ [COL.status]: "approved" }),
    });
    return true;
  } catch (err) {
    console.error("[Dataverse] approveRequest failed:", err);
    return false;
  }
}

export async function rejectRequest(prNumber: string, reason: string): Promise<boolean> {
  try {
    const guid = await getGuid(prNumber);
    if (!guid) { console.warn("[Dataverse] rejectRequest: record not found for", prNumber); return false; }
    await dvFetch(`${TABLE}(${guid})`, {
      method: "PATCH",
      body: JSON.stringify({
        [COL.status]: "rejected",
        [COL.rejectionReason]: reason,
      }),
    });
    return true;
  } catch (err) {
    console.error("[Dataverse] rejectRequest failed:", err);
    return false;
  }
}

export async function patchRequest(prNumber: string, updates: Partial<PRRequest>): Promise<boolean> {
  try {
    const guid = await getGuid(prNumber);
    if (!guid) return false;
    await dvFetch(`${TABLE}(${guid})`, {
      method: "PATCH",
      body: JSON.stringify(mapToDataverse(updates)),
    });
    return true;
  } catch (err) {
    console.error("[Dataverse] patchRequest failed:", err);
    return false;
  }
}
