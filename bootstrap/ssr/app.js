import { jsx } from "react/jsx-runtime";
import axios from "axios";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Laravel";
createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.jsx`,
    /* @__PURE__ */ Object.assign({ "./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-Dk-ASHMj.js"), "./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-C0qJvdpo.js"), "./Pages/Auth/Login.jsx": () => import("./assets/Login-DPwNu0qP.js"), "./Pages/Auth/Register.jsx": () => import("./assets/Register-CTqTAqSd.js"), "./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-l5JnvZFP.js"), "./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-1B05vbyz.js"), "./Pages/Dashboard.jsx": () => import("./assets/Dashboard-BCg1YIM7.js"), "./Pages/Profile/Edit.jsx": () => import("./assets/Edit-Cb3-qj5b.js"), "./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-Hy-SY24R.js"), "./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-zvD8TgBd.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-DmOzctMU.js"), "./Pages/Welcome.jsx": () => import("./assets/Welcome-D0hMY_nO.js") })
  ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(/* @__PURE__ */ jsx(App, { ...props }));
  },
  progress: {
    color: "#4B5563"
  }
});
