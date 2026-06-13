export const SP_CONFIG = {
  siteUrl: import.meta.env.VITE_SP_SITE_URL || "https://YourTenant.sharepoint.com/sites/YourSite",
  listsNames: {
    requests: "ProcurementRequests",
    jcc: "JCCRecords",
    users: "PRUsers",
  },
};
