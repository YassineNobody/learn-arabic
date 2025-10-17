import { useState } from "react";

export const useLocalStorageState = (key: string) => {
  const [value, setValue] = useState<string>(localStorage.getItem(key) || "");

  const persistValue = (newValue: string) => {
    if (newValue !== value) {
      setValue(newValue);
      return localStorage.setItem(key, newValue);
    }
    return value;
  };

  return { value, persistValue };
};
