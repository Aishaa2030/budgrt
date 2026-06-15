export const COLORS = {
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceGray: "#F8F9FB",
  border: "#E2E6EA",
  accent: "#0066CC",
  accentLight: "#EBF3FC",
  approved: "#1A7F3C",
  pending: "#8B5E00",
  underReview: "#0066CC",
  rejected: "#B71C1C",
  draft: "#8A96A3",
  waiting: "#B0BAC4",
  text: "#0D1B2E",
  textMuted: "#6B85A3",
  danger: "#B71C1C",
  dangerBg: "#FEF0F0",
  dangerBdr: "#F5A0A0",
  success: "#1A7F3C",
  successBg: "#EDF7F0",
  successBdr: "#9DDFB3",
};

export const FONT_FAMILY = "'Segoe UI','SF Pro Display','sans-serif',Arial,Helvetica";

export const SC: Record<string, { bg: string; bdr: string; txt: string; dot: string; label: { en: string; ar: string } }> = {
  approved: { bg:"#EDF7F0", bdr:"#9DDFB3", txt:"#1A7F3C", dot:"#2E7D52", label:{ en:"Approved",           ar:"معتمد"           }},
  pending:  { bg:"#FEF8E7", bdr:"#F0C843", txt:"#8B5E00", dot:"#D4A017", label:{ en:"Pending",             ar:"قيد الانتظار"    }},
  review:   { bg:"#EBF3FC", bdr:"#90C3F5", txt:"#0066CC", dot:"#0066CC", label:{ en:"Under Review",        ar:"قيد المراجعة"    }},
  rejected: { bg:"#FEF0F0", bdr:"#F5A0A0", txt:"#B71C1C", dot:"#CC2222", label:{ en:"Rejected",            ar:"مرفوض"           }},
  draft:    { bg:"#F5F7FA", bdr:"#E2E6EA", txt:"#8A96A3", dot:"#B0BAC4", label:{ en:"Draft (Not Submitted)",ar:"مسودة (لم تُرسَل)"}},
  waiting:  { bg:"#F5F7FA", bdr:"#E2E6EA", txt:"#B0BAC4", dot:"#B0BAC4", label:{ en:"Awaiting",            ar:"في انتظار الدور" }},
};
