import { jsxs as a, jsx as e, Fragment as f } from "react/jsx-runtime";
import { useState as n, useEffect as _ } from "react";
import { toast as c } from "@pterodactyl/sdk";
function D() {
  const k = typeof window < "u" && (window.PterodactylUser?.root_admin === !0 || window.PterodactylUser?.root_admin === 1 || window.PterodactylUser?.admin === !0 || window.store?.getState?.()?.user?.data?.rootAdmin === !0), [l, o] = n("settings"), [x, m] = n(!0), [p, u] = n(!1), [C, b] = n(!1), [s, r] = n({
    enabled: !0,
    auto_login: !0,
    require_terms: !1,
    terms_url: "/terms",
    privacy_url: "/privacy",
    bot_protection: "none",
    captcha_site_key: "",
    captcha_secret_key: "",
    block_disposable_emails: !0,
    blocked_domains: "",
    whitelisted_domains: "",
    min_password_length: 8,
    require_special_char: !0,
    require_number: !0,
    rate_limit_per_hour: 5,
    welcome_email_enabled: !0
  }), [d, A] = n({
    total_registered: 0,
    registered_today: 0,
    registered_this_week: 0,
    blocked_attempts: 0
  }), [h, v] = n([]), [y, N] = n(!1), g = () => window.PterodactylUser?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", S = async () => {
    m(!0);
    try {
      const t = await fetch("/api/admin/extensions/user-registration/settings", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": g()
        },
        credentials: "same-origin"
      });
      if (t.ok) {
        const i = await t.json();
        i.settings && r(i.settings), i.stats && A(i.stats);
      }
    } catch (t) {
      console.error("Failed to load admin registration settings:", t);
    } finally {
      m(!1);
    }
  }, w = async () => {
    N(!0);
    try {
      const t = await fetch("/api/admin/extensions/user-registration/logs", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": g()
        },
        credentials: "same-origin"
      });
      if (t.ok) {
        const i = await t.json();
        v(i.logs || []);
      }
    } catch (t) {
      console.error("Failed to fetch registration logs:", t);
    } finally {
      N(!1);
    }
  };
  _(() => {
    S();
  }, []), _(() => {
    l === "logs" && w();
  }, [l]);
  const T = async () => {
    u(!0);
    try {
      const t = await fetch("/api/admin/extensions/user-registration/settings", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": g()
        },
        credentials: "same-origin",
        body: JSON.stringify(s)
      }), i = await t.json();
      t.ok ? (c.success(i.message || "Settings saved successfully"), i.settings && r(i.settings)) : c.error(i.error || "Failed to save settings");
    } catch (t) {
      c.error(t.message || "Error saving settings");
    } finally {
      u(!1);
    }
  }, P = async () => {
    if (window.confirm("Are you sure you want to clear all registration audit logs?")) {
      b(!0);
      try {
        (await fetch("/api/admin/extensions/user-registration/logs", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": g()
          },
          credentials: "same-origin"
        })).ok ? (c.success("Registration audit logs cleared"), v([])) : c.error("Failed to clear logs");
      } catch (t) {
        c.error(t.message || "Error clearing logs");
      } finally {
        b(!1);
      }
    }
  };
  return k ? /* @__PURE__ */ a("div", { className: "reg-container", children: [
    /* @__PURE__ */ a("div", { className: "reg-header", children: [
      /* @__PURE__ */ a("div", { className: "reg-title-wrap", children: [
        /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ e("h1", { className: "reg-title", children: "User Registration Manager" }),
          /* @__PURE__ */ e("span", { className: `reg-badge ${s.enabled ? "reg-badge-success" : "reg-badge-danger"}`, children: s.enabled ? "Public Registration Active" : "Registration Disabled" })
        ] }),
        /* @__PURE__ */ e("p", { className: "reg-subtitle", children: "Configure self-registration rules, anti-bot protection, disposable email filtering, and view sign-up audit logs." })
      ] }),
      /* @__PURE__ */ e("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "reg-btn reg-btn-primary",
          onClick: T,
          disabled: p || x,
          children: p ? /* @__PURE__ */ a(f, { children: [
            /* @__PURE__ */ e("span", { className: "reg-spinner" }),
            /* @__PURE__ */ e("span", { children: "Saving Changes..." })
          ] }) : /* @__PURE__ */ a(f, { children: [
            /* @__PURE__ */ a("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
              /* @__PURE__ */ e("polyline", { points: "17 21 17 13 7 13 7 21" }),
              /* @__PURE__ */ e("polyline", { points: "7 3 7 8 15 8" })
            ] }),
            /* @__PURE__ */ e("span", { children: "Save Settings" })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ a("div", { className: "reg-stats-grid", children: [
      /* @__PURE__ */ a("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ a("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Total Registered" }),
          /* @__PURE__ */ a("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#6366f1", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
            /* @__PURE__ */ e("circle", { cx: "9", cy: "7", r: "4" }),
            /* @__PURE__ */ e("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
            /* @__PURE__ */ e("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: d.total_registered.toLocaleString() })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ a("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Registered Today" }),
          /* @__PURE__ */ a("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#10b981", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("polyline", { points: "12 6 12 12 16 14" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: d.registered_today.toLocaleString() })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ a("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "This Week" }),
          /* @__PURE__ */ a("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#38bdf8", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
            /* @__PURE__ */ e("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: d.registered_this_week.toLocaleString() })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ a("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Threats Blocked" }),
          /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#ef4444", strokeWidth: "2", fill: "none", children: /* @__PURE__ */ e("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", style: { color: d.blocked_attempts > 0 ? "#f87171" : "inherit" }, children: d.blocked_attempts.toLocaleString() })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "reg-tabs", children: [
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${l === "settings" ? "active" : ""}`,
          onClick: () => o("settings"),
          children: "General"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${l === "security" ? "active" : ""}`,
          onClick: () => o("security"),
          children: "Security & Captcha"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${l === "emails" ? "active" : ""}`,
          onClick: () => o("emails"),
          children: "Email Policies"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${l === "logs" ? "active" : ""}`,
          onClick: () => o("logs"),
          children: "Audit Logs"
        }
      )
    ] }),
    l === "settings" && /* @__PURE__ */ a("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "General Registration Preferences" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Control registration accessibility, automated sign-in, and compliance policies." }),
      /* @__PURE__ */ a("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Enable Public User Registration" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "When disabled, new visitors cannot register new accounts." })
        ] }),
        /* @__PURE__ */ a("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: s.enabled,
              onChange: (t) => r({ ...s, enabled: t.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Instant Automatic Login" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Automatically create an active session and redirect new users directly to dashboard." })
        ] }),
        /* @__PURE__ */ a("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: s.auto_login,
              onChange: (t) => r({ ...s, auto_login: t.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Terms & Privacy Agreement" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Users must check a mandatory box agreeing to legal terms before submitting." })
        ] }),
        /* @__PURE__ */ a("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: s.require_terms,
              onChange: (t) => r({ ...s, require_terms: t.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      s.require_terms && /* @__PURE__ */ a("div", { className: "reg-form-grid-2", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Terms of Service URL" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              value: s.terms_url,
              onChange: (t) => r({ ...s, terms_url: t.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Privacy Policy URL" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              value: s.privacy_url,
              onChange: (t) => r({ ...s, privacy_url: t.target.value })
            }
          )
        ] })
      ] })
    ] }),
    l === "security" && /* @__PURE__ */ a("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Bot Protection & Password Standards" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Defend your panel against automated bot attacks and enforce secure credentials." }),
      /* @__PURE__ */ a("div", { className: "reg-form-row", children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Anti-Bot Protection Provider" }),
        /* @__PURE__ */ a(
          "select",
          {
            className: "reg-select",
            value: s.bot_protection,
            onChange: (t) => r({ ...s, bot_protection: t.target.value }),
            children: [
              /* @__PURE__ */ e("option", { value: "none", children: "Disabled (No Captcha)" }),
              /* @__PURE__ */ e("option", { value: "turnstile", children: "Cloudflare Turnstile (Recommended - Fast & Privacy-Friendly)" }),
              /* @__PURE__ */ e("option", { value: "recaptcha_v2", children: "Google reCAPTCHA v2 (Checkbox)" }),
              /* @__PURE__ */ e("option", { value: "recaptcha_v3", children: "Google reCAPTCHA v3 (Invisible Score)" })
            ]
          }
        )
      ] }),
      s.bot_protection !== "none" && /* @__PURE__ */ a("div", { className: "reg-form-grid-2", style: { marginTop: 16 }, children: [
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Captcha Site Key (Public)" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              placeholder: "0x4AAAAAA...",
              value: s.captcha_site_key,
              onChange: (t) => r({ ...s, captcha_site_key: t.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Captcha Secret Key (Private)" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "password",
              className: "reg-input",
              placeholder: "0x4AAAAAA...",
              value: s.captcha_secret_key,
              onChange: (t) => r({ ...s, captcha_secret_key: t.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("div", { style: { marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--reg-card-border)" }, children: [
        /* @__PURE__ */ a("div", { className: "reg-form-grid-2", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "Minimum Password Length" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                className: "reg-input",
                min: 6,
                max: 64,
                value: s.min_password_length,
                onChange: (t) => r({ ...s, min_password_length: Number(t.target.value) })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Default is 8 characters." })
          ] }),
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "IP Rate Limit (PerHour)" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                className: "reg-input",
                min: 1,
                max: 100,
                value: s.rate_limit_per_hour,
                onChange: (t) => r({ ...s, rate_limit_per_hour: Number(t.target.value) })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Maximum sign-ups allowed per single IP per hour." })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "reg-switch-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
            /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Number (0-9)" }),
            /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "User passwords must contain at least one numerical digit." })
          ] }),
          /* @__PURE__ */ a("label", { className: "reg-switch", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: s.require_number,
                onChange: (t) => r({ ...s, require_number: t.target.checked })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-slider" })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "reg-switch-row", children: [
          /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
            /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Special Character / Symbol" }),
            /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "User passwords must contain at least one symbol (!@#$%^&*)." })
          ] }),
          /* @__PURE__ */ a("label", { className: "reg-switch", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: s.require_special_char,
                onChange: (t) => r({ ...s, require_special_char: t.target.checked })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-slider" })
          ] })
        ] })
      ] })
    ] }),
    l === "emails" && /* @__PURE__ */ a("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Email Domain Rules" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Control which email providers and domains are accepted on this installation." }),
      /* @__PURE__ */ a("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ a("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Block Disposable & Temporary Inboxes" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Automatically rejects 200+ popular burner domains (10minutemail, temp-mail, guerrillamail, mailinator, etc.)." })
        ] }),
        /* @__PURE__ */ a("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: s.block_disposable_emails,
              onChange: (t) => r({ ...s, block_disposable_emails: t.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-form-row", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Custom Blocked Domains (Blacklist)" }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "reg-textarea",
            placeholder: "spamdomain.com, fake-mail.org (comma or newline separated)",
            value: s.blocked_domains,
            onChange: (t) => r({ ...s, blocked_domains: t.target.value })
          }
        ),
        /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Any email ending in these domains will be rejected immediately." })
      ] }),
      /* @__PURE__ */ a("div", { className: "reg-form-row", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Authorized Domains Only (Whitelist)" }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "reg-textarea",
            placeholder: "Leave empty to allow all valid domains. (e.g. company.com, school.edu)",
            value: s.whitelisted_domains,
            onChange: (t) => r({ ...s, whitelisted_domains: t.target.value })
          }
        ),
        /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Optional: If populated, ONLY users with emails matching these domains can register." })
      ] })
    ] }),
    l === "logs" && /* @__PURE__ */ a("div", { className: "reg-card", children: [
      /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }, children: [
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Registration Audit Trail" }),
          /* @__PURE__ */ e("p", { className: "reg-card-desc", style: { marginBottom: 0 }, children: "Live history of recent registration events and blocked attempts." })
        ] }),
        /* @__PURE__ */ a("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "reg-btn reg-btn-secondary",
              onClick: w,
              disabled: y,
              children: "Refresh"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "reg-btn reg-btn-danger",
              onClick: P,
              disabled: C || h.length === 0,
              children: "Clear History"
            }
          )
        ] })
      ] }),
      y ? /* @__PURE__ */ a("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)" }, children: [
        /* @__PURE__ */ e("span", { className: "reg-spinner" }),
        /* @__PURE__ */ e("p", { style: { marginTop: 8, fontSize: "0.84rem" }, children: "Loading logs..." })
      ] }) : h.length === 0 ? /* @__PURE__ */ e("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)", fontSize: "0.84rem" }, children: "No registration activity recorded yet." }) : /* @__PURE__ */ e("div", { className: "reg-table-wrap", children: /* @__PURE__ */ a("table", { className: "reg-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ a("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Date & Time" }),
          /* @__PURE__ */ e("th", { children: "User Details" }),
          /* @__PURE__ */ e("th", { children: "IP Address" }),
          /* @__PURE__ */ e("th", { children: "Status" }),
          /* @__PURE__ */ e("th", { children: "Details" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: h.map((t) => {
          let i = "reg-badge-neutral";
          return t.status === "success" ? i = "reg-badge-success" : t.status.startsWith("blocked_") ? i = "reg-badge-danger" : t.status === "disabled" && (i = "reg-badge-warning"), /* @__PURE__ */ a("tr", { children: [
            /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap", color: "var(--reg-text-subtle)", fontSize: "0.75rem" }, children: new Date(t.created_at).toLocaleString() }),
            /* @__PURE__ */ a("td", { children: [
              /* @__PURE__ */ e("div", { style: { fontWeight: 600, color: "#ffffff" }, children: t.username }),
              /* @__PURE__ */ e("div", { style: { fontSize: "0.75rem", color: "var(--reg-text-muted)" }, children: t.email })
            ] }),
            /* @__PURE__ */ e("td", { style: { fontFamily: "monospace", fontSize: "0.78rem" }, children: t.ip_address }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: `reg-badge ${i}`, children: t.status.replace(/_/g, " ") }) }),
            /* @__PURE__ */ e("td", { style: { fontSize: "0.75rem", color: "var(--reg-text-muted)" }, children: t.details || "—" })
          ] }, t.id);
        }) })
      ] }) })
    ] })
  ] }) : /* @__PURE__ */ a("div", { className: "reg-container", style: { textAlign: "center", padding: "60px 20px" }, children: [
    /* @__PURE__ */ e("h3", { style: { color: "#ef4444" }, children: "Access Denied" }),
    /* @__PURE__ */ e("p", { style: { color: "var(--reg-text-muted)" }, children: "Root administrator privileges are required to view this page." })
  ] });
}
export {
  D as default
};
