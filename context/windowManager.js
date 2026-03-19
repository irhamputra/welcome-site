import { createContext, useContext, useReducer, useCallback } from "react";

const WindowManagerContext = createContext(null);

const WINDOW_CONFIGS = {
  repos: { title: "My Documents", defaultWidth: 700, defaultHeight: 500 },
  profile: { title: "About Me - System Properties", defaultWidth: 450, defaultHeight: 400 },
  mycomputer: { title: "My Computer", defaultWidth: 600, defaultHeight: 450 },
  recyclebin: { title: "Recycle Bin", defaultWidth: 500, defaultHeight: 350 },
  ie: { title: "Microsoft Internet Explorer", defaultWidth: 800, defaultHeight: 560 },
  outlook: { title: "Inbox - Outlook Express", defaultWidth: 750, defaultHeight: 530 },
  paint: { title: "Untitled - Paint", defaultWidth: 820, defaultHeight: 580 },
  notepad: { title: "Untitled - Notepad", defaultWidth: 560, defaultHeight: 400 },
  wordpad: { title: "Document - WordPad", defaultWidth: 680, defaultHeight: 500 },
  calculator: { title: "Calculator", defaultWidth: 220, defaultHeight: 280 },
  run: { title: "Run", defaultWidth: 400, defaultHeight: 210 },
};

function getDefaultPosition(id, index) {
  const offset = index * 30;
  return { x: 100 + offset, y: 50 + offset };
}

const initialState = {
  windows: {},
  windowOrder: [],
  nextZIndex: 100,
  startMenuOpen: false,
};

function windowReducer(state, action) {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const { id } = action;
      if (state.windows[id]?.isOpen) {
        // If already open but minimized, restore it
        if (state.windows[id].isMinimized) {
          return windowReducer(state, { type: "RESTORE_WINDOW", id });
        }
        // Bring to front
        return windowReducer(state, { type: "FOCUS_WINDOW", id });
      }
      const config = WINDOW_CONFIGS[id] || { title: id, defaultWidth: 500, defaultHeight: 400 };
      const pos = getDefaultPosition(id, Object.keys(state.windows).length);
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: {
            id,
            title: config.title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            position: pos,
            width: config.defaultWidth,
            height: config.defaultHeight,
            zIndex: state.nextZIndex,
          },
        },
        windowOrder: [...state.windowOrder.filter((w) => w !== id), id],
        nextZIndex: state.nextZIndex + 1,
        startMenuOpen: false,
      };
    }

    case "CLOSE_WINDOW": {
      const { id } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = { ...newWindows[id], isOpen: false };
      }
      return {
        ...state,
        windows: newWindows,
        windowOrder: state.windowOrder.filter((w) => w !== id),
      };
    }

    case "MINIMIZE_WINDOW": {
      const { id } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = { ...newWindows[id], isMinimized: true };
      }
      return { ...state, windows: newWindows };
    }

    case "RESTORE_WINDOW": {
      const { id } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = {
          ...newWindows[id],
          isMinimized: false,
          zIndex: state.nextZIndex,
        };
      }
      return {
        ...state,
        windows: newWindows,
        windowOrder: [...state.windowOrder.filter((w) => w !== id), id],
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case "MAXIMIZE_WINDOW": {
      const { id } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = {
          ...newWindows[id],
          isMaximized: !newWindows[id].isMaximized,
        };
      }
      return { ...state, windows: newWindows };
    }

    case "FOCUS_WINDOW": {
      const { id } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = {
          ...newWindows[id],
          zIndex: state.nextZIndex,
        };
      }
      return {
        ...state,
        windows: newWindows,
        windowOrder: [...state.windowOrder.filter((w) => w !== id), id],
        nextZIndex: state.nextZIndex + 1,
        startMenuOpen: false,
      };
    }

    case "SET_WINDOW_TITLE": {
      const { id, title } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = { ...newWindows[id], title };
      }
      return { ...state, windows: newWindows };
    }

    case "UPDATE_POSITION": {
      const { id, position } = action;
      const newWindows = { ...state.windows };
      if (newWindows[id]) {
        newWindows[id] = { ...newWindows[id], position };
      }
      return { ...state, windows: newWindows };
    }

    case "TOGGLE_START_MENU": {
      return { ...state, startMenuOpen: !state.startMenuOpen };
    }

    case "CLOSE_START_MENU": {
      return { ...state, startMenuOpen: false };
    }

    default:
      return state;
  }
}

export function WindowManagerProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, initialState);

  const openWindow = useCallback((id) => dispatch({ type: "OPEN_WINDOW", id }), []);
  const closeWindow = useCallback((id) => dispatch({ type: "CLOSE_WINDOW", id }), []);
  const minimizeWindow = useCallback((id) => dispatch({ type: "MINIMIZE_WINDOW", id }), []);
  const restoreWindow = useCallback((id) => dispatch({ type: "RESTORE_WINDOW", id }), []);
  const maximizeWindow = useCallback((id) => dispatch({ type: "MAXIMIZE_WINDOW", id }), []);
  const focusWindow = useCallback((id) => dispatch({ type: "FOCUS_WINDOW", id }), []);
  const updatePosition = useCallback((id, position) => dispatch({ type: "UPDATE_POSITION", id, position }), []);
  const setWindowTitle = useCallback((id, title) => dispatch({ type: "SET_WINDOW_TITLE", id, title }), []);
  const toggleStartMenu = useCallback(() => dispatch({ type: "TOGGLE_START_MENU" }), []);
  const closeStartMenu = useCallback(() => dispatch({ type: "CLOSE_START_MENU" }), []);

  const value = {
    ...state,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    setWindowTitle,
    toggleStartMenu,
    closeStartMenu,
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return context;
}
