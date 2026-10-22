await Promise.all(["user-registration.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsx as e, jsxs as t, Fragment as T } from "react/jsx-runtime";
import { useState as o, useEffect as R } from "react";
import { createRoot as G } from "react-dom/client";
import { definePterodactylExtension as K } from "@pterodactyl/sdk";
const Y = ({ isOpen: l, onClose: i, onSwitchToLogin: a }) => {
  const [n, g] = o({
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
  }), [x, b] = o(!0), [k, j] = o(""), [C, E] = o(""), [m, I] = o(""), [y, L] = o(""), [c, H] = o(""), [h, O] = o(""), [N, U] = o(!1), [p, D] = o(!1), [W, q] = o(!1), [_, s] = o(null), [B, F] = o(null), [Z, Q] = o("");
  R(() => {
    if (!l) return;
    (async () => {
      const d = [
        "/api/client/extensions/user-registration/config",
        "/api/public/registration/config"
      ];
      for (const S of d)
        try {
          const f = await fetch(S, {
            headers: { Accept: "application/json" }
          });
          if (f.ok) {
            const v = await f.json();
            g(v);
            break;
          }
        } catch {
        }
      b(!1);
    })();
  }, [l]);
  const w = ((r) => {
    let d = 0;
    return r ? (r.length >= (n.min_password_length || 8) && d++, /[0-9]/.test(r) && d++, /[^a-zA-Z0-9]/.test(r) && d++, /[A-Z]/.test(r) && /[a-z]/.test(r) && d++, d <= 1 ? { score: 1, text: "Weak", color: "#ef4444" } : d === 2 ? { score: 2, text: "Fair", color: "#f59e0b" } : d === 3 ? { score: 3, text: "Good", color: "#818cf8" } : { score: 4, text: "Strong", color: "#10b981" }) : { score: 0, text: "", color: "transparent" };
  })(c), J = c.length > 0 && h.length > 0 && c === h, V = h.length > 0 && c !== h, X = async (r) => {
    if (r.preventDefault(), s(null), !k.trim() || !C.trim()) {
      s("Please enter both your first and last name.");
      return;
    }
    if (!m.trim() || m.length < 3) {
      s("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(m)) {
      s("Username can only contain letters, numbers, hyphens, and underscores.");
      return;
    }
    if (!y.trim() || !y.includes("@")) {
      s("Please provide a valid email address.");
      return;
    }
    if (c.length < (n.min_password_length || 8)) {
      s(`Password must be at least ${n.min_password_length || 8} characters long.`);
      return;
    }
    if (n.require_number && !/[0-9]/.test(c)) {
      s("Password must include at least one number.");
      return;
    }
    if (n.require_special_char && !/[^a-zA-Z0-9]/.test(c)) {
      s("Password must include at least one special character or symbol.");
      return;
    }
    if (c !== h) {
      s("Passwords do not match.");
      return;
    }
    if (n.require_terms && !N) {
      s("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    q(!0);
    const d = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", S = {
      firstname: k.trim(),
      lastname: C.trim(),
      username: m.trim(),
      email: y.trim(),
      password: c,
      password_confirmation: h,
      terms: N,
      captcha_token: Z
    }, f = [
      "/api/client/extensions/user-registration/register",
      "/api/public/registration/register"
    ];
    let v = !1;
    for (const $ of f)
      try {
        const P = await fetch($, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": d,
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify(S)
        }), u = await P.json();
        if (P.ok && u.success) {
          v = !0, F(u.message || "Account created successfully!"), u.auto_login && setTimeout(() => {
            window.location.href = u.redirect || "/";
          }, 1200);
          break;
        } else if (u.error) {
          s(u.error);
          break;
        }
      } catch {
      }
    !v && !_ && s("Registration failed. Please check your information and try again."), q(!1);
  };
  return l ? /* @__PURE__ */ e("div", { className: "reg-modal-backdrop", onClick: i, children: /* @__PURE__ */ t("div", { className: "reg-modal-card", onClick: (r) => r.stopPropagation(), children: [
    /* @__PURE__ */ e("button", { type: "button", className: "reg-modal-close", onClick: i, title: "Close", children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
      /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ] }) }),
    /* @__PURE__ */ t("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ e("h2", { style: { fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }, children: "Create an Account" }),
      /* @__PURE__ */ e("p", { style: { fontSize: "0.8125rem", color: "var(--reg-text-muted)", margin: 0 }, children: "Join the platform to deploy, configure, and manage your game servers." })
    ] }),
    !x && !n.enabled ? /* @__PURE__ */ e("div", { className: "reg-alert reg-alert-danger", children: /* @__PURE__ */ e("span", { children: "Public registration is currently disabled by administrator." }) }) : B ? (
      /* Success View */
      /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "24px 8px" }, children: [
        /* @__PURE__ */ e("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "24", height: "24", stroke: "#10b981", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ e("h3", { style: { fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }, children: "Welcome Aboard!" }),
        /* @__PURE__ */ e("p", { style: { fontSize: "0.84rem", color: "var(--reg-text-muted)", margin: "0 0 24px 0", lineHeight: 1.5 }, children: B }),
        n.auto_login ? /* @__PURE__ */ t("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.8125rem", color: "#818cf8" }, children: [
          /* @__PURE__ */ e("span", { className: "reg-spinner" }),
          /* @__PURE__ */ e("span", { children: "Redirecting you to dashboard..." })
        ] }) : /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "reg-btn reg-btn-primary",
            style: { width: "100%", height: 42 },
            onClick: () => {
              a ? a() : window.location.href = "/auth/login";
            },
            children: "Proceed to Login"
          }
        )
      ] })
    ) : (
      /* Form View */
      /* @__PURE__ */ t("form", { onSubmit: X, children: [
        _ && /* @__PURE__ */ t("div", { className: "reg-alert reg-alert-danger", children: [
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ] }),
          /* @__PURE__ */ e("span", { children: _ })
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
                value: k,
                onChange: (r) => j(r.target.value),
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
                value: C,
                onChange: (r) => E(r.target.value),
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
                value: m,
                onChange: (r) => I(r.target.value.toLowerCase().replace(/\s+/g, "")),
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
                value: y,
                onChange: (r) => L(r.target.value),
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
                type: p ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: c,
                onChange: (r) => H(r.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "reg-input-action",
                onClick: () => D(!p),
                title: p ? "Hide password" : "Show password",
                children: p ? /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
                  /* @__PURE__ */ e("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
                ] }) : /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                  /* @__PURE__ */ e("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                  /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "3" })
                ] })
              }
            )
          ] }),
          c.length > 0 && /* @__PURE__ */ t("div", { className: "reg-strength-container", children: [
            /* @__PURE__ */ e("div", { className: "reg-strength-bars", children: [1, 2, 3, 4].map((r) => /* @__PURE__ */ e(
              "div",
              {
                className: "reg-strength-bar",
                style: {
                  backgroundColor: r <= w.score ? w.color : void 0
                }
              },
              r
            )) }),
            /* @__PURE__ */ t("div", { className: "reg-strength-label", children: [
              /* @__PURE__ */ t("span", { children: [
                "Security: ",
                /* @__PURE__ */ e("strong", { style: { color: w.color }, children: w.text })
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
                type: p ? "text" : "password",
                className: "reg-input has-icon has-icon-right",
                placeholder: "••••••••••••",
                value: h,
                onChange: (r) => O(r.target.value),
                required: !0,
                autoComplete: "new-password"
              }
            ),
            J && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#10b981", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
            V && /* @__PURE__ */ e("span", { style: { position: "absolute", right: 12, color: "#ef4444", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", children: [
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
              checked: N,
              onChange: (r) => U(r.target.checked),
              style: { marginTop: 2, accentColor: "#6366f1" },
              required: !0
            }
          ),
          /* @__PURE__ */ t("span", { children: [
            "I agree to the",
            " ",
            /* @__PURE__ */ e("a", { href: n.terms_url, target: "_blank", rel: "noopener noreferrer", style: { color: "#818cf8", textDecoration: "underline" }, children: "Terms of Service" }),
            " ",
            "and",
            " ",
            /* @__PURE__ */ e("a", { href: n.privacy_url, target: "_blank", rel: "noopener noreferrer", style: { color: "#818cf8", textDecoration: "underline" }, children: "Privacy Policy" }),
            "."
          ] })
        ] }) }),
        /* @__PURE__ */ e("div", { style: { marginTop: 20 }, children: /* @__PURE__ */ e(
          "button",
          {
            type: "submit",
            className: "reg-btn reg-btn-primary",
            style: { width: "100%", height: 42, fontSize: "0.9rem" },
            disabled: W,
            children: W ? /* @__PURE__ */ t(T, { children: [
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
                a ? a() : window.location.href = "/auth/login";
              },
              style: { background: "transparent", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", padding: 0 },
              children: "Sign in here →"
            }
          )
        ] })
      ] })
    )
  ] }) }) : null;
}, A = () => {
  const [l, i] = o(!1);
  R(() => {
    const g = () => {
      const x = window.location.pathname.toLowerCase(), b = window.location.hash.toLowerCase();
      (x.endsWith("/register") || b === "#register") && i(!0);
    };
    return g(), window.addEventListener("hashchange", g), () => window.removeEventListener("hashchange", g);
  }, []);
  const a = typeof window < "u" && (window.location.pathname.includes("/auth") || window.location.pathname.includes("/login"));
  return typeof window < "u" && !!window.PterodactylUser ? null : /* @__PURE__ */ t(T, { children: [
    /* @__PURE__ */ e(
      Y,
      {
        isOpen: l,
        onClose: () => {
          i(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
        },
        onSwitchToLogin: () => {
          i(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
        }
      }
    ),
    a && !l && /* @__PURE__ */ e(
      "div",
      {
        id: "pteroext-reg-quick-btn",
        style: {
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999
        },
        children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => i(!0),
            className: "reg-btn reg-btn-primary",
            style: {
              height: 38,
              padding: "0 16px",
              fontSize: "0.84rem",
              borderRadius: 8,
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [
              /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", children: [
                /* @__PURE__ */ e("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                /* @__PURE__ */ e("circle", { cx: "8.5", cy: "7", r: "4" }),
                /* @__PURE__ */ e("line", { x1: "20", y1: "8", x2: "20", y2: "14" }),
                /* @__PURE__ */ e("line", { x1: "23", y1: "11", x2: "17", y2: "11" })
              ] }),
              /* @__PURE__ */ e("span", { children: "Create Account" })
            ]
          }
        )
      }
    )
  ] });
};
let z = !1;
function M() {
  if (typeof document > "u" || z || !!window.PterodactylUser) return;
  const i = "pteroext-user-registration-root";
  let a = document.getElementById(i);
  a || (a = document.createElement("div"), a.id = i, document.body.appendChild(a));
  try {
    G(a).render(/* @__PURE__ */ e(A, {})), z = !0;
  } catch (n) {
    console.warn("[UserRegistration] Failed to mount public registration host:", n);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => M()) : setTimeout(() => M(), 100));
const oe = K({
  setup({ screens: l, slots: i } = {}) {
    l && typeof l.register == "function" && l.register("admin-registration", () => import("./chunk.AdminRegistrationScreen.BYYO1AIM.js")), i && typeof i.register == "function" && (i.register("auth.login.after", A), i.register("auth.container.after", A)), M();
  }
});
export {
  oe as default
};
