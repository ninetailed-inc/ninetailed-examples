import React from "react";
import * as styles from "../styles/Home.module.css";

type HeroProps = {
  headline: string | JSX.Element;
};

export const Hero: React.FC<HeroProps> = ({ headline }) => {
  return <div className={styles.hero}>{headline}</div>;
};
