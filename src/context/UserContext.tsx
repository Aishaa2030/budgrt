import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  department?: string;
  division?: string;
  businessUnit?: string;
  jobTitle?: string;
}

interface UserCtx {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
}

const Ctx = createContext<UserCtx>({
  user: null,
  loading: true,
  error: null,
});

/**
 * Fetch the current user from Dataverse systemuser table.
 * Falls back to Azure AD context if available.
 */
async function fetchCurrentUser(): Promise<CurrentUser> {
  try {
    // Attempt 1: Check if running in Power Apps context with Xrm available
    if (typeof window !== "undefined" && (window as any).Xrm?.Utility?.getGlobalContext) {
      const context = (window as any).Xrm.Utility.getGlobalContext();
      const userSettings = context.userSettings;
      const userId = userSettings.userId.replace(/[{}]/g, "");
      const userName = userSettings.userName;
      const [firstName, ...lastNameParts] = userName.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      return {
        id: userId,
        firstName: firstName || "User",
        lastName: lastName || "",
        fullName: userName,
        email: userSettings.securityRoles?.[0] || "",
        department: undefined,
        division: undefined,
        businessUnit: undefined,
        jobTitle: undefined,
      };
    }

    // Attempt 2: Fetch from Dataverse systemuser table (requires auth)
    const apiBase = getApiBase();
    const headers = {
      "Accept": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
    };

    const response = await fetch(
      `${apiBase}/systemusers?$select=systemuserid,firstname,lastname,internalemailaddress,crf19_department,crf19_division`,
      { headers, credentials: "include" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const data = await response.json();
    const users = data.value || [];

    if (users.length === 0) {
      throw new Error("No user found in Dataverse");
    }

    // Return the first (current) user
    const userData = users[0];
    const firstName = String(userData.firstname || "").trim();
    const lastName = String(userData.lastname || "").trim();
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";

    return {
      id: userData.systemuserid,
      firstName: firstName || "User",
      lastName: lastName || "",
      fullName,
      email: userData.internalemailaddress || "",
      department: String(userData.crf19_department || "").trim() || undefined,
      division: String(userData.crf19_division || "").trim() || undefined,
      businessUnit: undefined,
      jobTitle: undefined,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Fallback to mock user
    return {
      id: "unknown-user-id",
      firstName: "User",
      lastName: "",
      fullName: "Unknown User",
      email: "user@example.com",
      department: undefined,
      division: undefined,
    };
  }
}

/**
 * Auto-detect the Dataverse API base URL
 */
function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host.endsWith(".dynamics.com") || host.endsWith(".crm.dynamics.com")) {
    return `${window.location.protocol}//${window.location.host}/api/data/v9.2`;
  }
  return (import.meta.env?.VITE_DATAVERSE_URL ?? "") + "/api/data/v9.2";
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        console.error("Failed to load user:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, error }}>
      {children}
    </Ctx.Provider>
  );
};

export const useUser = () => {
  const context = useContext(Ctx);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

/**
 * Extract initials from a full name.
 * E.g., "Ahmed Al-Rashidi" -> "AA"
 *       "John Smith" -> "JS"
 *       "Mohammed" -> "M"
 */
export function getInitials(fullName: string | undefined): string {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Helper to get a user-friendly display name with fallback
 */
export function getDisplayName(user: CurrentUser | null | undefined): string {
  if (!user) return "Unknown User";
  return user.fullName || `${user.firstName} ${user.lastName}`.trim() || "Unknown User";
}

/**
 * Helper to get department with fallback
 */
export function getDepartment(user: CurrentUser | null | undefined): string {
  if (!user) return "Department";
  return user.department || user.division || "Department";
}
