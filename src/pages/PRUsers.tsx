/*
 * SharePoint List: PRUsers
 * Columns needed:
 *   - Title (default) = DisplayName
 *   - Email (Single line text)
 *   - DisplayName (Single line text)
 *   - Role (Choice: admin, approver, requester, viewer)
 *   - Department (Single line text)
 */
import React, { useState, useEffect } from "react";
import { COLORS } from "../theme";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SP_CONFIG } from "../config/sharepoint";

interface PRUser {
  Id: number;
  Email: string;
  DisplayName: string;
  Role: string;
  Department: string;
}

const ROLES = ["admin", "approver", "requester", "viewer"];

export const PRUsersPage: React.FC = () => {
  const [users, setUsers] = useState<PRUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("requester");
  const [newDept, setNewDept] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const sp = spfi(SP_CONFIG.siteUrl).using(SPFx((window as any)._pcfContext));

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    sp.web.lists.getByTitle("PRUsers").items
      .select("Id","Email","DisplayName","Role","Department")
      .top(100)()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const addUser = async () => {
    if (!newEmail || !newName) return;
    try {
      await sp.web.lists.getByTitle("PRUsers").items.add({
        Title: newName,
        Email: newEmail,
        DisplayName: newName,
        Role: newRole,
        Department: newDept,
      });
      setUsers(prev => [...prev, { Id: Date.now(), Email: newEmail, DisplayName: newName, Role: newRole, Department: newDept }]);
      setNewEmail(""); setNewName(""); setNewRole("requester"); setNewDept("");
      notify("✓ User added successfully");
    } catch (e) {
      notify("✕ Failed to add user");
    }
  };

  const updateRole = async (id: number, role: string) => {
    try {
      await sp.web.lists.getByTitle("PRUsers").items.getById(id).update({ Role: role });
      setUsers(prev => prev.map(u => u.Id === id ? { ...u, Role: role } : u));
      notify("✓ Role updated");
    } catch { notify("✕ Update failed"); }
  };

  const removeUser = async (id: number) => {
    try {
      await sp.web.lists.getByTitle("PRUsers").items.getById(id).delete();
      setUsers(prev => prev.filter(u => u.Id !== id));
      notify("✓ User removed");
    } catch { notify("✕ Remove failed"); }
  };

  const roleColor: Record<string, string> = {
    admin:     "#B71C1C",
    approver:  "#1565C0",
    requester: "#1A7F3C",
    viewer:    "#6B85A3",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, margin: 0 }}>
          إدارة المستخدمين — User Access Management
        </h1>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 5 }}>
          تحديد صلاحيات المستخدمين / Define user roles and permissions
        </p>
      </div>

      {/* Role Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { role: "admin",     ar: "مدير النظام",    desc: "كل الصلاحيات"          },
          { role: "approver",  ar: "معتمد",           desc: "يعتمد ويرفض الطلبات"   },
          { role: "requester", ar: "مقدم طلب",        desc: "يرفع طلبات جديدة"      },
          { role: "viewer",    ar: "مشاهد",           desc: "يشوف فقط"              },
        ].map(r => (
          <div key={r.role} style={{ background: COLORS.surface,
            border: `1.5px solid ${roleColor[r.role]}33`,
            borderTop: `3px solid ${roleColor[r.role]}`,
            borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: roleColor[r.role],
              textTransform: "uppercase" }}>{r.role}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginTop: 3 }}>{r.ar}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Add User */}
      <div style={{ background: COLORS.surface, border: `1.5px solid ${COLORS.border}`,
        borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.text,
          marginBottom: 14, textTransform: "uppercase" }}>
          ➕ إضافة مستخدم / Add User
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Email", val: newEmail, set: setNewEmail, placeholder: "user@sec.com.sa" },
            { label: "Full Name", val: newName, set: setNewName, placeholder: "Ahmed Al-..." },
            { label: "Department", val: newDept, set: setNewDept, placeholder: "Maintenance" },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textMuted,
                textTransform: "uppercase", marginBottom: 5 }}>{f.label}</div>
              <input value={f.val} onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "8px 11px",
                  background: COLORS.surfaceGray, border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 7, fontSize: 12, color: COLORS.text,
                  outline: "none", boxSizing: "border-box" as const }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textMuted,
              textTransform: "uppercase", marginBottom: 5 }}>ROLE</div>
            <select value={newRole} onChange={e => setNewRole(e.target.value)}
              style={{ width: "100%", padding: "8px 11px",
                background: COLORS.surfaceGray, border: `1.5px solid ${COLORS.border}`,
                borderRadius: 7, fontSize: 12, color: COLORS.text, outline: "none" }}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <button onClick={addUser}
          style={{ background: COLORS.accent, border: "none", borderRadius: 8,
            padding: "9px 22px", color: "#fff", fontSize: 12,
            fontWeight: 700, cursor: "pointer" }}>
          ➕ Add User
        </button>
      </div>

      {/* Users Table */}
      <div style={{ background: COLORS.surface, border: `1.5px solid ${COLORS.border}`,
        borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.surfaceGray, fontSize: 13, fontWeight: 800, color: COLORS.text }}>
          المستخدمون — Users ({users.length})
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted }}>
            جاري التحميل...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.surfaceGray }}>
                {["Email","الاسم","القسم","الدور","إجراء"].map(h => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left",
                    fontSize: 10, fontWeight: 700, color: COLORS.textMuted,
                    borderBottom: `1px solid ${COLORS.border}`,
                    textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.Id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: COLORS.text }}>
                    {u.Email}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                    {u.DisplayName}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: COLORS.textMuted }}>
                    {u.Department}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <select value={u.Role}
                      onChange={e => updateRole(u.Id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11,
                        fontWeight: 700, cursor: "pointer", outline: "none",
                        background: roleColor[u.Role] + "18",
                        border: `1.5px solid ${roleColor[u.Role]}44`,
                        color: roleColor[u.Role] }}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <button onClick={() => removeUser(u.Id)}
                      style={{ background: COLORS.dangerBg,
                        border: `1px solid ${COLORS.dangerBdr}`,
                        borderRadius: 6, padding: "5px 12px",
                        color: COLORS.danger, fontSize: 11,
                        fontWeight: 600, cursor: "pointer" }}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center",
                  color: COLORS.textMuted, fontSize: 13 }}>
                  لا يوجد مستخدمون / No users yet
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          padding: "13px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: COLORS.successBg, border: `1.5px solid ${COLORS.successBdr}`,
          color: COLORS.success, boxShadow: "0 8px 24px rgba(21,101,192,0.15)" }}>
          {toast}
        </div>
      )}
    </div>
  );
};
