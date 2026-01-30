import { jsx } from "react/jsx-runtime";
import "react";
function ApplicationLogo({ logoSize = "h-10 w-10", containerClasses = "" }) {
  const cdn = "http://d3fjkusrpksks7.cloudfront.net/graveyardjokes";
  return /* @__PURE__ */ jsx("div", { className: `flex ${containerClasses}`, children: /* @__PURE__ */ jsx("img", { src: `${cdn}/images/GraveYardJokesLogoJester.svg`, alt: "GraveYardJokes Studios Logo", className: logoSize }) });
}
export {
  ApplicationLogo as A
};
