import React, { createContext, useContext, useMemo, useReducer } from "react";
import { api } from "../api/client";

const UrlContext = createContext(null);

const initialState = {
  items: [],          // recent created/retrieved links
  active: null,       // currently selected link record
  stats: null,        // stats for active code
  loading: false,
  error: "",
};

function upsertByShortCode(items, record) {
  const idx = items.findIndex((x) => x.shortCode === record.shortCode);
  if (idx === -1) return [record, ...items];
  const copy = [...items];
  copy[idx] = record;
  return copy;
}

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: "" };

    case "ERROR":
      return { ...state, loading: false, error: action.payload || "Something went wrong." };

    case "CLEAR_ERROR":
      return { ...state, error: "" };

    case "SET_ACTIVE": {
      const record = action.payload;
      return {
        ...state,
        loading: false,
        error: "",
        active: record,
        items: record ? upsertByShortCode(state.items, record) : state.items,
      };
    }

    case "SET_STATS":
      return { ...state, loading: false, error: "", stats: action.payload };

    case "DELETE_SUCCESS": {
      const code = action.payload;
      const items = state.items.filter((x) => x.shortCode !== code);
      const active = state.active?.shortCode === code ? null : state.active;
      const stats = state.active?.shortCode === code ? null : state.stats;
      return { ...state, loading: false, error: "", items, active, stats };
    }

    case "SET_ITEMS":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

export function UrlProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => {
    return {
      clearError() {
        dispatch({ type: "CLEAR_ERROR" });
      },

      setActiveByCode(shortCode) {
        const found = state.items.find((x) => x.shortCode === shortCode) || null;
        dispatch({ type: "SET_ACTIVE", payload: found });
        dispatch({ type: "SET_STATS", payload: null });
      },

      async createShortUrl(url) {
        dispatch({ type: "LOADING" });
        try {
          const record = await api.createShortUrl(url);
          dispatch({ type: "SET_ACTIVE", payload: record });
          dispatch({ type: "SET_STATS", payload: null });
          return record;
        } catch (e) {
          dispatch({ type: "ERROR", payload: e.message });
          return null;
        }
      },

      async getShortUrl(shortCode) {
        dispatch({ type: "LOADING" });
        try {
          const record = await api.getShortUrl(shortCode);
          dispatch({ type: "SET_ACTIVE", payload: record });
          dispatch({ type: "SET_STATS", payload: null });
          return record;
        } catch (e) {
          dispatch({ type: "ERROR", payload: e.message });
          return null;
        }
      },

      async updateShortUrl(shortCode, url) {
        dispatch({ type: "LOADING" });
        try {
          const record = await api.updateShortUrl(shortCode, url);
          dispatch({ type: "SET_ACTIVE", payload: record });
          dispatch({ type: "SET_STATS", payload: null });
          return record;
        } catch (e) {
          dispatch({ type: "ERROR", payload: e.message });
          return null;
        }
      },

      async deleteShortUrl(shortCode) {
        dispatch({ type: "LOADING" });
        try {
          await api.deleteShortUrl(shortCode);
          dispatch({ type: "DELETE_SUCCESS", payload: shortCode });
          return true;
        } catch (e) {
          dispatch({ type: "ERROR", payload: e.message });
          return false;
        }
      },

      async getStats(shortCode) {
        dispatch({ type: "LOADING" });
        try {
          const stats = await api.getStats(shortCode);
          dispatch({ type: "SET_STATS", payload: stats });
          return stats;
        } catch (e) {
          dispatch({ type: "ERROR", payload: e.message });
          return null;
        }
      },

      redirectUrl(shortCode) {
        return api.redirectUrl(shortCode);
      },
    };
    // state.items used by setActiveByCode
  }, [state.items]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
}

export function useUrl() {
  const ctx = useContext(UrlContext);
  if (!ctx) throw new Error("useUrl must be used inside UrlProvider");
  return ctx;
}
