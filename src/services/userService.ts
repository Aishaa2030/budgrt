export interface M365User {
  displayName: string;
  mail: string;
  userPrincipalName: string;
  id: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

let _graphToken = "";
export function setGraphToken(t: string) { _graphToken = t; }

export async function getCurrentUser(): Promise<M365User | null> {
  // Try Power Apps context first
  if (window._pcfContext?.userSettings?.userName) {
    return {
      displayName: window._pcfContext.userSettings.userName,
      mail: window._pcfContext.userSettings.userId || "",
      userPrincipalName: window._pcfContext.userSettings.userId || "",
      id: "",
    };
  }

  // Try Microsoft Graph API
  if (_graphToken) {
    try {
      const res = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${_graphToken}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  // Fallback: try MSAL if available
  if (window.msalInstance) {
    const accounts = window.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      return {
        displayName: accounts[0].name || accounts[0].username,
        mail: accounts[0].username,
        userPrincipalName: accounts[0].username,
        id: accounts[0].localAccountId,
      };
    }
  }

  return null;
}

declare global {
  interface Window {
    _pcfContext?: any;
    _graphToken?: string;
    msalInstance?: any;
  }
}
