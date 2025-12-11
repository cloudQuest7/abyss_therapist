import React from 'react';
import styles from './hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.headline}>your safe space, always</h1>
        <p className={styles.subheadline}>
          AI-powered emotional support that actually gets you
        </p>
        <button className={styles.ctaButton}>
          start feeling better ✨
        </button>
      </div>
      <div className={styles.blobWrapper}>
        <div className={`${styles.blob} ${styles.blobPurple}`}></div>
        <div className={`${styles.blob} ${styles.blobNavy}`}></div>
      </div>
    </section>
  );
};

export default Hero;