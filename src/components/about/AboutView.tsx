import { Container, Button } from "react-bootstrap";
import profile from "../../assets/profile-photo.png";
import type { AboutViewProps } from "../../types/types.ts";

const renderLangContent = (lang: "en" | "pl") =>
  lang === "en" ? (
    <>
      <img src="/gb.svg" alt="English flag" width="25" />
      <span>EN |</span>
      <img src="/pl.svg" alt="Polish flag" width="25" />
      <span>Pl</span>
    </>
  ) : (
    <>
      <img src="/pl.svg" alt="Polish flag" width="25" />
      <span>Pl |</span>
      <img src="/gb.svg" alt="English flag" width="25" />
      <span>EN</span>
    </>
  );

const AboutView = ({
  content: t,
  language,
  onToggleLanguage,
}: AboutViewProps) => {
  return (
    <Container fluid className="body-page mt-4 mb-4 px-3 px-md-5">
      <div className="heading-grid mb-4">
        <div className="language-toggle-mirror" aria-hidden="true">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            style={{ visibility: "hidden" }}
          >
            {renderLangContent(language)}
          </Button>
        </div>

        <h1 className="mb-0">{t.heading}</h1>

        <div className="language-toggle">
          <Button
            variant="outline-secondary"
            onClick={onToggleLanguage}
            className="d-flex align-items-center gap-2"
          >
            {renderLangContent(language)}
          </Button>
        </div>
      </div>

      <div className="intro-section mb-4">
        <img src={profile} alt="profile" className="profile-photo" />
        <p className="mt-3">{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <h2 className="mt-5">{t.purposeHeading}</h2>
      <hr className="mb-4 mt-0" />
      <p>{t.purposeText}</p>
      <p>{t.purposeListIntro}</p>
      <ul>
        {t.purposeList.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-5">{t.featuresHeading}</h2>
      <hr className="mb-4 mt-0" />
      <p>{t.featuresIntro}</p>

      {Object.entries(t.features).map(([key, value]) => (
        <div key={key}>
          <h5 className="mt-4">{value.title}</h5>
          <p>{value.text}</p>
          {value.list && (
            <ul>
              {value.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {value.backend && <p>{value.backend}</p>}
        </div>
      ))}

      <h2 className="mt-5">{t.techHeading}</h2>
      <hr className="mb-4 mt-0" />
      <ul>
        {t.techList.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-5">{t.nextHeading}</h2>
      <hr className="mb-4 mt-0" />
      <p>{t.nextText}</p>
    </Container>
  );
};

export default AboutView;
