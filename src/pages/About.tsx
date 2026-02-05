import { useState } from "react";
import AboutView from "../components/about/AboutView";
import { content } from "../constants/aboutContent";
import type { Language } from "../types/types";

const About = () => {
  const [language, setLanguage] = useState<Language>("en");
  const t = content[language];

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pl" : "en"));
  };

  return (
    <AboutView
      content={t}
      language={language}
      onToggleLanguage={toggleLanguage}
    />
  );
};

export default About;
