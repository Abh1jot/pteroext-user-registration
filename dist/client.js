await Promise.all(["user-registration.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsxs as t, jsx as e, Fragment as j } from "react/jsx-runtime";
import { useState as l, useEffect as R } from "react";
import { toast as P, definePterodactylExtension as Z } from "@pterodactyl/sdk";
import { createRoot as Y } from "react-dom/client";
function Q() {
  const m = typeof window < "u" && (window.PterodactylUser?.root_admin === !0 || window.PterodactylUser?.root_admin === 1 || window.PterodactylUser?.admin === !0 || window.store?.getState?.()?.user?.data?.rootAdmin === !0), [o, h] = l("settings"), [n, v] = l(!0), [w, _] = l(!1), [N, f] = l(!1), [a, i] = l({
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
  }), [c, y] = l({
    total_registered: 0,
    registered_today: 0,
    registered_this_week: 0,
    blocked_attempts: 0
  }), [x, A] = l([]), [g, L] = l(!1), u = () => window.PterodactylUser?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", W = async () => {
    v(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/settings", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": u()
        },
        credentials: "same-origin"
      });
      if (r.ok) {
        const d = await r.json();
        d.settings && i(d.settings), d.stats && y(d.stats);
      }
    } catch (r) {
      console.error("Failed to load admin registration settings:", r);
    } finally {
      v(!1);
    }
  }, S = async () => {
    L(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/logs", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": u()
        },
        credentials: "same-origin"
      });
      if (r.ok) {
        const d = await r.json();
        A(d.logs || []);
      }
    } catch (r) {
      console.error("Failed to fetch registration logs:", r);
    } finally {
      L(!1);
    }
  };
  R(() => {
    W();
  }, []), R(() => {
    o === "logs" && S();
  }, [o]);
  const M = async () => {
    _(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/settings", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": u()
        },
        credentials: "same-origin",
        body: JSON.stringify(a)
      }), d = await r.json();
      r.ok ? (P.success(d.message || "Settings saved successfully"), d.settings && i(d.settings)) : P.error(d.error || "Failed to save settings");
    } catch (r) {
      P.error(r.message || "Error saving settings");
    } finally {
      _(!1);
    }
  }, C = async () => {
    if (window.confirm("Are you sure you want to clear all registration audit logs?")) {
      f(!0);
      try {
        (await fetch("/api/admin/extensions/user-registration/logs", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": u()
          },
          credentials: "same-origin"
        })).ok ? (P.success("Registration audit logs cleared"), A([])) : P.error("Failed to clear logs");
      } catch (r) {
        P.error(r.message || "Error clearing logs");
      } finally {
        f(!1);
      }
    }
  };
  return m ? /* @__PURE__ */ t("div", { className: "reg-container", children: [
    /* @__PURE__ */ t("div", { className: "reg-header", children: [
      /* @__PURE__ */ t("div", { className: "reg-title-wrap", children: [
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ e("h1", { className: "reg-title", children: "User Registration Manager" }),
          /* @__PURE__ */ e("span", { className: `reg-badge ${a.enabled ? "reg-badge-success" : "reg-badge-danger"}`, children: a.enabled ? "Public Registration Active" : "Registration Disabled" })
        ] }),
        /* @__PURE__ */ e("p", { className: "reg-subtitle", children: "Configure self-registration rules, anti-bot protection, disposable email filtering, and view sign-up audit logs." })
      ] }),
      /* @__PURE__ */ e("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "reg-btn reg-btn-primary",
          onClick: M,
          disabled: w || n,
          children: w ? /* @__PURE__ */ t(j, { children: [
            /* @__PURE__ */ e("span", { className: "reg-spinner" }),
            /* @__PURE__ */ e("span", { children: "Saving Changes..." })
          ] }) : /* @__PURE__ */ t(j, { children: [
            /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
              /* @__PURE__ */ e("polyline", { points: "17 21 17 13 7 13 7 21" }),
              /* @__PURE__ */ e("polyline", { points: "7 3 7 8 15 8" })
            ] }),
            /* @__PURE__ */ e("span", { children: "Save Settings" })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ t("div", { className: "reg-stats-grid", children: [
      /* @__PURE__ */ t("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ t("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Total Registered" }),
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#6366f1", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
            /* @__PURE__ */ e("circle", { cx: "9", cy: "7", r: "4" }),
            /* @__PURE__ */ e("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
            /* @__PURE__ */ e("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: c.total_registered.toLocaleString() })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ t("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Registered Today" }),
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#10b981", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("polyline", { points: "12 6 12 12 16 14" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: c.registered_today.toLocaleString() })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ t("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "This Week" }),
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#38bdf8", strokeWidth: "2", fill: "none", children: [
            /* @__PURE__ */ e("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
            /* @__PURE__ */ e("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
          ] })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", children: c.registered_this_week.toLocaleString() })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-stat-card", children: [
        /* @__PURE__ */ t("div", { className: "reg-stat-header", children: [
          /* @__PURE__ */ e("span", { className: "reg-stat-label", children: "Threats Blocked" }),
          /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "#ef4444", strokeWidth: "2", fill: "none", children: /* @__PURE__ */ e("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) })
        ] }),
        /* @__PURE__ */ e("span", { className: "reg-stat-val", style: { color: c.blocked_attempts > 0 ? "#f87171" : "inherit" }, children: c.blocked_attempts.toLocaleString() })
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "reg-tabs", children: [
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "settings" ? "active" : ""}`,
          onClick: () => h("settings"),
          children: "General"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "security" ? "active" : ""}`,
          onClick: () => h("security"),
          children: "Security & Captcha"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "emails" ? "active" : ""}`,
          onClick: () => h("emails"),
          children: "Email Policies"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "logs" ? "active" : ""}`,
          onClick: () => h("logs"),
          children: "Audit Logs"
        }
      )
    ] }),
    o === "settings" && /* @__PURE__ */ t("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "General Registration Preferences" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Control registration accessibility, automated sign-in, and compliance policies." }),
      /* @__PURE__ */ t("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Enable Public User Registration" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "When disabled, new visitors cannot register new accounts." })
        ] }),
        /* @__PURE__ */ t("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: a.enabled,
              onChange: (r) => i({ ...a, enabled: r.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Instant Automatic Login" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Automatically create an active session and redirect new users directly to dashboard." })
        ] }),
        /* @__PURE__ */ t("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: a.auto_login,
              onChange: (r) => i({ ...a, auto_login: r.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Terms & Privacy Agreement" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Users must check a mandatory box agreeing to legal terms before submitting." })
        ] }),
        /* @__PURE__ */ t("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: a.require_terms,
              onChange: (r) => i({ ...a, require_terms: r.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      a.require_terms && /* @__PURE__ */ t("div", { className: "reg-form-grid-2", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ t("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Terms of Service URL" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              value: a.terms_url,
              onChange: (r) => i({ ...a, terms_url: r.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Privacy Policy URL" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              value: a.privacy_url,
              onChange: (r) => i({ ...a, privacy_url: r.target.value })
            }
          )
        ] })
      ] })
    ] }),
    o === "security" && /* @__PURE__ */ t("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Bot Protection & Password Standards" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Defend your panel against automated bot attacks and enforce secure credentials." }),
      /* @__PURE__ */ t("div", { className: "reg-form-row", children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Anti-Bot Protection Provider" }),
        /* @__PURE__ */ t(
          "select",
          {
            className: "reg-select",
            value: a.bot_protection,
            onChange: (r) => i({ ...a, bot_protection: r.target.value }),
            children: [
              /* @__PURE__ */ e("option", { value: "none", children: "Disabled (No Captcha)" }),
              /* @__PURE__ */ e("option", { value: "turnstile", children: "Cloudflare Turnstile (Recommended - Fast & Privacy-Friendly)" }),
              /* @__PURE__ */ e("option", { value: "recaptcha_v2", children: "Google reCAPTCHA v2 (Checkbox)" }),
              /* @__PURE__ */ e("option", { value: "recaptcha_v3", children: "Google reCAPTCHA v3 (Invisible Score)" })
            ]
          }
        )
      ] }),
      a.bot_protection !== "none" && /* @__PURE__ */ t("div", { className: "reg-form-grid-2", style: { marginTop: 16 }, children: [
        /* @__PURE__ */ t("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Captcha Site Key (Public)" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "text",
              className: "reg-input",
              placeholder: "0x4AAAAAA...",
              value: a.captcha_site_key,
              onChange: (r) => i({ ...a, captcha_site_key: r.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Captcha Secret Key (Private)" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "password",
              className: "reg-input",
              placeholder: "0x4AAAAAA...",
              value: a.captcha_secret_key,
              onChange: (r) => i({ ...a, captcha_secret_key: r.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ t("div", { style: { marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--reg-card-border)" }, children: [
        /* @__PURE__ */ t("div", { className: "reg-form-grid-2", children: [
          /* @__PURE__ */ t("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "Minimum Password Length" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                className: "reg-input",
                min: 6,
                max: 64,
                value: a.min_password_length,
                onChange: (r) => i({ ...a, min_password_length: Number(r.target.value) })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Default is 8 characters." })
          ] }),
          /* @__PURE__ */ t("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "IP Rate Limit (PerHour)" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                className: "reg-input",
                min: 1,
                max: 100,
                value: a.rate_limit_per_hour,
                onChange: (r) => i({ ...a, rate_limit_per_hour: Number(r.target.value) })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Maximum sign-ups allowed per single IP per hour." })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-switch-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
            /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Number (0-9)" }),
            /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "User passwords must contain at least one numerical digit." })
          ] }),
          /* @__PURE__ */ t("label", { className: "reg-switch", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: a.require_number,
                onChange: (r) => i({ ...a, require_number: r.target.checked })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-slider" })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-switch-row", children: [
          /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
            /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Require Special Character / Symbol" }),
            /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "User passwords must contain at least one symbol (!@#$%^&*)." })
          ] }),
          /* @__PURE__ */ t("label", { className: "reg-switch", children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: a.require_special_char,
                onChange: (r) => i({ ...a, require_special_char: r.target.checked })
              }
            ),
            /* @__PURE__ */ e("span", { className: "reg-slider" })
          ] })
        ] })
      ] })
    ] }),
    o === "emails" && /* @__PURE__ */ t("div", { className: "reg-card", children: [
      /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Email Domain Rules" }),
      /* @__PURE__ */ e("p", { className: "reg-card-desc", children: "Control which email providers and domains are accepted on this installation." }),
      /* @__PURE__ */ t("div", { className: "reg-switch-row", children: [
        /* @__PURE__ */ t("div", { className: "reg-switch-text", children: [
          /* @__PURE__ */ e("p", { className: "reg-switch-title", children: "Block Disposable & Temporary Inboxes" }),
          /* @__PURE__ */ e("p", { className: "reg-switch-desc", children: "Automatically rejects 200+ popular burner domains (10minutemail, temp-mail, guerrillamail, mailinator, etc.)." })
        ] }),
        /* @__PURE__ */ t("label", { className: "reg-switch", children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: a.block_disposable_emails,
              onChange: (r) => i({ ...a, block_disposable_emails: r.target.checked })
            }
          ),
          /* @__PURE__ */ e("span", { className: "reg-slider" })
        ] })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-form-row", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Custom Blocked Domains (Blacklist)" }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "reg-textarea",
            placeholder: "spamdomain.com, fake-mail.org (comma or newline separated)",
            value: a.blocked_domains,
            onChange: (r) => i({ ...a, blocked_domains: r.target.value })
          }
        ),
        /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Any email ending in these domains will be rejected immediately." })
      ] }),
      /* @__PURE__ */ t("div", { className: "reg-form-row", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ e("label", { className: "reg-label", children: "Authorized Domains Only (Whitelist)" }),
        /* @__PURE__ */ e(
          "textarea",
          {
            className: "reg-textarea",
            placeholder: "Leave empty to allow all valid domains. (e.g. company.com, school.edu)",
            value: a.whitelisted_domains,
            onChange: (r) => i({ ...a, whitelisted_domains: r.target.value })
          }
        ),
        /* @__PURE__ */ e("span", { className: "reg-label-sub", children: "Optional: If populated, ONLY users with emails matching these domains can register." })
      ] })
    ] }),
    o === "logs" && /* @__PURE__ */ t("div", { className: "reg-card", children: [
      /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }, children: [
        /* @__PURE__ */ t("div", { children: [
          /* @__PURE__ */ e("h3", { className: "reg-card-title", children: "Registration Audit Trail" }),
          /* @__PURE__ */ e("p", { className: "reg-card-desc", style: { marginBottom: 0 }, children: "Live history of recent registration events and blocked attempts." })
        ] }),
        /* @__PURE__ */ t("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "reg-btn reg-btn-secondary",
              onClick: S,
              disabled: g,
              children: "Refresh"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "reg-btn reg-btn-danger",
              onClick: C,
              disabled: N || x.length === 0,
              children: "Clear History"
            }
          )
        ] })
      ] }),
      g ? /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)" }, children: [
        /* @__PURE__ */ e("span", { className: "reg-spinner" }),
        /* @__PURE__ */ e("p", { style: { marginTop: 8, fontSize: "0.84rem" }, children: "Loading logs..." })
      ] }) : x.length === 0 ? /* @__PURE__ */ e("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)", fontSize: "0.84rem" }, children: "No registration activity recorded yet." }) : /* @__PURE__ */ e("div", { className: "reg-table-wrap", children: /* @__PURE__ */ t("table", { className: "reg-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ t("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Date & Time" }),
          /* @__PURE__ */ e("th", { children: "User Details" }),
          /* @__PURE__ */ e("th", { children: "IP Address" }),
          /* @__PURE__ */ e("th", { children: "Status" }),
          /* @__PURE__ */ e("th", { children: "Details" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: x.map((r) => {
          let d = "reg-badge-neutral";
          return r.status === "success" ? d = "reg-badge-success" : r.status.startsWith("blocked_") ? d = "reg-badge-danger" : r.status === "disabled" && (d = "reg-badge-warning"), /* @__PURE__ */ t("tr", { children: [
            /* @__PURE__ */ e("td", { style: { whiteSpace: "nowrap", color: "var(--reg-text-subtle)", fontSize: "0.75rem" }, children: new Date(r.created_at).toLocaleString() }),
            /* @__PURE__ */ t("td", { children: [
              /* @__PURE__ */ e("div", { style: { fontWeight: 600, color: "#ffffff" }, children: r.username }),
              /* @__PURE__ */ e("div", { style: { fontSize: "0.75rem", color: "var(--reg-text-muted)" }, children: r.email })
            ] }),
            /* @__PURE__ */ e("td", { style: { fontFamily: "monospace", fontSize: "0.78rem" }, children: r.ip_address }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e("span", { className: `reg-badge ${d}`, children: r.status.replace(/_/g, " ") }) }),
            /* @__PURE__ */ e("td", { style: { fontSize: "0.75rem", color: "var(--reg-text-muted)" }, children: r.details || "—" })
          ] }, r.id);
        }) })
      ] }) })
    ] })
  ] }) : /* @__PURE__ */ t("div", { className: "reg-container", style: { textAlign: "center", padding: "60px 20px" }, children: [
    /* @__PURE__ */ e("h3", { style: { color: "#ef4444" }, children: "Access Denied" }),
    /* @__PURE__ */ e("p", { style: { color: "var(--reg-text-muted)" }, children: "Root administrator privileges are required to view this page." })
  ] });
}
const ee = ({ isOpen: m, onClose: o, onSwitchToLogin: h }) => {
  const [n, v] = l({
    enabled: !0,
    auto_login: !0,
    require_terms: !1,
    terms_url: "/terms",
    privacy_url: "/privacy",
    bot_protection: "none",
    captcha_site_key: "",
    min_password_length: 8,
    require_special_char: !0,
    require_number: !0
  }), [w, _] = l(!0), [N, f] = l(""), [a, i] = l(""), [c, y] = l(""), [x, A] = l(""), [g, L] = l(""), [u, W] = l(""), [S, M] = l(!1), [C, r] = l(!1), [d, F] = l(!1), [I, p] = l(null), [U, H] = l(null), [$, re] = l("");
  R(() => {
    if (!m) return;
    (async () => {
      const b = [
        "/api/public/registration/config",
        "/auth/public-register/config",
        "/api/client/extensions/user-registration/config"
      ];
      for (const z of b)
        try {
          const T = await fetch(z, {
            headers: { Accept: "application/json" }
          });
          if (T.ok) {
            const q = await T.json();
            v(q);
            break;
          }
        } catch {
        }
      _(!1);
    })();
  }, [m]);
  const B = ((s) => {
    let b = 0;
    return s ? (s.length >= (n.min_password_length || 8) && b++, /[0-9]/.test(s) && b++, /[^a-zA-Z0-9]/.test(s) && b++, /[A-Z]/.test(s) && /[a-z]/.test(s) && b++, b <= 1 ? { score: 1, text: "Weak", color: "#ef4444" } : b === 2 ? { score: 2, text: "Fair", color: "#f59e0b" } : b === 3 ? { score: 3, text: "Good", color: "var(--reg-primary, #2563eb)" } : { score: 4, text: "Strong", color: "#10b981" }) : { score: 0, text: "", color: "transparent" };
  })(g), K = g.length > 0 && u.length > 0 && g === u, X = u.length > 0 && g !== u, G = async (s) => {
    if (s.preventDefault(), p(null), !N.trim() || !a.trim()) {
      p("Please enter both your first and last name.");
      return;
    }
    if (!c.trim() || c.length < 3) {
      p("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(c)) {
      p("Username can only contain letters, numbers, hyphens, and underscores.");
      return;
    }
    if (!x.trim() || !x.includes("@")) {
      p("Please provide a valid email address.");
      return;
    }
    if (g.length < (n.min_password_length || 8)) {
      p(`Password must be at least ${n.min_password_length || 8} characters long.`);
      return;
    }
    if (n.require_number && !/[0-9]/.test(g)) {
      p("Password must include at least one number.");
      return;
    }
    if (n.require_special_char && !/[^a-zA-Z0-9]/.test(g)) {
      p("Password must include at least one special character or symbol.");
      return;
    }
    if (g !== u) {
      p("Passwords do not match.");
      return;
    }
    if (n.require_terms && !S) {
      p("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    F(!0);
    const b = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", z = {
      firstname: N.trim(),
      lastname: a.trim(),
      username: c.trim(),
      email: x.trim(),
      password: g,
      password_confirmation: u,
      terms: S,
      captcha_token: $
    }, T = [
      "/api/public/registration/register",
      "/auth/public-register/register",
      "/auth/public-register",
      "/api/client/extensions/user-registration/register"
    ];
    let q = !1;
    for (const V of T)
      try {
        const E = await fetch(V, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": b,
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify(z)
        });
        if (E.status === 404)
          continue;
        const k = await E.json().catch(() => null);
        if (!k) continue;
        if (E.ok && k.success) {
          q = !0, H(k.message || "Account created successfully! Redirecting to login..."), setTimeout(() => {
            window.location.href = k.redirect || "/auth/login";
          }, 1200);
          break;
        } else if (k.error || k.errors) {
          const J = k.error || (Array.isArray(k.errors) ? k.errors[0]?.detail : null) || "Registration failed.";
          p(J);
          break;
        }
      } catch {
      }
    !q && !I && p("Registration failed. Please check your information and try again."), F(!1);
  };
  return m ? /* @__PURE__ */ e("div", { className: "reg-modal-backdrop", onClick: o, children: /* @__PURE__ */ t("div", { className: "reg-modal-card", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e("button", { type: "button", className: "reg-modal-close", onClick: o, title: "Close", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
      /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ] }) }),
    /* @__PURE__ */ t("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ e("h2", { style: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }, children: "Create an Account" }),
      /* @__PURE__ */ e("p", { style: { fontSize: "0.8125rem", color: "var(--reg-text-muted)", margin: 0 }, children: "Join the platform to deploy, configure, and manage your game servers." })
    ] }),
    !w && !n.enabled ? /* @__PURE__ */ e("div", { className: "reg-alert reg-alert-danger", children: /* @__PURE__ */ e("span", { children: "Public registration is currently disabled by administrator." }) }) : U ? (
      /* Success View */
      /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "24px 8px" }, children: [
        /* @__PURE__ */ e("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "24", height: "24", stroke: "#10b981", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ e("h3", { style: { fontSize: "1.15rem", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }, children: "Registration Successful!" }),
        /* @__PURE__ */ e("p", { style: { fontSize: "0.84rem", color: "var(--reg-text-muted)", margin: "0 0 20px 0", lineHeight: 1.5 }, children: U }),
        /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.8125rem", color: "var(--reg-primary, #2563eb)", marginBottom: 18 }, children: [
          /* @__PURE__ */ e("span", { className: "reg-spinner", style: { borderTopColor: "var(--reg-primary, #2563eb)" } }),
          /* @__PURE__ */ e("span", { children: "Redirecting to login..." })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "reg-btn reg-btn-primary",
            style: { width: "100%", height: 42 },
            onClick: () => {
              h ? h() : window.location.href = "/auth/login";
            },
            children: "Proceed to Login"
          }
        )
      ] })
    ) : (
      /* Form View */
      /* @__PURE__ */ t("form", { onSubmit: G, children: [
        I && /* @__PURE__ */ t("div", { className: "reg-alert reg-alert-danger", children: [
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ] }),
          /* @__PURE__ */ e("span", { children: I })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-form-grid-2", children: [
          /* @__PURE__ */ t("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "First Name" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "text",
                className: "reg-input",
                placeholder: "John",
                value: N,
                onChange: (s) => f(s.target.value),
                required: !0,
                autoComplete: "given-name"
              }
            )
          ] }),
          /* @__PURE__ */ t("div", { children: [
            /* @__PURE__ */ e("label", { className: "reg-label", children: "Last Name" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "text",
                className: "reg-input",
                placeholder: "Doe",
                value: a,
                onChange: (s) => i(s.target.value),
                required: !0,
                autoComplete: "family-name"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-form-row", children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Username" }),
          /* @__PURE__ */ t("div", { className: "reg-input-wrap", children: [
            /* @__PURE__ */ e("span", { className: "reg-input-icon", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "15", height: "15", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
              /* @__PURE__ */ e("circle", { cx: "12", cy: "7", r: "4" })
            ] }) }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "text",
                className: "reg-input has-icon",
                placeholder: "johndoe",
                value: c,
                onChange: (s) => y(s.target.value.toLowerCase().replace(/\s+/g, "")),
                required: !0,
                autoComplete: "username"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-form-row", children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Email Address" }),
          /* @__PURE__ */ t("div", { className: "reg-input-wrap", children: [
            /* @__PURE__ */ e("span", { className: "reg-input-icon", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "15", height: "15", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
              /* @__PURE__ */ e("polyline", { points: "22,6 12,13 2,6" })
            ] }) }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "email",
                className: "reg-input has-icon",
                placeholder: "john@example.com",
                value: x,
                onChange: (s) => A(s.target.value),
                required: !0,
                autoComplete: "email"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-form-row", children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Password" }),
          /* @__PURE__ */ t("div", { className: "reg-input-wrap", children: [
            /* @__PURE__ */ e("span", { className: "reg-input-icon", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "15", height: "15", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
              /* @__PURE__ */ e("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
            ] }) }),
            /* @__PURE__ */ e(
              "input",
              {
                type: C ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: g,
                onChange: (s) => L(s.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "reg-input-action",
                onClick: () => r(!C),
                title: C ? "Hide password" : "Show password",
                children: C ? /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
                  /* @__PURE__ */ e("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
                ] }) : /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                  /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "3" })
                ] })
              }
            )
          ] }),
          g.length > 0 && /* @__PURE__ */ t("div", { className: "reg-strength-container", children: [
            /* @__PURE__ */ e("div", { className: "reg-strength-bars", children: [1, 2, 3, 4].map((s) => /* @__PURE__ */ e(
              "div",
              {
                className: "reg-strength-bar",
                style: {
                  backgroundColor: s <= B.score ? B.color : void 0
                }
              },
              s
            )) }),
            /* @__PURE__ */ t("div", { className: "reg-strength-label", children: [
              /* @__PURE__ */ t("span", { children: [
                "Security: ",
                /* @__PURE__ */ e("strong", { style: { color: B.color }, children: B.text })
              ] }),
              /* @__PURE__ */ t("span", { children: [
                "Min ",
                n.min_password_length,
                " chars"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "reg-form-row", children: [
          /* @__PURE__ */ e("label", { className: "reg-label", children: "Confirm Password" }),
          /* @__PURE__ */ t("div", { className: "reg-input-wrap", children: [
            /* @__PURE__ */ e("span", { className: "reg-input-icon", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "15", height: "15", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
              /* @__PURE__ */ e("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
              /* @__PURE__ */ e("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
            ] }) }),
            /* @__PURE__ */ e(
              "input",
              {
                type: C ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: u,
                onChange: (s) => W(s.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            K && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#10b981", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
            X && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#ef4444", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: [
              /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] }) })
          ] })
        ] }),
        n.require_terms && /* @__PURE__ */ e("div", { style: { margin: "14px 0 18px 0" }, children: /* @__PURE__ */ t("label", { style: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: "0.8125rem", color: "var(--reg-text-muted)" }, children: [
          /* @__PURE__ */ e(
            "input",
            {
              type: "checkbox",
              checked: S,
              onChange: (s) => M(s.target.checked),
              style: { marginTop: 2, accentColor: "var(--reg-primary, #2563eb)" },
              required: !0
            }
          ),
          /* @__PURE__ */ t("span", { children: [
            "I agree to the",
            " ",
            /* @__PURE__ */ e("a", { href: n.terms_url, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--reg-primary, #2563eb)", textDecoration: "underline" }, children: "Terms of Service" }),
            " ",
            "and",
            " ",
            /* @__PURE__ */ e("a", { href: n.privacy_url, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--reg-primary, #2563eb)", textDecoration: "underline" }, children: "Privacy Policy" }),
            "."
          ] })
        ] }) }),
        /* @__PURE__ */ e("div", { style: { marginTop: 20 }, children: /* @__PURE__ */ e(
          "button",
          {
            type: "submit",
            className: "reg-btn reg-btn-primary",
            style: { width: "100%", height: 42, fontSize: "0.9rem" },
            disabled: d,
            children: d ? /* @__PURE__ */ t(j, { children: [
              /* @__PURE__ */ e("span", { className: "reg-spinner" }),
              /* @__PURE__ */ e("span", { children: "Creating Account..." })
            ] }) : "Create Account"
          }
        ) }),
        /* @__PURE__ */ t("div", { style: { marginTop: 18, textAlign: "center", fontSize: "0.8125rem", color: "var(--reg-text-muted)" }, children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                h ? h() : window.location.href = "/auth/login";
              },
              style: { background: "transparent", border: "none", color: "var(--reg-primary, #2563eb)", fontWeight: 600, cursor: "pointer", padding: 0 },
              children: "Sign in here →"
            }
          )
        ] })
      ] })
    )
  ] }) }) : null;
}, te = () => {
  const [m, o] = l(!1);
  return R(() => {
    const n = () => {
      const v = window.location.pathname.toLowerCase(), w = window.location.hash.toLowerCase();
      (v.endsWith("/register") || w === "#register") && o(!0);
    };
    return n(), window.addEventListener("hashchange", n), () => window.removeEventListener("hashchange", n);
  }, []), R(() => {
    if (typeof document > "u") return;
    const n = "pteroext-reg-inline-link", v = "pteroext-reg-inline-container", w = () => {
      if (window.PterodactylUser || document.getElementById(n) || !(window.location.pathname.includes("/auth") || window.location.pathname.includes("/login"))) return;
      const f = document.querySelector('a[href*="/auth/password"], a[href*="/password"]');
      if (!f) return;
      const a = document.createElement("div");
      a.id = v;
      const i = document.createElement("a");
      i.id = n, i.href = "#register", i.textContent = "Create an account", f.className && (i.className = f.className);
      const c = window.getComputedStyle(f);
      i.style.fontFamily = c.fontFamily, i.style.fontSize = c.fontSize, i.style.fontWeight = c.fontWeight, i.style.lineHeight = c.lineHeight, i.style.letterSpacing = c.letterSpacing, i.style.textTransform = c.textTransform, i.style.cursor = "pointer", i.style.display = "inline-block";
      const y = f.parentElement;
      y && (window.getComputedStyle(y).display === "flex" || y.className.includes("flex")) && y.children.length > 1 && y ? (a.style.display = "block", a.style.textAlign = "right", a.style.marginTop = "4px", a.style.marginBottom = "2px", y.insertAdjacentElement("afterend", a)) : y && (a.style.display = "block", a.style.marginTop = "6px", a.style.textAlign = c.textAlign || "center", f.insertAdjacentElement("afterend", a)), i.addEventListener("click", (A) => {
        A.preventDefault(), o(!0);
      }), a.appendChild(i);
    };
    w();
    const _ = new MutationObserver(() => {
      w();
    });
    return _.observe(document.body, { childList: !0, subtree: !0 }), () => {
      _.disconnect();
      const N = document.getElementById(v);
      N && N.remove();
    };
  }, []), typeof window < "u" && !!window.PterodactylUser ? null : /* @__PURE__ */ e(
    ee,
    {
      isOpen: m,
      onClose: () => {
        o(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
      },
      onSwitchToLogin: () => {
        o(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname), !window.location.pathname.includes("/auth/login") && !window.location.pathname.includes("/login") && (window.location.href = "/auth/login");
      }
    }
  );
};
let O = !1;
function D() {
  if (typeof document > "u" || O || !!window.PterodactylUser) return;
  const o = "pteroext-user-registration-root";
  let h = document.getElementById(o);
  h || (h = document.createElement("div"), h.id = o, document.body.appendChild(h));
  try {
    Y(h).render(/* @__PURE__ */ e(te, {})), O = !0;
  } catch (n) {
    console.warn("[UserRegistration] Failed to mount public registration host:", n);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => D()) : setTimeout(() => D(), 100));
const oe = Z({
  setup({ screens: m } = {}) {
    m && typeof m.register == "function" && m.register("admin-registration", () => Promise.resolve({ default: Q })), D();
  }
});
export {
  oe as default
};
