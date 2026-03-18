# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev      # start development server
yarn build    # production build
yarn start    # start production server
```

No lint or test scripts are configured.

## Environment

Requires a `.env` file with:
```
GITHUB_TOKEN=<personal_access_token>
```

This token is used by `service/github.js` to authenticate GitHub API requests.

## Architecture

Personal portfolio site built with Next.js 16 (JavaScript, no TypeScript) themed as a Windows XP desktop experience. Fetches and displays GitHub profile data and repositories.

**Theme:** Windows XP — uses `xp.css` for authentic XP window chrome, plus custom CSS for taskbar, Start menu, login screen, and desktop layout.

**Pages:**
- `pages/index.js` — XP Login/Welcome screen. `getServerSideProps` fetches GitHub user profile for the user card. Click user → navigates to `/desktop`.
- `pages/desktop.js` — XP Desktop. `getServerSideProps` fetches user profile + repos. Renders Desktop component with icons, windows, taskbar, and Start menu.
- `pages/_app.js` — App root with XP.css import, global CSS, `<Head>` metadata, and `WindowManagerProvider`.

**Data flow:**
- `service/github.js` — axios instance with `baseURL: https://api.github.com/users` and Authorization header from `GITHUB_TOKEN`.
- `context/windowManager.js` — manages window states (open/close/minimize/maximize/focus/z-index) and Start menu toggle via `useReducer`.

**XP Components (`components/xp/`):**
- `Desktop.js` — full-viewport container with Bliss wallpaper, desktop icon grid, windows, Start menu, and Taskbar.
- `Window.js` — reusable draggable XP window using `react-draggable` + xp.css `.window` markup. Auto-maximizes on mobile.
- `DesktopIcon.js` — clickable desktop icon with select/double-click behavior.
- `Taskbar.js` — bottom taskbar with Start button, open window buttons, and system tray clock.
- `StartMenu.js` — two-column XP Start menu with user avatar, navigation items, and Log Off/Turn Off buttons.
- `LoginScreen.js` — XP welcome/login screen with blue gradient, user card, and loading transition.

**Content Windows (`components/xp/windows/`):**
- `ReposWindow.js` — Explorer-style sortable/paginated table of GitHub repos.
- `ProfileWindow.js` — System Properties-style user profile display.
- `MyComputerWindow.js` — Fun system info and tech stack display.
- `RecycleBinWindow.js` — Empty recycle bin placeholder.

**Styling:** Tailwind CSS (preflight disabled) + xp.css + custom CSS in `styles/globals.css`. Static assets in `public/xp/` (SVG icons and wallpaper).
