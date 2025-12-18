# ❄️ Gemini Omni Chat

A beautiful, multimodal AI chat interface. Experience the power of the latest AI models in a sleek, snowy UI.

## ✨ Features

- **🚀 Multi-Model Support**: Switch seamlessly between models:
    - **Gemini 2.5 Flash Lite**: Extremely fast and cost-effective.
    - **Gemini 3 Flash**: Balanced speed and efficiency.
    - **Gemini 3 Pro**: Advanced reasoning and visual understanding.
    - **Gemini 3 Coding**: Specialized for developer tasks.
    - **Gemini 2.5 Flash Image**: Dedicated image generation and editing.
- **⚡ Real-time Streaming**: Watch responses appear character-by-character.
- **👁️ Multimodal Inputs**: Chat with text and images simultaneously.
- **🧠 Thinking Mode**: Enable extended reasoning for complex problems.
- **🌐 Grounding**: Access real-time information via Google Search.
- **🎨 Dynamic UI**: A premium "Snow" theme with glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the Gemini API enabled
- An API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd gemini-omni-chat
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your API Key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📝 Usage

1.  **Select a Model**: Use the sidebar to choose the best model for your task.
2.  **Configure Options**: Toggle **Thinking** (🧠) or **Grounding** (🌐) in the sidebar.
3.  **Chat**: Type your message or upload an image to start a conversation.
4.  **Clear Chat**: Use the trash icon or sidebar button to reset the session.

---
