import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Hero } from "../components/Hero";
import * as styles from "../styles/Home.module.css";
import { Personalize } from "@ninetailed/experience.js-gatsby";
import { Profile } from "../components/Profile";

const personalizationVariants = [
  {
    id: "1",
    headline: (
      <>
        The Power of Personalization with{" "}
        <a href="https://ninetailed.io/">Ninetailed</a> and{" "}
          <a href="https://www.gatsbyjs.com/">Gatsby</a>
      </>
    ),
    audience: {
      id: process.env.GATSBY_PERSONALIZED_AUDIENCE_1 || "",
      name: "Audience 1",
    },
  },
  {
    id: "2",
    headline: (
      <>
        Enhance your Customer Experience with{" "}
        <a href="https://ninetailed.io/">Ninetailed</a> and{" "}
        <a href="https://www.gatsbyjs.com/">Gatsby</a>
      </>
    ),
    audience: {
      id: process.env.GATSBY_PERSONALIZED_AUDIENCE_2 || "",
      name: "Audience 2",
    },
  },
];

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.h2}>Ninetailed Profile</h2>
        <Profile />
      </div>
      <div className={styles.card}>
        <h2 className={styles.h2}>{`Ninetailed <Personalize /> Component`}</h2>

        <h3 className={styles.h3}>Non Personalized Hero</h3>
        <Personalize
          id={"nonPersonalizedHero"}
          component={Hero}
          holdout={100}
          headline={
            <>
              Welcome to <a href="https://nextjs.org">Gatsby</a>
            </>
          }
          variants={personalizationVariants}
        />
        <h3 className={styles.h3}>Personalized Hero</h3>
        <Personalize
          id={"nonPersonalizedHero"}
          component={Hero}
          holdout={0}
          headline={
            <>
              Welcome to <a href="https://nextjs.org">Gatsby</a>
            </>
          }
          variants={personalizationVariants}
        />
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
