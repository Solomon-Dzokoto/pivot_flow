# PivotFlow Frontend

## Overview

PivotFlow Frontend is the user interface for the PivotFlow application, an advanced platform for monitoring NFT floor prices, cross-chain gas fees, and managing NFT/token portfolios. It provides users with real-time alerts, detailed analytics, and a customizable dashboard to stay ahead in the dynamic Web3 space. The frontend is built to interact seamlessly with the PivotFlow backend canister running on the Internet Computer.

## Tech Stack

*   **Framework:** React (via Vite)
*   **Language:** TypeScript
*   **Styling:**
    *   Tailwind CSS for utility-first CSS.
    *   CSS Modules (as needed, though primarily Tailwind).
    *   Global styles and theme variables in `src/index.css` and `src/theme.css`.
*   **UI Components:** Primarily custom-built components, with potential integration of headless UI libraries like Radix UI (via Shadcn UI components, as seen in `components.json` and some existing UI elements).
*   **State Management:** React Context API (`AuthContext`, `AppContext`, `ThemeContext`, `NotificationContext`).
*   **Routing:** Simple view management via `AppContext` (not using a dedicated routing library like React Router in the current setup).
*   **Icons:** `lucide-react` for a consistent and clean icon set.
*   **Deployment:** Internet Computer (IC)

## Project Structure

The `src` directory is organized as follows:

*   `components/`: Contains reusable UI components.
    *   `dashboard/`: Components specific to the main dashboard, including widgets.
    *   `pages/`: Top-level page components that represent different views of the application.
    *   `ui/`: Generic UI elements like buttons, cards, toggles (some may be inspired by Shadcn UI).
    *   `notifications/`: Components related to user notifications.
*   `contexts/`: React Context providers and hooks for global state management (Auth, App, Theme, Notifications).
*   `declarations/`: Auto-generated Candid interface files for interacting with the backend canister.
*   `hooks/`: Custom React hooks for reusable logic.
*   `lib/`: Core library functions, including `canister.ts` for backend communication and `utils.ts` for helper functions.
*   `store/`: (Currently seems to hold older Zustand store files - may be deprecated or partially used; primarily uses Context API now).
*   `assets/`: Static assets like images (though many are in `public/` or linked directly).
*   `App.tsx`: The main application component that sets up providers and routing logic.
*   `main.tsx`: The entry point of the application, renders the root React component.
*   `index.css`: Global styles, Tailwind CSS base/components/utilities, and CSS theme variables.
*   `theme.css`: Custom global styles, animations, and utility classes.

## Setup and Installation

1.  Navigate to the frontend directory:
    ```bash
    cd src/PivotFlow_frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running Development Server

1.  Ensure your local Internet Computer replica is running (if interacting with a local backend canister). This usually involves `dfx start` in the root project directory.
2.  Start the frontend development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
3.  The application will typically be available at `http://localhost:5173/` (Vite's default) or possibly `http://localhost:8080` if configured differently or via `dfx deploy`. Check your terminal output for the exact URL.

## Building for Production

1.  Generate type bindings and copy canister IDs (if not already done or if backend canister IDs changed):
    ```bash
    npm run build:types # (Or similar script if defined, typically involves 'dfx generate')
    ```
2.  Build the frontend application:
    ```bash
    npm run build
    ```
3.  The build output will be generated in the `dist/` folder. This folder is then used for deployment to the Internet Computer.

## Key Features Implemented

*   **Modular Architecture:** Components, contexts, and services are organized for clarity.
*   **Theming:**
    *   Dark/Light mode support with a `ThemeToggle` component.
    *   Centralized theme variables in `index.css` for easy customization.
    *   Global styles and utility classes in `theme.css`.
*   **Core Pages:**
    *   Login Page (`LoginPage.tsx`)
    *   Dashboard (`DashboardPage.tsx`): Revamped with a new layout, static Web3 metric displays (Cycles, Memory, ICP Price), alerts summary, and transaction history. Includes a customizable widget area.
    *   NFT Alerts Page (`NftAlertsPage.tsx`): For creating and managing NFT floor price alerts.
    *   Blockchain Fees Page (`BlockchainFeesPage.tsx`): Displays mock/static blockchain fee data.
    *   Portfolio Page (`PortfolioPage.tsx`): Manages connected wallets, displays NFTs, and includes a new mocked token balance section (ICP, XTC, ckBTC).
    *   Settings Page (`SettingsPage.tsx`): Tabbed interface for API keys, notification preferences, and UI settings.
*   **State Management:** Uses React Context for authentication, application-wide state, theme, and notifications.
*   **Responsive Design:** Core layout and components are designed to be responsive using Tailwind CSS.
*   **Animated Background:** Subtle animated gradient background applied globally.
*   **Neon Glow Effects:** Utility classes for neon glows, primarily for dark mode.

## Backend Interaction

*   Communication with the Internet Computer backend canister is managed through `src/lib/canister.ts`.
*   This file uses `@dfinity/agent` to create an actor for the backend canister based on its Candid interface.
*   It provides a `CanisterClient` singleton class with methods to call public functions on the backend canister.

## Available Scripts (from `package.json`)

*   `dev`: Starts the Vite development server.
*   `build`: Builds the application for production.
*   `lint`: Lints the codebase (likely using ESLint).
*   *(Other scripts like `preview`, `test`, etc., might be available)*

This README provides a foundational guide for developers working on the PivotFlow frontend.
