await Promise.all(["user-registration.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsxs as t, jsx as e, Fragment as z } from "react/jsx-runtime";
import { useState as l, useEffect as E } from "react";
import { toast as R, definePterodactylExtension as ee } from "@pterodactyl/sdk";
import { createRoot as te } from "react-dom/client";
function re() {
  const p = typeof window < "u" && (window.PterodactylUser?.root_admin === !0 || window.PterodactylUser?.root_admin === 1 || window.PterodactylUser?.admin === !0 || window.store?.getState?.()?.user?.data?.rootAdmin === !0), [o, m] = l("settings"), [n, N] = l(!0), [x, _] = l(!1), [w, b] = l(!1), [a, i] = l({
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
  }), [c, v] = l({
    total_registered: 0,
    registered_today: 0,
    registered_this_week: 0,
    blocked_attempts: 0
  }), [k, T] = l([]), [u, q] = l(!1), f = () => window.PterodactylUser?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", I = async () => {
    N(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/settings", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": f()
        },
        credentials: "same-origin"
      });
      if (r.ok) {
        const d = await r.json();
        d.settings && i(d.settings), d.stats && v(d.stats);
      }
    } catch (r) {
      console.error("Failed to load admin registration settings:", r);
    } finally {
      N(!1);
    }
  }, P = async () => {
    q(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/logs", {
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": f()
        },
        credentials: "same-origin"
      });
      if (r.ok) {
        const d = await r.json();
        T(d.logs || []);
      }
    } catch (r) {
      console.error("Failed to fetch registration logs:", r);
    } finally {
      q(!1);
    }
  };
  E(() => {
    I();
  }, []), E(() => {
    o === "logs" && P();
  }, [o]);
  const j = async () => {
    _(!0);
    try {
      const r = await fetch("/api/admin/extensions/user-registration/settings", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": f()
        },
        credentials: "same-origin",
        body: JSON.stringify(a)
      }), d = await r.json();
      r.ok ? (R.success(d.message || "Settings saved successfully"), d.settings && i(d.settings)) : R.error(d.error || "Failed to save settings");
    } catch (r) {
      R.error(r.message || "Error saving settings");
    } finally {
      _(!1);
    }
  }, C = async () => {
    if (window.confirm("Are you sure you want to clear all registration audit logs?")) {
      b(!0);
      try {
        (await fetch("/api/admin/extensions/user-registration/logs", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": f()
          },
          credentials: "same-origin"
        })).ok ? (R.success("Registration audit logs cleared"), T([])) : R.error("Failed to clear logs");
      } catch (r) {
        R.error(r.message || "Error clearing logs");
      } finally {
        b(!1);
      }
    }
  };
  return p ? /* @__PURE__ */ t("div", { className: "reg-container", children: [
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
          onClick: j,
          disabled: x || n,
          children: x ? /* @__PURE__ */ t(z, { children: [
            /* @__PURE__ */ e("span", { className: "reg-spinner" }),
            /* @__PURE__ */ e("span", { children: "Saving Changes..." })
          ] }) : /* @__PURE__ */ t(z, { children: [
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
          onClick: () => m("settings"),
          children: "General"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "security" ? "active" : ""}`,
          onClick: () => m("security"),
          children: "Security & Captcha"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "emails" ? "active" : ""}`,
          onClick: () => m("emails"),
          children: "Email Policies"
        }
      ),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: `reg-tab-btn ${o === "logs" ? "active" : ""}`,
          onClick: () => m("logs"),
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
              onClick: P,
              disabled: u,
              children: "Refresh"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "reg-btn reg-btn-danger",
              onClick: C,
              disabled: w || k.length === 0,
              children: "Clear History"
            }
          )
        ] })
      ] }),
      u ? /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)" }, children: [
        /* @__PURE__ */ e("span", { className: "reg-spinner" }),
        /* @__PURE__ */ e("p", { style: { marginTop: 8, fontSize: "0.84rem" }, children: "Loading logs..." })
      ] }) : k.length === 0 ? /* @__PURE__ */ e("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--reg-text-muted)", fontSize: "0.84rem" }, children: "No registration activity recorded yet." }) : /* @__PURE__ */ e("div", { className: "reg-table-wrap", children: /* @__PURE__ */ t("table", { className: "reg-table", children: [
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ t("tr", { children: [
          /* @__PURE__ */ e("th", { children: "Date & Time" }),
          /* @__PURE__ */ e("th", { children: "User Details" }),
          /* @__PURE__ */ e("th", { children: "IP Address" }),
          /* @__PURE__ */ e("th", { children: "Status" }),
          /* @__PURE__ */ e("th", { children: "Details" })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: k.map((r) => {
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
const ae = ({ isOpen: p, onClose: o, onSwitchToLogin: m }) => {
  const [n, N] = l({
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
  }), [x, _] = l(!0), [w, b] = l(""), [a, i] = l(""), [c, v] = l(""), [k, T] = l(""), [u, q] = l(""), [f, I] = l(""), [P, j] = l(!1), [C, r] = l(!1), [d, F] = l(!1), [U, y] = l(null), [O, $] = l(null), [G, se] = l("");
  E(() => {
    if (!p) return;
    (async () => {
      const g = [
        "/api/public/registration/config",
        "/auth/public-register/config",
        "/api/client/extensions/user-registration/config"
      ];
      for (const S of g)
        try {
          const L = await fetch(S, {
            headers: { Accept: "application/json" }
          });
          if (L.ok) {
            const W = await L.json();
            N(W);
            break;
          }
        } catch {
        }
      _(!1);
    })();
  }, [p]);
  const B = ((s) => {
    let g = 0;
    return s ? (s.length >= (n.min_password_length || 8) && g++, /[0-9]/.test(s) && g++, /[^a-zA-Z0-9]/.test(s) && g++, /[A-Z]/.test(s) && /[a-z]/.test(s) && g++, g <= 1 ? { score: 1, text: "Weak", color: "#ef4444" } : g === 2 ? { score: 2, text: "Fair", color: "#f59e0b" } : g === 3 ? { score: 3, text: "Good", color: "var(--reg-primary, #2563eb)" } : { score: 4, text: "Strong", color: "#10b981" }) : { score: 0, text: "", color: "transparent" };
  })(u), V = u.length > 0 && f.length > 0 && u === f, J = f.length > 0 && u !== f, Z = () => {
    const s = document.querySelector('meta[name="csrf-token"], meta[name="_token"]');
    if (s && s.getAttribute("content"))
      return s.getAttribute("content");
    const g = document.querySelector('input[name="_token"]');
    if (g && g.value)
      return g.value;
    const S = document.cookie.match(/(?:^|;\s*)(?:XSRF-TOKEN|csrf_token)=([^;]+)/);
    if (S)
      try {
        return decodeURIComponent(S[1]);
      } catch {
        return S[1];
      }
    return window.PterodactylUser?.csrfToken || window.Pterodactyl?.csrfToken || "";
  }, Y = async (s) => {
    if (s.preventDefault(), y(null), !w.trim() || !a.trim()) {
      y("Please enter both your first and last name.");
      return;
    }
    if (!c.trim() || c.length < 3) {
      y("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(c)) {
      y("Username can only contain letters, numbers, hyphens, and underscores.");
      return;
    }
    if (!k.trim() || !k.includes("@")) {
      y("Please provide a valid email address.");
      return;
    }
    if (u.length < (n.min_password_length || 8)) {
      y(`Password must be at least ${n.min_password_length || 8} characters long.`);
      return;
    }
    if (n.require_number && !/[0-9]/.test(u)) {
      y("Password must include at least one number.");
      return;
    }
    if (n.require_special_char && !/[^a-zA-Z0-9]/.test(u)) {
      y("Password must include at least one special character or symbol.");
      return;
    }
    if (u !== f) {
      y("Passwords do not match.");
      return;
    }
    if (n.require_terms && !P) {
      y("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    F(!0);
    try {
      await fetch("/sanctum/csrf-cookie", { credentials: "same-origin" }).catch(() => null);
    } catch {
    }
    const g = Z(), S = {
      firstname: w.trim(),
      lastname: a.trim(),
      name_first: w.trim(),
      name_last: a.trim(),
      username: c.trim(),
      email: k.trim(),
      password: u,
      password_confirmation: f,
      terms: P,
      captcha_token: G,
      _token: g
    }, L = [
      "/api/public/registration/register",
      "/api/public/registration",
      "/auth/public-register/register",
      "/auth/public-register",
      "/api/client/extensions/user-registration/register"
    ];
    let W = !1, H = "";
    for (const Q of L)
      try {
        const M = await fetch(Q, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...g ? { "X-CSRF-TOKEN": g, "X-XSRF-TOKEN": g } : {},
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify(S)
        });
        if (M.status === 404)
          continue;
        const h = await M.json().catch(() => null);
        if (!h) continue;
        if (M.ok && h.success) {
          W = !0, $(h.message || "Account created successfully! Redirecting..."), setTimeout(() => {
            window.location.href = h.redirect || "/auth/login";
          }, 1200);
          break;
        }
        let A = "";
        if (h.error && typeof h.error == "string")
          A = h.error;
        else if (h.message && typeof h.message == "string" && !h.message.includes("CSRF"))
          A = h.message;
        else if (Array.isArray(h.errors) && h.errors.length > 0)
          A = h.errors[0]?.detail || h.errors[0]?.message || String(h.errors[0]);
        else if (h.errors && typeof h.errors == "object") {
          const X = Object.values(h.errors).flat()[0];
          X && (A = String(X));
        }
        if (A) {
          H = A, y(A);
          break;
        }
      } catch {
      }
    !W && !H && y("Registration failed. Please check your information and try again."), F(!1);
  };
  return p ? /* @__PURE__ */ e("div", { className: "reg-modal-backdrop", onClick: o, children: /* @__PURE__ */ t("div", { className: "reg-modal-card", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e("button", { type: "button", className: "reg-modal-close", onClick: o, title: "Close", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
      /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ] }) }),
    /* @__PURE__ */ t("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ e("h2", { style: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }, children: "Create an Account" }),
      /* @__PURE__ */ e("p", { style: { fontSize: "0.8125rem", color: "var(--reg-text-muted)", margin: 0 }, children: "Join the platform to deploy, configure, and manage your game servers." })
    ] }),
    !x && !n.enabled ? /* @__PURE__ */ e("div", { className: "reg-alert reg-alert-danger", children: /* @__PURE__ */ e("span", { children: "Public registration is currently disabled by administrator." }) }) : O ? (
      /* Success View */
      /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "24px 8px" }, children: [
        /* @__PURE__ */ e("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "24", height: "24", stroke: "#10b981", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ e("h3", { style: { fontSize: "1.15rem", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }, children: "Registration Successful!" }),
        /* @__PURE__ */ e("p", { style: { fontSize: "0.84rem", color: "var(--reg-text-muted)", margin: "0 0 20px 0", lineHeight: 1.5 }, children: O }),
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
              m ? m() : window.location.href = "/auth/login";
            },
            children: "Proceed to Login"
          }
        )
      ] })
    ) : (
      /* Form View */
      /* @__PURE__ */ t("form", { onSubmit: Y, children: [
        U && /* @__PURE__ */ t("div", { className: "reg-alert reg-alert-danger", children: [
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ] }),
          /* @__PURE__ */ e("span", { children: U })
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
                value: w,
                onChange: (s) => b(s.target.value),
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
                onChange: (s) => v(s.target.value.toLowerCase().replace(/\s+/g, "")),
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
                value: k,
                onChange: (s) => T(s.target.value),
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
                value: u,
                onChange: (s) => q(s.target.value),
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
          u.length > 0 && /* @__PURE__ */ t("div", { className: "reg-strength-container", children: [
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
                value: f,
                onChange: (s) => I(s.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            V && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#10b981", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
            J && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#ef4444", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: [
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
              checked: P,
              onChange: (s) => j(s.target.checked),
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
            children: d ? /* @__PURE__ */ t(z, { children: [
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
                m ? m() : window.location.href = "/auth/login";
              },
              style: { background: "transparent", border: "none", color: "var(--reg-primary, #2563eb)", fontWeight: 600, cursor: "pointer", padding: 0 },
              children: "Sign in here →"
            }
          )
        ] })
      ] })
    )
  ] }) }) : null;
}, ie = () => {
  const [p, o] = l(!1);
  return E(() => {
    const n = () => {
      const N = window.location.pathname.toLowerCase(), x = window.location.hash.toLowerCase();
      (N.endsWith("/register") || x === "#register") && o(!0);
    };
    return n(), window.addEventListener("hashchange", n), () => window.removeEventListener("hashchange", n);
  }, []), E(() => {
    if (typeof document > "u") return;
    const n = "pteroext-reg-inline-link", N = "pteroext-reg-inline-container", x = () => {
      if (window.PterodactylUser || document.getElementById(n) || !(window.location.pathname.includes("/auth") || window.location.pathname.includes("/login"))) return;
      const b = document.querySelector('a[href*="/auth/password"], a[href*="/password"]');
      if (!b) return;
      const a = document.createElement("div");
      a.id = N;
      const i = document.createElement("a");
      i.id = n, i.href = "#register", i.textContent = "Create an account", b.className && (i.className = b.className);
      const c = window.getComputedStyle(b);
      i.style.fontFamily = c.fontFamily, i.style.fontSize = c.fontSize, i.style.fontWeight = c.fontWeight, i.style.lineHeight = c.lineHeight, i.style.letterSpacing = c.letterSpacing, i.style.textTransform = c.textTransform, i.style.cursor = "pointer", i.style.display = "inline-block";
      const v = b.parentElement;
      v && (window.getComputedStyle(v).display === "flex" || v.className.includes("flex")) && v.children.length > 1 && v ? (a.style.display = "block", a.style.textAlign = "right", a.style.marginTop = "4px", a.style.marginBottom = "2px", v.insertAdjacentElement("afterend", a)) : v && (a.style.display = "block", a.style.marginTop = "6px", a.style.textAlign = c.textAlign || "center", b.insertAdjacentElement("afterend", a)), i.addEventListener("click", (T) => {
        T.preventDefault(), o(!0);
      }), a.appendChild(i);
    };
    x();
    const _ = new MutationObserver(() => {
      x();
    });
    return _.observe(document.body, { childList: !0, subtree: !0 }), () => {
      _.disconnect();
      const w = document.getElementById(N);
      w && w.remove();
    };
  }, []), typeof window < "u" && !!window.PterodactylUser ? null : /* @__PURE__ */ e(
    ae,
    {
      isOpen: p,
      onClose: () => {
        o(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
      },
      onSwitchToLogin: () => {
        o(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname), !window.location.pathname.includes("/auth/login") && !window.location.pathname.includes("/login") && (window.location.href = "/auth/login");
      }
    }
  );
};
let K = !1;
function D() {
  if (typeof document > "u" || K || !!window.PterodactylUser) return;
  const o = "pteroext-user-registration-root";
  let m = document.getElementById(o);
  m || (m = document.createElement("div"), m.id = o, document.body.appendChild(m));
  try {
    te(m).render(/* @__PURE__ */ e(ie, {})), K = !0;
  } catch (n) {
    console.warn("[UserRegistration] Failed to mount public registration host:", n);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => D()) : setTimeout(() => D(), 100));
const he = ee({
  setup({ screens: p } = {}) {
    p && typeof p.register == "function" && p.register("admin-registration", () => Promise.resolve({ default: re })), D();
  }
});
export {
  he as default
};
