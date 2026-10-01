export function adminReturnPath(value?: string) { return ["/admin", "/admin/security", "/admin/audit"].includes(value ?? "") ? value! : "/admin"; }
