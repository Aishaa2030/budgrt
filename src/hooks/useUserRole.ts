import { useState, useEffect } from "react";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { SP_CONFIG } from "../config/sharepoint";

export type UserRole = "admin" | "approver" | "requester" | "viewer";

export interface UserAccess {
  email: string;
  name: string;
  role: UserRole;
  department: string;
  canApprove: boolean;
  canAdmin: boolean;
  canCreate: boolean;
}

export function useUserRole(): { user: UserAccess | null; loading: boolean } {
  const [user, setUser] = useState<UserAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Get current user email from SharePoint
        const sp = spfi(SP_CONFIG.siteUrl).using(
          SPFx((window as any)._pcfContext)
        );
        const me = await sp.web.currentUser();
        const email = me.Email?.toLowerCase() || "";

        // Check PRUsers list for role
        try {
          const items = await sp.web
            .lists.getByTitle("PRUsers")
            .items
            .filter(`Email eq '${email}'`)
            .select("Email","DisplayName","Role","Department")
            .top(1)();

          if (items.length > 0) {
            const u = items[0];
            const role = (u.Role || "requester").toLowerCase() as UserRole;
            setUser({
              email,
              name: u.DisplayName || me.Title,
              role,
              department: u.Department || "",
              canApprove: role === "admin" || role === "approver",
              canAdmin:   role === "admin",
              canCreate:  role !== "viewer",
            });
          } else {
            // Default: requester
            setUser({
              email,
              name: me.Title,
              role: "requester",
              department: "",
              canApprove: false,
              canAdmin: false,
              canCreate: true,
            });
          }
        } catch {
          setUser({
            email,
            name: me.Title,
            role: "requester",
            department: "",
            canApprove: false,
            canAdmin: false,
            canCreate: true,
          });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { user, loading };
}
