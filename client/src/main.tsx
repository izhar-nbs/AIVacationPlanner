import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { analytics } from "@/lib/analytics";

// Initialize analytics (replace with your actual GA4 Measurement ID)
// For demo purposes, using a placeholder. In production, use environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-DEMO123456';
if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-DEMO123456') {
  analytics.init(GA_MEASUREMENT_ID);
}

createRoot(document.getElementById("root")!).render(<App />);
