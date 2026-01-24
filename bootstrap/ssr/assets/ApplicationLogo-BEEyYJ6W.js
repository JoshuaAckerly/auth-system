import { jsx } from "react/jsx-runtime";
function ApplicationLogo(props) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: "/logo.svg",
      alt: "GraveYardJokes Studios Logo",
      className: props.className || "h-20 w-20"
    }
  );
}
export {
  ApplicationLogo as A
};
