import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const root = document.getElementById("root")!;
// Pages arrive prerendered: attach to that HTML instead of rebuilding it
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
