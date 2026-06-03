export const config = {
  dataverseUrl: import.meta.env.VITE_DATAVERSE_URL || "",
  tableName:    import.meta.env.VITE_TABLE_NAME || "cr_procurement_requests",
  appName:      import.meta.env.VITE_APP_NAME || "Procurement Portal",
  isDev:        import.meta.env.DEV,
  isProd:       import.meta.env.PROD,
} as const;
