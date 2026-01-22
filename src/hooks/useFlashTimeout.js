import { useEffect } from "react";

/**
 * Auto-clears flash messages after `ms`.
 * Example:
 * useFlashTimeout(infoMsg, setInfoMsg, 3500);
 * useFlashTimeout(err, setErr, 5000);
 */
export default function useFlashTimeout(value, setter, ms = 3500) {
  useEffect(() => {
    if (!value) return;
    const t = setTimeout(() => setter(""), ms);
    return () => clearTimeout(t);
  }, [value, setter, ms]);
}
