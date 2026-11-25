// Build-time renderer: turns each address into finished HTML (see scripts/prerender.mjs)
import { renderToString } from "react-dom/server";
import App from "./app/App";
export { ALL_ROUTES, routePath, seoFor, SITE_ORIGIN } from "./app/routes";

export function render(path: string): string {
  return renderToString(<App initialPath={path} />);
}
