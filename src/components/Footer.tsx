import React from "react";
import { Container, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-dark text-light py-3 mt-auto w-100 border-top">
      <Container className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">{t("brand")}</span>
        <Form.Select
          size="sm"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{ width: "8rem" }}
          aria-label={t("nav.language")}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </Form.Select>
      </Container>
    </footer>
  );
}

export default Footer;

