import React, { createContext, useContext, useState } from "react";

type Lang = "en" | "ar";
interface LangCtx { lang: Lang; toggle: () => void; t: (en: string, ar: string) => string; isAr: boolean; }

const Ctx = createContext<LangCtx>({ lang:"en", toggle:()=>{}, t:(e)=>e, isAr:false });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang(l => l === "en" ? "ar" : "en");
  const t = (en: string, ar: string) => lang === "ar" ? ar : en;
  return (
    <Ctx.Provider value={{ lang, toggle, t, isAr: lang === "ar" }}>
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        style={{ fontFamily: lang === "ar" ? "'Segoe UI','Tahoma',sans-serif" : "'Segoe UI',system-ui,sans-serif" }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
};

export const useLang = () => useContext(Ctx);
