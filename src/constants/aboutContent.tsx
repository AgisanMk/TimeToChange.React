import type { Content } from "../types/types";

export const content: Record<"en" | "pl", Content> = {
  en: {
    heading: "Hi! It’s a pleasure to have you here!",
    intro1: (
      <>
        My name is <strong>Agnieszka Makowej</strong>, and I created the{" "}
        <strong>Time To Change</strong> project as part of my journey towards
        becoming a&nbsp;frontend developer. The desire for personal growth and
        positive change inspired me to design an application that helps users
        assess whether their current financial capacity aligns with their dream
        goals. The app aims to answer the question: Is&nbsp;now the time to
        change jobs?
      </>
    ),
    intro2: (
      <>
        This is not just an educational project – it’s also a practical tool
        that supports conscious planning and encourages reflection on everyday
        financial choices. It allowed me to combine my interest in personal
        development with my passion for programming.
      </>
    ),
    purposeHeading: "Purpose & Problem Solved",
    purposeText: (
      <>
        <strong>Time To Change</strong> was created for individuals striving to
        reach a specific financial level in order to achieve personal dreams and
        life goals. The app addresses a common real-world challenge: difficulty
        in evaluating one’s current financial situation and understanding what
        is needed to turn plans into reality. The app allows users to determine
        when it's worth changing their current job to achieve their dreams.
      </>
    ),
    purposeListIntro: <>The application enables users to:</>,
    purposeList: [
      "Assess their current financial condition",
      "Calculate the monthly financial requirements needed to achieve their goals",
      "Check whether their current finances are sufficient for goal realisation",
      "Determine additional monthly income needed or identify surplus funds",
      "Determine when it's worth changing jobs to pursue your dreams.",
    ],
    featuresHeading: "Core Features",
    featuresIntro: (
      <>
        The application functions as an interactive financial calculator,
        allowing users to analyse their finances in relation to their life
        ambitions. Key features include:
      </>
    ),
    features: {
      profile: {
        title: "Profile",
        text: (
          <>
            Users can enter basic information such as their name, country, and
            currency. These are auto-detected based on the browser settings.
          </>
        ),
      },
      goals: {
        title: "Goal Setting",
        text: (
          <>
            Users define one or more financial goals (e.g. buying a flat,
            travelling, or studying). For each goal, they specify the target
            amount and the time horizon.
          </>
        ),
      },
      income: {
        title: "Income & Expenses",
        text: (
          <>
            Incomes are categorised as fixed, variable, or passive. Expenses are
            also grouped. These inputs help calculate <em>"free funds"</em> –
            disposable income that can be allocated to goals.
          </>
        ),
      },
      summary: {
        title: "Summary & Analysis",
        text: <>The Summary section provides insights such as:</>,
        list: [
          "Are current finances sufficient for the defined goals?",
          "What shortfalls exist?",
          "How much surplus income is available?",
          "Could it be time to change jobs?",
        ],
        backend: (
          <>
            All financial data is sent to a C# backend API - ASP.NET (PHP
            version also available), which returns a calculation of the user’s
            financial level.
          </>
        ),
      },
      additional: {
        title: "Additional Features",
        list: [
          "Load default data (incomes and expenses)",
          "One-click reset to clear session and inputs",
        ],
        text: undefined,
      },
    },
    techHeading: "Technologies Used",
    techList: [
      "HTML / CSS / JavaScript (ES6+)",
      "React + TypeScript (via Vite)",
      "React Context API & Reducers for state management",
      "React Bootstrap for responsive UI components",
      "sessionStorage for persistent user data",
      "C# ASP.NET Web API (PHP version also available) - backend for financial calculations",
      "Git / GitHub for version control",
    ],
    nextHeading: "What's Next?",
    nextText: (
      <>
        Future plans include adding user authentication, saving calculation
        history, and enabling full data persistence via a connected database.
      </>
    ),
  },

  pl: {
    heading: "Cześć! Miło Cię tu widzieć!",
    intro1: (
      <>
        Nazywam się <strong>Agnieszka Makowej</strong>, a projekt{" "}
        <strong>Time To Change</strong> stworzyłam w ramach mojej nauki na
        frontend developerkę. Chęć rozwoju i pozytywnej zmiany zainspirowała
        mnie do stworzenia aplikacji, która pomaga użytkownikom ocenić, czy ich
        obecne możliwości finansowe pozwalają na realizację wymarzonych celów.
        Aplikacja ma za zadanie odpowiedzieć na pytanie: Czy nadszedł teraz czas
        na zmianę pracy?
      </>
    ),
    intro2: (
      <>
        To nie tylko projekt edukacyjny – to również praktyczne narzędzie
        wspierające świadome planowanie i refleksję nad codziennymi wyborami
        finansowymi. Połączyłam w nim zainteresowanie rozwojem osobistym z pasją
        do programowania.
      </>
    ),
    purposeHeading: "Cel i rozwiązywany problem",
    purposeText: (
      <>
        <strong>Time To Change</strong> powstało z myślą o osobach, które chcą
        osiągnąć określony poziom finansowy, by spełnić swoje marzenia i życiowe
        cele. Aplikacja odpowiada na powszechny problem – trudność w ocenie
        własnej sytuacji finansowej i określeniu, co jest potrzebne do
        realizacji planów. Aplikacja pozwala użytkownikom określić, kiedy warto
        zmienić obecną pracę, aby spełnić swoje marzenia.
      </>
    ),
    purposeListIntro: <>Aplikacja pozwala użytkownikowi:</>,
    purposeList: [
      "Ocenić swoją bieżącą kondycję finansową",
      "Obliczyć miesięczne zapotrzebowanie finansowe na realizację celów",
      "Sprawdzić, czy aktualne środki wystarczają na realizację planów",
      "Określić potrzebny dodatkowy dochód miesięczny lub nadwyżkę",
      "Określić moment w którym warto zmienić pracę w celu realizacji marzeń",
    ],
    featuresHeading: "Funkcjonalności",
    featuresIntro: (
      <>
        Aplikacja działa jako interaktywny kalkulator finansowy, umożliwiając
        analizę budżetu w kontekście życiowych celów. Główne funkcje to:
      </>
    ),
    features: {
      profile: {
        title: "Profil",
        text: (
          <>
            Użytkownik podaje dane takie jak imię, kraj i waluta. Kraj i waluta
            są wykrywane automatycznie na podstawie przeglądarki.
          </>
        ),
      },
      goals: {
        title: "Ustalanie celów",
        text: (
          <>
            Użytkownik może zdefiniować jeden lub więcej celów finansowych (np.
            zakup mieszkania, podróże, studia) wraz z kwotą i horyzontem
            czasowym.
          </>
        ),
      },
      income: {
        title: "Przychody i wydatki",
        text: (
          <>
            Dochody są podzielone na stałe, zmienne i pasywne. Wydatki są
            również grupowane. Te dane pozwalają wyliczyć tzw.{" "}
            <em>"wolne środki"</em>, które można przeznaczyć na realizację
            celów.
          </>
        ),
      },
      summary: {
        title: "Podsumowanie i analiza",
        text: <>Sekcja podsumowania zawiera wnioski takie jak:</>,
        list: [
          "Czy aktualne finanse pozwalają na realizację celów?",
          "Jakie są ewentualne braki?",
          "Jaka jest dostępna nadwyżka?",
          "Czy to może być moment na zmianę pracy",
        ],
        backend: (
          <>
            Dane finansowe są wysyłane do zewnętrznego API napisanego w C# -
            ASP.NET (dostępna również wersja napisana w PHP), które zwraca
            kalkulację poziomu finansowego.
          </>
        ),
      },
      additional: {
        title: "Dodatkowe funkcje",
        list: [
          "Wczytanie przykładowych danych (przychody i wydatki)",
          "Reset jednym kliknięciem (czyszczenie sesji i pól)",
        ],
        text: undefined,
      },
    },
    techHeading: "Wykorzystane technologie",
    techList: [
      "HTML / CSS / JavaScript (ES6+)",
      "React + TypeScript (Vite)",
      "Context API + Reducery (zarządzanie stanem)",
      "React Bootstrap – komponenty responsywne",
      "sessionStorage – przechowywanie danych użytkownika",
      "C# ASP.NET Web API (dostępna również wersja napisana w PHP)– backend do obliczeń finansowych",
      "Git / GitHub – kontrola wersji",
    ],
    nextHeading: "Co dalej?",
    nextText: (
      <>
        Plany rozwoju obejmują m.in. dodanie logowania użytkownika, zapisywanie
        historii obliczeń oraz trwałe przechowywanie danych w bazie.
      </>
    ),
  },
};
