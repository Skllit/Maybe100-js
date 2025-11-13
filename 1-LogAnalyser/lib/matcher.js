// lib/matcher.js
export function createMatcher(pattern, options = {}) {
  const { ignoreCase = false } = options;

  // If pattern looks like /regex/flags, parse it
  let regex = null;
  let isRegex = false;

  if (pattern.startsWith("/") && pattern.lastIndexOf("/") > 0) {
    const lastSlash = pattern.lastIndexOf("/");
    const body = pattern.slice(1, lastSlash);
    const flags = pattern.slice(lastSlash + 1) + (ignoreCase ? "i" : "");
    try {
      regex = new RegExp(body, flags);
      isRegex = true;
    } catch (err) {
      throw new Error("Invalid regex pattern");
    }
  } else {
    // escape plain string for safe regex search
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flags = ignoreCase ? "i" : "";
    regex = new RegExp(escaped, flags);
  }

  return {
    test(line) {
      try {
        return regex.test(line);
      } catch {
        return false; // defensive: regex might still throw in pathological cases
      }
    },
    isRegex
  };
}
