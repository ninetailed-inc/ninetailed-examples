import React from "react";
import styles from "../styles/Home.module.css";

type HeroProps = {
  headline: string | JSX.Element;
};

export const Hero: React.FC<HeroProps> = ({ headline }) => {
  return <h1 className={styles.title}>{headline}</h1>;
};
