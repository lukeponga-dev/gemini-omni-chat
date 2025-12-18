# 🤖 Building the Android App

This project has been configured with **Capacitor** to run as a native Android app.

## Prerequisites

- **Android Studio** (Latest version recommended)
- **Java Development Kit (JDK)** 17 or higher (usually bundled with Android Studio)

## Steps to Build & Run

1.  **Open in Android Studio**
    Open Android Studio -> **Open** -> Select the `android` folder in this project:
    `c:\Users\lukeg\Downloads\gemini-omni-chat\android`

2.  **Wait for Gradle Sync**
    Android Studio will automatically download necessary Gradle dependencies. Wait for the indexing and sync to finish (bottom status bar).

3.  **Run on Device/Emulator**
    - Connect your Android phone via USB (Debugging enabled) OR create an AVD (Emulator) in Android Studio.
    - Click the green **Run (Play)** button in the top toolbar.

## Updating the App

If you make changes to the React code (`App.tsx`, etc.):,

1.  **Rebuild the Web App**:
    ```bash
    npm run build
    ```

2.  **Sync with Android**:
    ```bash
    npx cap sync
    ```

3.  **Re-run in Android Studio**.
