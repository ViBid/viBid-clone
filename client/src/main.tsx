import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Head, Link, Title, Meta } from "@/components/ui/head";

// Add Font Awesome
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

// Add Google Fonts
const googleFontsLink = document.createElement('link');
googleFontsLink.rel = 'stylesheet';
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
document.head.appendChild(googleFontsLink);

// Add page title
const titleElement = document.createElement('title');
titleElement.textContent = 'PropertyFinder.ae | UAE Properties for Sale and Rent';
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
