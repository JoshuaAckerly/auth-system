import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as ApplicationLogo } from "./ApplicationLogo-cK1__ubY.js";
import "react";
function Welcome({ auth }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Welcome" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]", children: [
      /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-32 w-32 mb-8" }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Welcome to GraveYardJokes Auth System" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-center max-w-xl", children: "Secure authentication for all your GraveYardJokes projects. Please log in or register to continue." }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: auth?.user ? /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "px-6 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow hover:opacity-90", children: "Dashboard" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Link, { href: route("login"), className: "px-6 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow hover:opacity-90", children: "Log in" }),
        /* @__PURE__ */ jsx(Link, { href: route("register"), className: "px-6 py-2 rounded bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold shadow hover:opacity-90", children: "Register" })
      ] }) })
    ] })
  ] });
}
export {
  Welcome as default
};
