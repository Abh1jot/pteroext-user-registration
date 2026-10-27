await Promise.all(["user-registration.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsx as e, jsxs as t, Fragment as $ } from "react/jsx-runtime";
import { useState as a, useEffect as T } from "react";
import { createRoot as G } from "react-dom/client";
import { definePterodactylExtension as K } from "@pterodactyl/sdk";
const Y = ({ isOpen: u, onClose: g, onSwitchToLogin: c }) => {
  const [n, v] = a({
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
  }), [b, N] = a(!0), [y, f] = a(""), [o, i] = a(""), [s, m] = a(""), [x, P] = a(""), [d, L] = a(""), [w, j] = a(""), [E, F] = a(!1), [k, H] = a(!1), [q, R] = a(!1), [B, l] = a(null), [z, D] = a(null), [O, ee] = a("");
  T(() => {
    if (!u) return;
    (async () => {
      const h = [
        "/api/public/registration/config",
        "/auth/public-register/config",
        "/api/client/extensions/user-registration/config"
      ];
      for (const M of h)
        try {
          const C = await fetch(M, {
            headers: { Accept: "application/json" }
          });
          if (C.ok) {
            const _ = await C.json();
            v(_);
            break;
          }
        } catch {
        }
      N(!1);
    })();
  }, [u]);
  const S = ((r) => {
    let h = 0;
    return r ? (r.length >= (n.min_password_length || 8) && h++, /[0-9]/.test(r) && h++, /[^a-zA-Z0-9]/.test(r) && h++, /[A-Z]/.test(r) && /[a-z]/.test(r) && h++, h <= 1 ? { score: 1, text: "Weak", color: "#ef4444" } : h === 2 ? { score: 2, text: "Fair", color: "#f59e0b" } : h === 3 ? { score: 3, text: "Good", color: "var(--reg-primary, #2563eb)" } : { score: 4, text: "Strong", color: "#10b981" }) : { score: 0, text: "", color: "transparent" };
  })(d), U = d.length > 0 && w.length > 0 && d === w, Z = w.length > 0 && d !== w, J = async (r) => {
    if (r.preventDefault(), l(null), !y.trim() || !o.trim()) {
      l("Please enter both your first and last name.");
      return;
    }
    if (!s.trim() || s.length < 3) {
      l("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(s)) {
      l("Username can only contain letters, numbers, hyphens, and underscores.");
      return;
    }
    if (!x.trim() || !x.includes("@")) {
      l("Please provide a valid email address.");
      return;
    }
    if (d.length < (n.min_password_length || 8)) {
      l(`Password must be at least ${n.min_password_length || 8} characters long.`);
      return;
    }
    if (n.require_number && !/[0-9]/.test(d)) {
      l("Password must include at least one number.");
      return;
    }
    if (n.require_special_char && !/[^a-zA-Z0-9]/.test(d)) {
      l("Password must include at least one special character or symbol.");
      return;
    }
    if (d !== w) {
      l("Passwords do not match.");
      return;
    }
    if (n.require_terms && !E) {
      l("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    R(!0);
    const h = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", M = {
      firstname: y.trim(),
      lastname: o.trim(),
      username: s.trim(),
      email: x.trim(),
      password: d,
      password_confirmation: w,
      terms: E,
      captcha_token: O
    }, C = [
      "/api/public/registration/register",
      "/auth/public-register/register",
      "/auth/public-register",
      "/api/client/extensions/user-registration/register"
    ];
    let _ = !1;
    for (const V of C)
      try {
        const A = await fetch(V, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": h,
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify(M)
        });
        if (A.status === 404)
          continue;
        const p = await A.json().catch(() => null);
        if (!p) continue;
        if (A.ok && p.success) {
          _ = !0, D(p.message || "Account created successfully! Redirecting to login..."), setTimeout(() => {
            window.location.href = p.redirect || "/auth/login";
          }, 1200);
          break;
        } else if (p.error || p.errors) {
          const X = p.error || (Array.isArray(p.errors) ? p.errors[0]?.detail : null) || "Registration failed.";
          l(X);
          break;
        }
      } catch {
      }
    !_ && !B && l("Registration failed. Please check your information and try again."), R(!1);
  };
  return u ? /* @__PURE__ */ e("div", { className: "reg-modal-backdrop", onClick: g, children: /* @__PURE__ */ t("div", { className: "reg-modal-card", onClick: (r) => r.stopPropagation(), children: [
    /* @__PURE__ */ e("button", { type: "button", className: "reg-modal-close", onClick: g, title: "Close", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
      /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ] }) }),
    /* @__PURE__ */ t("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ e("h2", { style: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }, children: "Create an Account" }),
      /* @__PURE__ */ e("p", { style: { fontSize: "0.8125rem", color: "var(--reg-text-muted)", margin: 0 }, children: "Join the platform to deploy, configure, and manage your game servers." })
    ] }),
    !b && !n.enabled ? /* @__PURE__ */ e("div", { className: "reg-alert reg-alert-danger", children: /* @__PURE__ */ e("span", { children: "Public registration is currently disabled by administrator." }) }) : z ? (
      /* Success View */
      /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "24px 8px" }, children: [
        /* @__PURE__ */ e("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "24", height: "24", stroke: "#10b981", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ e("h3", { style: { fontSize: "1.15rem", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }, children: "Registration Successful!" }),
        /* @__PURE__ */ e("p", { style: { fontSize: "0.84rem", color: "var(--reg-text-muted)", margin: "0 0 20px 0", lineHeight: 1.5 }, children: z }),
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
              c ? c() : window.location.href = "/auth/login";
            },
            children: "Proceed to Login"
          }
        )
      ] })
    ) : (
      /* Form View */
      /* @__PURE__ */ t("form", { onSubmit: J, children: [
        B && /* @__PURE__ */ t("div", { className: "reg-alert reg-alert-danger", children: [
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ] }),
          /* @__PURE__ */ e("span", { children: B })
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
                value: y,
                onChange: (r) => f(r.target.value),
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
                value: o,
                onChange: (r) => i(r.target.value),
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
                value: s,
                onChange: (r) => m(r.target.value.toLowerCase().replace(/\s+/g, "")),
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
                onChange: (r) => P(r.target.value),
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
                type: k ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: d,
                onChange: (r) => L(r.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "reg-input-action",
                onClick: () => H(!k),
                title: k ? "Hide password" : "Show password",
                children: k ? /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
                  /* @__PURE__ */ e("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
                ] }) : /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                  /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "3" })
                ] })
              }
            )
          ] }),
          d.length > 0 && /* @__PURE__ */ t("div", { className: "reg-strength-container", children: [
            /* @__PURE__ */ e("div", { className: "reg-strength-bars", children: [1, 2, 3, 4].map((r) => /* @__PURE__ */ e(
              "div",
              {
                className: "reg-strength-bar",
                style: {
                  backgroundColor: r <= S.score ? S.color : void 0
                }
              },
              r
            )) }),
            /* @__PURE__ */ t("div", { className: "reg-strength-label", children: [
              /* @__PURE__ */ t("span", { children: [
                "Security: ",
                /* @__PURE__ */ e("strong", { style: { color: S.color }, children: S.text })
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
                type: k ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: w,
                onChange: (r) => j(r.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            U && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#10b981", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
            Z && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#ef4444", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: [
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
              checked: E,
              onChange: (r) => F(r.target.checked),
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
            disabled: q,
            children: q ? /* @__PURE__ */ t($, { children: [
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
                c ? c() : window.location.href = "/auth/login";
              },
              style: { background: "transparent", border: "none", color: "var(--reg-primary, #2563eb)", fontWeight: 600, cursor: "pointer", padding: 0 },
              children: "Sign in here →"
            }
          )
        ] })
      ] })
    )
  ] }) }) : null;
}, Q = () => {
  const [u, g] = a(!1);
  return T(() => {
    const n = () => {
      const v = window.location.pathname.toLowerCase(), b = window.location.hash.toLowerCase();
      (v.endsWith("/register") || b === "#register") && g(!0);
    };
    return n(), window.addEventListener("hashchange", n), () => window.removeEventListener("hashchange", n);
  }, []), T(() => {
    if (typeof document > "u") return;
    const n = "pteroext-reg-inline-link", v = "pteroext-reg-inline-container", b = () => {
      if (window.PterodactylUser || document.getElementById(n) || !(window.location.pathname.includes("/auth") || window.location.pathname.includes("/login"))) return;
      const f = document.querySelector('a[href*="/auth/password"], a[href*="/password"]');
      if (!f) return;
      const o = document.createElement("div");
      o.id = v;
      const i = document.createElement("a");
      i.id = n, i.href = "#register", i.textContent = "Create an account", f.className && (i.className = f.className);
      const s = window.getComputedStyle(f);
      i.style.fontFamily = s.fontFamily, i.style.fontSize = s.fontSize, i.style.fontWeight = s.fontWeight, i.style.lineHeight = s.lineHeight, i.style.letterSpacing = s.letterSpacing, i.style.textTransform = s.textTransform, i.style.cursor = "pointer", i.style.display = "inline-block";
      const m = f.parentElement;
      m && (window.getComputedStyle(m).display === "flex" || m.className.includes("flex")) && m.children.length > 1 && m ? (o.style.display = "block", o.style.textAlign = "right", o.style.marginTop = "4px", o.style.marginBottom = "2px", m.insertAdjacentElement("afterend", o)) : m && (o.style.display = "block", o.style.marginTop = "6px", o.style.textAlign = s.textAlign || "center", f.insertAdjacentElement("afterend", o)), i.addEventListener("click", (P) => {
        P.preventDefault(), g(!0);
      }), o.appendChild(i);
    };
    b();
    const N = new MutationObserver(() => {
      b();
    });
    return N.observe(document.body, { childList: !0, subtree: !0 }), () => {
      N.disconnect();
      const y = document.getElementById(v);
      y && y.remove();
    };
  }, []), typeof window < "u" && !!window.PterodactylUser ? null : /* @__PURE__ */ e(
    Y,
    {
      isOpen: u,
      onClose: () => {
        g(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
      },
      onSwitchToLogin: () => {
        g(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname), !window.location.pathname.includes("/auth/login") && !window.location.pathname.includes("/login") && (window.location.href = "/auth/login");
      }
    }
  );
};
let I = !1;
function W() {
  if (typeof document > "u" || I || !!window.PterodactylUser) return;
  const g = "pteroext-user-registration-root";
  let c = document.getElementById(g);
  c || (c = document.createElement("div"), c.id = g, document.body.appendChild(c));
  try {
    G(c).render(/* @__PURE__ */ e(Q, {})), I = !0;
  } catch (n) {
    console.warn("[UserRegistration] Failed to mount public registration host:", n);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => W()) : setTimeout(() => W(), 100));
const ae = K({
  setup({ screens: u } = {}) {
    u && typeof u.register == "function" && u.register("admin-registration", () => import("./chunk.AdminRegistrationScreen.BYYO1AIM.js")), W();
  }
});
export {
  ae as default
};
