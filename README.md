# CryptoWeb

## Secure Static Authentication

This project now includes a server-side static authentication flow for the existing terminal UI.

### Environment variables
Create a local .env file from .env.example and set the following values:

```env
ADMIN_EMAIL=admin@quanttrader.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-strongly
AUTH_SECRET=change-this-to-a-long-random-string
AUTH_SESSION_TTL_MS=28800000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### How it works
- The frontend sends login requests to the Express backend.
- The backend validates credentials server-side and issues an HttpOnly session cookie.
- The main app checks the session on startup and protects private routes by showing the login screen when unauthenticated.
- Logout clears the session cookie and returns the user to the login form.

### Running locally
1. Copy .env.example to .env and update the values.
2. Start the backend: `node backend/server.js`
3. Start the frontend: `npm run dev`

### Security notes
- Credentials are stored only in backend environment variables.
- No secrets are exposed to client-side JavaScript.
- The login endpoint returns generic errors and rate-limits repeated attempts.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
