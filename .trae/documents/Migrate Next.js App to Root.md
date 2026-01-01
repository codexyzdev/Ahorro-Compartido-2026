I will migrate the Next.js application from `ahorro-compartido-next` to the project root, backing up the existing Vite application to `app-old`.

### 1. Backup Existing App
- Create a directory named `app-old`.
- Move the following files and directories (the current Vite app) into `app-old`:
  - Directories: `components`, `hooks`, `providers`, `public`, `services`
  - Files: `App.tsx`, `constants.ts`, `google-drive-sync-guide.md`, `index.css`, `index.html`, `index.tsx`, `metadata.json`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `types.ts`, `vite.config.ts`, `README.md`, `.gitignore`

### 2. Migrate Next.js App
- Move all contents from `ahorro-compartido-next` (including `app` folder, `auth.ts`, configuration files) to the project root.
- Remove the now empty `ahorro-compartido-next` directory.

### 3. Setup Project Configuration
Since the source folder lacked a `package.json`, I will generate the necessary configuration files for a Next.js 14/15 + Tailwind CSS project:
- **package.json**: Define dependencies (`next`, `react`, `react-dom`, `next-auth@beta`, `framer-motion`, `lucide-react`) and scripts (`dev`, `build`, `start`, `lint`).
- **next.config.mjs**: Basic Next.js configuration.
- **tailwind.config.ts**: Configure content paths for the App Router.
- **postcss.config.mjs**: Setup Tailwind and Autoprefixer.
- **tsconfig.json**: Create a base TypeScript config (Next.js will automatically refine it on first run).
- **.gitignore**: Standard Next.js gitignore.

### 4. Install Dependencies
- Run `pnpm install` to install all defined dependencies and generate the lockfile.

### 5. Verification
- I will attempt to build the project or check for type errors to ensure the migration is valid.
