import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DXpSoCuW.js";
import { usePage, Head } from "@inertiajs/react";
import "./ApplicationLogo-C3ZfqySW.js";
import "react";
import "@headlessui/react";
function Dashboard() {
  const { purchases = [] } = usePage().props;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Dashboard" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: "You're logged in!" }),
          purchases.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-2", children: "Your Purchases" }),
            /* @__PURE__ */ jsxs("table", { className: "min-w-full border text-sm", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "border px-2 py-1", children: "Item" }),
                /* @__PURE__ */ jsx("th", { className: "border px-2 py-1", children: "Amount" }),
                /* @__PURE__ */ jsx("th", { className: "border px-2 py-1", children: "PayPal Transaction ID" }),
                /* @__PURE__ */ jsx("th", { className: "border px-2 py-1", children: "Date" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: purchases.map((purchase) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "border px-2 py-1", children: purchase.item_name || "-" }),
                /* @__PURE__ */ jsx("td", { className: "border px-2 py-1", children: purchase.amount || "-" }),
                /* @__PURE__ */ jsx("td", { className: "border px-2 py-1", children: purchase.paypal_transaction_id || "-" }),
                /* @__PURE__ */ jsx("td", { className: "border px-2 py-1", children: purchase.created_at ? new Date(purchase.created_at).toLocaleString() : "-" })
              ] }, purchase.id)) })
            ] })
          ] })
        ] }) }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
