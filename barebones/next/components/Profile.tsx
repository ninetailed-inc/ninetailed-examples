import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    const localProfile = localStorage.getItem("__nt_profile__");
    if (localProfile) {
      setProfile(localProfile);
    }
  }, []);

  return (
    <pre className={styles.code}>
      {" "}
      {JSON.stringify(JSON.parse(profile), null, 4)}
    </pre>
  );
};
