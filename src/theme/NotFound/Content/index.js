import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import NotFound from "@site/static/img/not-found.png";

export default function NotFoundContent({ className }) {
  return (
    <main className={clsx("container margin-vert--xl", className)}>
      <div className="row">
        <div
          className="col col--6 col--offset-3"
          style={{ textAlign: "center" }}
        >
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page"
            >
              That page does not exist.
            </Translate>
          </Heading>
          <img src={NotFound} alt="Not Found" width={160} height={160} />
        </div>
      </div>
    </main>
  );
}
