import { useState } from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import styles from './Home.module.css';

export default function Home() {
  const [splineLoaded, setSplineLoaded] = useState(false);

  return (
    <>
      <section className={styles.hero} id="hero-section">
        {/* ── Background Image ── */}
        <img
          src="./dist/assets/travel-bg3.jpg"
          alt="Travel Background"
          className={styles.backgroundImage}
        />

        {/* ── Background ambient glow ── */}
        <div className={styles.ambientGlow} />
        <div className={styles.ambientGlow2} />

        {/* ── Spline Background ── */}
        <div className={styles.splineBackground}>
          {!splineLoaded && (
            <div className={styles.splineLoader}>
              <div className={styles.spinnerRing} />
              <span>Loading 3D scene…</span>
            </div>
          )}
          <div
            className={`${styles.splineWrapper} ${splineLoaded ? styles.splineVisible : ''}`}
          >
            <Spline
              scene="https://prod.spline.design/XnAzPeihyn8rkPU3/scene.splinecode"
              onLoad={() => setSplineLoaded(true)}
            />
          </div>
        </div>

        <div className={styles.heroInner}>
          {/* ── Text content ── */}
          <div className={styles.textCol}>
            <span className={styles.overline}>
              <span className={styles.dot} />
              Discover the world differently
            </span>

            <h1 className={styles.title}>
              <span className={styles.titleLine}>Explore</span>
              <span className={styles.titleAccent}>The Horizon</span>
            </h1>

            <p className={styles.subtitle}>
              Curated travel experiences that take you beyond the ordinary.
              Discover hidden gems, breathtaking landscapes, and cultural
              wonders across the globe.
            </p>

            <div className={styles.ctas}>
              <Link to="/services" className={styles.ctaPrimary} id="hero-explore-btn">
                Start Exploring
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/register" className={styles.ctaSecondary} id="hero-register-btn">
                Create Account
              </Link>
            </div>

            {/* ── Stats row ── */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>200+</span>
                <span className={styles.statLabel}>Destinations</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statValue}>4.9</span>
                <span className={styles.statLabel}>Avg Rating</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statValue}>50k+</span>
                <span className={styles.statLabel}>Travelers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>
    </>
  );
}
