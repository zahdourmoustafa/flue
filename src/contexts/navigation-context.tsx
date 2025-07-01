"use client";

import { createContext, useContext, ReactNode } from "react";

interface NavigationContextType {
  navigateWithConfirmation?: (path: string) => void;
  shouldPromptBeforeLeave?: () => boolean;
}

const NavigationContext = createContext<NavigationContextType>({});

export const useNavigationContext = () => {
  return useContext(NavigationContext);
};

interface NavigationProviderProps {
  children: ReactNode;
  navigateWithConfirmation?: (path: string) => void;
  shouldPromptBeforeLeave?: () => boolean;
}

export const NavigationProvider = ({
  children,
  navigateWithConfirmation,
  shouldPromptBeforeLeave,
}: NavigationProviderProps) => {
  return (
    <NavigationContext.Provider
      value={{
        navigateWithConfirmation,
        shouldPromptBeforeLeave,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
