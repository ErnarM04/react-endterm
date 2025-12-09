import React from "react";
import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation();
    return (
        <div className="d-flex justify-content-center align-items-center bg-light-subtle" style={{ minHeight: "40em" }}>
            <div className="container text-center p-4 my-5">
                <h1>{t('home.title')}</h1>

                <p className="mt-3 mx-auto" style={{ maxWidth: "50%" }}>
                    {t('home.tagline')} {t('home.description')}
                </p>
            </div>
        </div>
    );
}

export default Home;



