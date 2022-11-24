import React from "react";
import styles from "../styles/Home.module.css";

type ProductProps = { productName: string };

export const Product: React.FC<ProductProps> = ({ productName }) => {
  return (
    <div className={styles.product}>
      <span>{productName}</span>
    </div>
  );
};
