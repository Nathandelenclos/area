import React, { createContext, FC, ReactNode, useState } from "react";
import { lang, LangType, Language } from "@src/lang";

export type AppContextType = {
  language: Language;
  appName: string;
  translate: (...keys: string[]) => string;
  setLanguage: (language: Language) => void;
};

export const ApplicationContext = createContext<AppContextType>({
  language: "en",
  appName: "AppName",
  translate: (...keys: string[]): string => keys.join(" "),
  setLanguage: (language: Language) => language,
});

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const [language, setLang] = useState<Language>("fr");

  const defaultValues: AppContextType = {
    language,
    appName: "AppName",
    translate: (...keys: string[]): string => {
      return keys.reduce((acc: LangType | string, key: string) => {
        if (typeof acc === "object") {
          return acc[key];
        }
        return "";
      }, lang[language]) as string;
    },
    setLanguage: (language: Language) => {
      setLang(language);
    },
  };

  return (
    <ApplicationContext.Provider value={defaultValues}>
      {children}
    </ApplicationContext.Provider>
  );
};

const AppContext: () => AppContextType = () =>
  React.useContext(ApplicationContext);
export default AppContext;