# Project File Structure

## Root Directory (`/`)

| File | Purpose |
| :--- | :--- |
| **`App.tsx`** | **Core Controller**. Manages the application state (chat history, active model, loading status) and coordinates between the UI components and the AI service. |
| **`index.tsx`** | **Entry Point**. Bootstraps the React application and mounts it to the DOM. |
| **`types.ts`** | **Type Definitions**. Defines TypeScript interfaces for `Message`, `AppConfig`, and the `AVAILABLE_MODELS` configuration constant. |
| **`vite.config.ts`** | **Build Config**. Configures Vite, including React plugins, port settings (3000), and environment variable loading. |
| **`index.html`** | **HTML Template**. The main HTML file containing the root div and meta tags. |
| **`package.json`** | **Dependencies**. Lists libraries like `react`, `lucide-react`, and `@google/genai`. |

## Components (`/components`)

| Component | Description |
| :--- | :--- |
| **`Sidebar.tsx`** | **Navigation & Settings**. <br>• Allows users to switch between Gemini models.<br>• Toggles "Thinking" and "Grounding" modes.<br>• Manages the Thinking Budget slider.<br>• Responsive design (collapses on mobile). |
| **`MessageList.tsx`** | **Chat History Display**. <br>• Renders the scrollable list of messages.<br>• Uses `react-markdown` to format AI responses.<br>• Displays code blocks with syntax highlighting.<br>• Handles "Scroll to Bottom" logic. |
| **`InputArea.tsx`** | **User Input**. <br>• Text area for typing prompts.<br>• File picker for uploading images.<br>• Handles "Enter to Send" and button clicks. |
| **`SnowBackground.tsx`** | **Visual Theme**. <br>• Renders the animated falling snow effect using an HTML5 Canvas.<br>• Adds to the "Glassmorphism" aesthetic. |

## Services (`/services`)

| File | Purpose |
| :--- | :--- |
| **`geminiService.ts`** | **AI Integration Layer**. <br>• Initializes the `GoogleGenAI` client.<br>• **`streamMessage`**: The main function that sends text/images to the API and yields streaming chunks.<br>• Handles API Key validation and error mapping. |
