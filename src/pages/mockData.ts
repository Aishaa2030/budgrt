export interface ScopeRow {
  li: string; cl: string; wo: string; wod: string;
  fl: string; qty: string; sd: string; ed: string; cost: string;
}

export interface PRRequest {
  id: string; date: string; requester: string; dept: string;
  contractor: string; status: string; priority: string;
  type: string; unit: string; amount: number; desc: string;
  contractNo: string; division: string; costCenter: string;
  costElement: string; workplace: string; workType: string;
  idNumber: string; safetyEnv: string; opEfficiency: string;
  safetyObs: string; affectsGen: string; sparePart: string;
  criticalEquip: string;
  fundingSource: string; workStatus: string; shortDesc: string;
  scopeRows: ScopeRow[]; emsIndex: string; contractValue: string;
  totalExpPct: string; priceAccept: string; materialComment: string;
  certifiedRec: string;
  rejectionReason?: string;
  _spId?: number;
  // Extended fields (optional — populated by new wizard)
  workerNumber?: string;
  planType?: string;
  balance?: string;
  contractLineItem?: boolean;
  quotation?: boolean;
  materialThruBudget?: boolean;
  safetyObsNum?: string;
}

export const MOCK_REQUESTS: PRRequest[] = [
  {
    id:"PR-2025-0041",date:"2025-06-15",requester:"Ahmed Al-Rashidi",dept:"Maintenance",
    contractor:"Al-Faris Engineering",status:"pending",priority:"high",type:"CM work",
    unit:"Unit 2",amount:142500,desc:"Turbine seal replacement — steam leak",
    contractNo:"CNT-2025-0088",division:"Generation",costCenter:"1023",costElement:"5500200",
    workplace:"Unit 2",workType:"CM work",idNumber:"1234567890",
    safetyEnv:"Risk of steam leak causing burn injury.",opEfficiency:"Turbine running at 78%.",
    safetyObs:"No",affectsGen:"Yes",sparePart:"No",criticalEquip:"Yes",fundingSource:"Plan in Budget (Div. Manager)",
    workStatus:"Not Started",shortDesc:"Replace worn turbine shaft seal.",
    scopeRows:[
      {li:"1",cl:"4.2.1",wo:"WO-2025-441",wod:"Turbine shaft seal removal",fl:"U2-TRB-001",qty:"1",sd:"2025-06-20",ed:"2025-06-22",cost:"45000"},
      {li:"2",cl:"4.2.2",wo:"WO-2025-442",wod:"New seal installation",fl:"U2-TRB-001",qty:"1",sd:"2025-06-22",ed:"2025-06-24",cost:"62000"},
      {li:"3",cl:"4.2.3",wo:"WO-2025-443",wod:"Commissioning test",fl:"U2-TRB-001",qty:"1",sd:"2025-06-24",ed:"2025-06-25",cost:"35500"},
    ],
    emsIndex:"EMS-4412",contractValue:"2500000",totalExpPct:"38",priceAccept:"accepted",
    materialComment:"Price accepted.",certifiedRec:"Immediate seal replacement required.",
  },
  {
    id:"PR-2025-0040",date:"2025-06-14",requester:"Sara Al-Qasim",dept:"Operations",
    contractor:"Gulf Technical Services",status:"approved",priority:"critical",type:"Repairs",
    unit:"Unit 1",amount:89000,desc:"Emergency cooling system repair",
    contractNo:"CNT-2025-0071",division:"Generation",costCenter:"1010",costElement:"5500100",
    workplace:"Unit 1",workType:"Repairs",idNumber:"9876543210",
    safetyEnv:"Cooling failure risk.",opEfficiency:"Unit 1 derated to 60%.",
    safetyObs:"No",affectsGen:"Yes",sparePart:"No",criticalEquip:"Yes",fundingSource:"UnPlan in Budget (Plant Manager)",
    workStatus:"Started",shortDesc:"Emergency repair of cooling pump.",
    scopeRows:[{li:"1",cl:"3.1.1",wo:"WO-2025-410",wod:"Cooling pump overhaul",fl:"U1-CWP-001",qty:"1",sd:"2025-06-14",ed:"2025-06-16",cost:"89000"}],
    emsIndex:"EMS-3301",contractValue:"1800000",totalExpPct:"22",priceAccept:"accepted",
    materialComment:"Emergency pricing accepted.",certifiedRec:"",
  },
  {
    id:"PR-2025-0039",date:"2025-06-13",requester:"Mohammed Al-Harbi",dept:"Engineering",
    contractor:"Siemens Energy",status:"review",priority:"high",type:"Outage Work",
    unit:"Unit 3",amount:320000,desc:"DCS control panel upgrade",
    contractNo:"CNT-2025-0055",division:"Engineering Support",costCenter:"2031",costElement:"5600300",
    workplace:"Unit 3",workType:"Outage Work",idNumber:"1122334455",
    safetyEnv:"Cyber security risk.",opEfficiency:"Improved control accuracy.",
    safetyObs:"No",affectsGen:"No",sparePart:"Yes",criticalEquip:"Yes",fundingSource:"Plan in Budget (Div. Manager)",
    workStatus:"Not Started",shortDesc:"Full DCS upgrade during planned outage.",
    scopeRows:[
      {li:"1",cl:"7.1.1",wo:"WO-2025-390",wod:"DCS hardware installation",fl:"U3-DCS-001",qty:"1",sd:"2025-07-01",ed:"2025-07-10",cost:"180000"},
      {li:"2",cl:"7.1.2",wo:"WO-2025-391",wod:"Software configuration",fl:"U3-DCS-001",qty:"1",sd:"2025-07-10",ed:"2025-07-15",cost:"90000"},
      {li:"3",cl:"7.1.3",wo:"WO-2025-392",wod:"Commissioning & training",fl:"U3-DCS-001",qty:"1",sd:"2025-07-15",ed:"2025-07-18",cost:"50000"},
    ],
    emsIndex:"EMS-7710",contractValue:"5000000",totalExpPct:"12",priceAccept:"accepted",
    materialComment:"Per Siemens contract.",certifiedRec:"",
  },
  {
    id:"PR-2025-0038",date:"2025-06-12",requester:"Fatima Al-Zahra",dept:"Safety",
    contractor:"ABB Industrial",status:"rejected",priority:"medium",type:"PM work",
    unit:"BOP",amount:55000,desc:"Fire suppression maintenance",
    contractNo:"CNT-2025-0043",division:"HSE",costCenter:"3010",costElement:"5700100",
    workplace:"BOP",workType:"PM work",idNumber:"5566778899",
    safetyEnv:"Annual test required.",opEfficiency:"No impact.",
    safetyObs:"Yes",affectsGen:"No",sparePart:"No",criticalEquip:"Yes",fundingSource:"Plan in Budget (Div. Manager)",
    workStatus:"Not Started",shortDesc:"Annual PM for fire suppression.",
    rejectionReason:"Price exceeds contract allowance. Re-quotation from contractor required.",
    scopeRows:[{li:"1",cl:"9.3.1",wo:"WO-2025-381",wod:"Fire suppression test",fl:"BOP-FPS-001",qty:"1",sd:"2025-06-20",ed:"2025-06-21",cost:"55000"}],
    emsIndex:"EMS-9301",contractValue:"800000",totalExpPct:"45",priceAccept:"rejected",
    materialComment:"Needs re-quotation.",certifiedRec:"",
  },
  {
    id:"PR-2025-0037",date:"2025-06-11",requester:"Khalid Al-Mutairi",dept:"Maintenance",
    contractor:"Honeywell Process",status:"approved",priority:"high",type:"PM work",
    unit:"Unit 3",amount:215000,desc:"Boiler tube replacement — annual",
    contractNo:"CNT-2025-0038",division:"Generation",costCenter:"1023",costElement:"5500200",
    workplace:"Unit 3",workType:"PM work",idNumber:"6677889900",
    safetyEnv:"Tube failure risk.",opEfficiency:"Optimal boiler efficiency.",
    safetyObs:"No",affectsGen:"No",sparePart:"Yes",criticalEquip:"Yes",fundingSource:"Plan in Budget (Div. Manager)",
    workStatus:"Not Started",shortDesc:"Annual boiler tube replacement.",
    scopeRows:[
      {li:"1",cl:"2.5.1",wo:"WO-2025-370",wod:"Boiler tube inspection",fl:"U3-BLR-001",qty:"1",sd:"2025-06-15",ed:"2025-06-18",cost:"65000"},
      {li:"2",cl:"2.5.2",wo:"WO-2025-371",wod:"Tube replacement 24 units",fl:"U3-BLR-001",qty:"24",sd:"2025-06-18",ed:"2025-06-24",cost:"120000"},
      {li:"3",cl:"2.5.3",wo:"WO-2025-372",wod:"Hydraulic pressure test",fl:"U3-BLR-001",qty:"1",sd:"2025-06-24",ed:"2025-06-25",cost:"30000"},
    ],
    emsIndex:"EMS-2501",contractValue:"3000000",totalExpPct:"55",priceAccept:"accepted",
    materialComment:"Within contract schedule.",certifiedRec:"Based on inspection report.",
  },
  {
    id:"PR-2025-0036",date:"2025-06-10",requester:"Nora Al-Otaibi",dept:"Procurement",
    contractor:"Emerson Automation",status:"draft",priority:"medium",type:"Manpower",
    unit:"Unit 2",amount:67800,desc:"Valve actuator procurement × 24",
    contractNo:"CNT-2025-0031",division:"Distribution",costCenter:"4020",costElement:"5800200",
    workplace:"Unit 2",workType:"Manpower",idNumber:"3344556677",
    safetyEnv:"",opEfficiency:"Improves control reliability.",
    safetyObs:"No",affectsGen:"No",sparePart:"Yes",criticalEquip:"No",fundingSource:"Plan in Budget (Div. Manager)",
    workStatus:"Not Started",shortDesc:"24 valve actuators for Unit 2.",
    scopeRows:[{li:"1",cl:"6.2.1",wo:"WO-2025-360",wod:"Supply 24x valve actuators",fl:"U2-VLV-024",qty:"24",sd:"2025-07-01",ed:"2025-07-05",cost:"67800"}],
    emsIndex:"EMS-6201",contractValue:"1200000",totalExpPct:"18",priceAccept:"accepted",
    materialComment:"",certifiedRec:"",
  },
];

// Named alias expected by Dashboard
export const REQUESTS = MOCK_REQUESTS;
