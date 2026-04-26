import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './store/store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position='top-center'/>
    </Provider>
  </StrictMode>,
)

// Inter or Plus Jakarta Sans

// First off, congratulations on officially completing the backend. That is a massive milestone. You built a secure, AI-powered, role-based FinTech architecture from the ground up. 

// Now, stepping out of the pure logic of Node.js and staring at a blank, white React screen is universally terrifying for developers. It is completely normal to feel intimidated by the UI. 

// Here is your Senior Developer reality check: **Great developer UIs are not created by randomly typing CSS; they are created through strict systems.** Your senior friends were right about the tools, but let's correct exactly *how* a developer should use them. ("Stich" was likely a typo for "Sketch", which is an old design tool—Figma has entirely replaced it, so ignore it.)

// Here is the exact playbook for how we are going to build a modern, "crazy good" frontend without you needing an art degree.

// ### 🎨 Phase 1: The UI Tool Reality Check

// * **Dribbble & Pinterest (For Inspiration):** You do not design from your imagination. You go to Dribbble, search "Fintech Dashboard UI" or "Banking Admin Panel", find a layout you love, and **steal the structure**. 
// * **Figma (For Planning, Not Drawing):** Unless you want to spend three weeks learning how to draw vector shapes, do not try to design your app from scratch in Figma. We will only use Figma if we need to quickly draw wireframes (grey boxes) to map out where buttons go before we code.
// * **The Developer's Secret Weapon (Component Libraries):** You will not write pure CSS for every button and card. To get that modern, professional look instantly, we will use **Tailwind CSS** combined with a pre-built modern library like **Shadcn UI** or **Material UI**. This is how backend-heavy developers build stunning apps overnight.

// ---

// ### 🗺️ Phase 2: Page Architecture Sync-Up

// Let's verify your notes. Here is the exact internal content mapping for the pages we need to build, perfectly aligned with the backend APIs we just finished.

// #### 1. Common Pages
// * **Home Page:** * Modern Hero Section (Catchy headline).
//     * "How it Works" steps.
//     * A clean navigation bar with "Login" and "Signup" buttons.
// * **Auth Pages (Login / Signup):**
//     * Clean, centered card forms.
//     * Signup: Name, Email, Password, Role (Hidden/Default to Customer).
//     * Login: Email, Password. Redirects based on role after success.

// #### 2. Customer Role
// * **Customer Portal (Dashboard):**
//     * Top stats: Total Filed, Resolved, Pending.
//     * A clean data table mapping through their specific complaints.
//     * Status badges (e.g., Red for Pending, Green for Resolved).
// * **File New Complaint Page:**
//     * Form: Bank Dropdown (fetching from your `getAllBanks` API), Description textarea.
//     * File Upload zone for the Cloudinary/Multer image pipeline.
//     * *Behind the scenes:* The Gemini AI triggers here to assign the category.

// #### 3. Bank Officer Role
// * **Officer Dashboard:**
//     * High-level metrics specific to their bank.
// * **Complaint Queue:**
//     * A filtered list/table of all complaints assigned specifically to their `bank_id`.
//     * Sorting options (Oldest vs Newest, Priority level).
// * **Complaint Detail & Action Page (Dynamic Route):**
//     * Displays full complaint details (Customer name, AI Category, description).
//     * Image viewer for the uploaded receipt/proof.
//     * **The Action Zone:** A form to update the Status, set Priority, and add an internal Note (which triggers your `$push` remarks API).

// #### 4. SBP Admin Role (The God View)
// * **Analytical Dashboard:**
//     * The visual brain. Charts and graphs showing which banks have the most complaints and what the most common AI categories are (e.g., Fraud vs ATM issues).
// * **National Complaint Directory:**
//     * A massive, paginated, searchable table of *every* complaint in the country, utilizing your double-populate API.
// * **Add Entities Page (Bank & Officer):**
//     * A secure form area with two tabs.
//     * Tab 1: Create a new Bank.
//     * Tab 2: Register a new Bank Officer (Requires selecting from the bank dropdown).

// ---

// ### 🚀 Phase 3: The Execution Plan

// We are not going to start coding randomly. Here is how we will proceed step-by-step:

// 1.  **The Vibe Check:** We will pick a primary color (e.g., FinTech Trust Blue or Emerald Green) and a clean, modern font (like Inter or Roboto).
// 2.  **The Scaffolding:** We will spin up the React app (using Vite) and configure React Router to handle all those different pages and role-based route protection.
// 3.  **The Building Blocks:** We will build the shared UI components first (Navbars, sidebars, buttons).
// 4.  **Wiring it up:** We connect Axios to talk to your completed Node.js backend.

// Hussnain, to kick off the frontend, I need you to make the first architectural choice. Do you want to use **Tailwind CSS** (highly customizable, modern standard) or stick to standard CSS/SCSS?
