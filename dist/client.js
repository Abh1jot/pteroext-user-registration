await Promise.all(["user-registration.css"].map(file => new Promise((resolve, reject) => {const href = new URL(file, import.meta.url).href;if (document.querySelector('link[href="' + href + '"]')) return resolve();const link = document.createElement('link');link.rel = 'stylesheet';link.href = href;link.onload = () => resolve();link.onerror = () => { link.remove(); reject(new Error('Unable to load extension stylesheet: ' + file)); };document.head.append(link);})));
import { jsx as e, jsxs as t, Fragment as X } from "react/jsx-runtime";
import { useState as a, useEffect as B } from "react";
import { createRoot as $ } from "react-dom/client";
import { definePterodactylExtension as G } from "@pterodactyl/sdk";
const K = ({ isOpen: u, onClose: g, onSwitchToLogin: c }) => {
  const [n, w] = a({
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
  }), [v, N] = a(!0), [f, p] = a(""), [o, i] = a(""), [s, m] = a(""), [b, A] = a(""), [d, R] = a(""), [y, j] = a(""), [P, F] = a(!1), [k, H] = a(!1), [q, z] = a(!1), [E, l] = a(null), [I, D] = a(null), [O, Q] = a("");
  B(() => {
    if (!u) return;
    (async () => {
      const h = [
        "/api/client/extensions/user-registration/config",
        "/api/public/registration/config"
      ];
      for (const M of h)
        try {
          const C = await fetch(M, {
            headers: { Accept: "application/json" }
          });
          if (C.ok) {
            const S = await C.json();
            w(S);
            break;
          }
        } catch {
        }
      N(!1);
    })();
  }, [u]);
  const _ = ((r) => {
    let h = 0;
    return r ? (r.length >= (n.min_password_length || 8) && h++, /[0-9]/.test(r) && h++, /[^a-zA-Z0-9]/.test(r) && h++, /[A-Z]/.test(r) && /[a-z]/.test(r) && h++, h <= 1 ? { score: 1, text: "Weak", color: "#ef4444" } : h === 2 ? { score: 2, text: "Fair", color: "#f59e0b" } : h === 3 ? { score: 3, text: "Good", color: "#818cf8" } : { score: 4, text: "Strong", color: "#10b981" }) : { score: 0, text: "", color: "transparent" };
  })(d), U = d.length > 0 && y.length > 0 && d === y, Z = y.length > 0 && d !== y, J = async (r) => {
    if (r.preventDefault(), l(null), !f.trim() || !o.trim()) {
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
    if (!b.trim() || !b.includes("@")) {
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
    if (d !== y) {
      l("Passwords do not match.");
      return;
    }
    if (n.require_terms && !P) {
      l("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    z(!0);
    const h = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", M = {
      firstname: f.trim(),
      lastname: o.trim(),
      username: s.trim(),
      email: b.trim(),
      password: d,
      password_confirmation: y,
      terms: P,
      captcha_token: O
    }, C = [
      "/api/client/extensions/user-registration/register",
      "/api/public/registration/register"
    ];
    let S = !1;
    for (const V of C)
      try {
        const W = await fetch(V, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": h,
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify(M)
        }), x = await W.json();
        if (W.ok && x.success) {
          S = !0, D(x.message || "Account created successfully!"), x.auto_login && setTimeout(() => {
            window.location.href = x.redirect || "/";
          }, 1200);
          break;
        } else if (x.error) {
          l(x.error);
          break;
        }
      } catch {
      }
    !S && !E && l("Registration failed. Please check your information and try again."), z(!1);
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
    !v && !n.enabled ? /* @__PURE__ */ e("div", { className: "reg-alert reg-alert-danger", children: /* @__PURE__ */ e("span", { children: "Public registration is currently disabled by administrator." }) }) : I ? (
      /* Success View */
      /* @__PURE__ */ t("div", { style: { textAlign: "center", padding: "24px 8px" }, children: [
        /* @__PURE__ */ e("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }, children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "24", height: "24", stroke: "#10b981", strokeWidth: "2.5", fill: "none", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
        /* @__PURE__ */ e("h3", { style: { fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }, children: "Welcome Aboard!" }),
        /* @__PURE__ */ e("p", { style: { fontSize: "0.84rem", color: "var(--reg-text-muted)", margin: "0 0 24px 0", lineHeight: 1.5 }, children: I }),
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
              c ? c() : window.location.href = "/auth/login";
            },
            children: "Proceed to Login"
          }
        )
      ] })
    ) : (
      /* Form View */
      /* @__PURE__ */ t("form", { onSubmit: J, children: [
        E && /* @__PURE__ */ t("div", { className: "reg-alert reg-alert-danger", children: [
          /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ e("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ] }),
          /* @__PURE__ */ e("span", { children: E })
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
                value: f,
                onChange: (r) => p(r.target.value),
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
                value: b,
                onChange: (r) => A(r.target.value),
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
                onChange: (r) => R(r.target.value),
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
                  backgroundColor: r <= _.score ? _.color : void 0
                }
              },
              r
            )) }),
            /* @__PURE__ */ t("div", { className: "reg-strength-label", children: [
              /* @__PURE__ */ t("span", { children: [
                "Security: ",
                /* @__PURE__ */ e("strong", { style: { color: _.color }, children: _.text })
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
                value: y,
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
              checked: P,
              onChange: (r) => F(r.target.checked),
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
            disabled: q,
            children: q ? /* @__PURE__ */ t(X, { children: [
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
              style: { background: "transparent", border: "none", color: "#818cf8", fontWeight: 600, cursor: "pointer", padding: 0 },
              children: "Sign in here →"
            }
          )
        ] })
      ] })
    )
  ] }) }) : null;
}, Y = () => {
  const [u, g] = a(!1);
  return B(() => {
    const n = () => {
      const w = window.location.pathname.toLowerCase(), v = window.location.hash.toLowerCase();
      (w.endsWith("/register") || v === "#register") && g(!0);
    };
    return n(), window.addEventListener("hashchange", n), () => window.removeEventListener("hashchange", n);
  }, []), B(() => {
    if (typeof document > "u") return;
    const n = "pteroext-reg-inline-link", w = "pteroext-reg-inline-container", v = () => {
      if (window.PterodactylUser || document.getElementById(n) || !(window.location.pathname.includes("/auth") || window.location.pathname.includes("/login"))) return;
      const p = document.querySelector('a[href*="/auth/password"], a[href*="/password"]');
      if (!p) return;
      const o = document.createElement("div");
      o.id = w;
      const i = document.createElement("a");
      i.id = n, i.href = "#register", i.textContent = "Create an account", p.className && (i.className = p.className);
      const s = window.getComputedStyle(p);
      i.style.fontFamily = s.fontFamily, i.style.fontSize = s.fontSize, i.style.fontWeight = s.fontWeight, i.style.lineHeight = s.lineHeight, i.style.letterSpacing = s.letterSpacing, i.style.textTransform = s.textTransform, i.style.cursor = "pointer", i.style.display = "inline-block";
      const m = p.parentElement;
      m && (window.getComputedStyle(m).display === "flex" || m.className.includes("flex")) && m.children.length > 1 && m ? (o.style.display = "block", o.style.textAlign = "right", o.style.marginTop = "4px", o.style.marginBottom = "2px", m.insertAdjacentElement("afterend", o)) : m && (o.style.display = "block", o.style.marginTop = "6px", o.style.textAlign = s.textAlign || "center", p.insertAdjacentElement("afterend", o)), i.addEventListener("click", (A) => {
        A.preventDefault(), g(!0);
      }), o.appendChild(i);
    };
    v();
    const N = new MutationObserver(() => {
      v();
    });
    return N.observe(document.body, { childList: !0, subtree: !0 }), () => {
      N.disconnect();
      const f = document.getElementById(w);
      f && f.remove();
    };
  }, []), typeof window < "u" && !!window.PterodactylUser ? null : /* @__PURE__ */ e(
    K,
    {
      isOpen: u,
      onClose: () => {
        g(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
      },
      onSwitchToLogin: () => {
        g(!1), window.location.hash === "#register" && history.replaceState(null, "", window.location.pathname);
      }
    }
  );
};
let L = !1;
function T() {
  if (typeof document > "u" || L || !!window.PterodactylUser) return;
  const g = "pteroext-user-registration-root";
  let c = document.getElementById(g);
  c || (c = document.createElement("div"), c.id = g, document.body.appendChild(c));
  try {
    $(c).render(/* @__PURE__ */ e(Y, {})), L = !0;
  } catch (n) {
    console.warn("[UserRegistration] Failed to mount public registration host:", n);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => T()) : setTimeout(() => T(), 100));
const oe = G({
  setup({ screens: u } = {}) {
    u && typeof u.register == "function" && u.register("admin-registration", () => import("./chunk.AdminRegistrationScreen.BYYO1AIM.js")), T();
  }
});
export {
  oe as default
};
