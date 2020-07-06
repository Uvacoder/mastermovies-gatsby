import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { Link } from "gatsby";
import React from "react";
import { Fade } from "react-reveal";
import { IconMargin } from "../../../components/common/icon_margin";
import { IndexPortfolioBackground } from "./background";
import styles from "./portfolio.module.css";

export const IndexPortfolio: React.FC = () => (
  <div className={styles.portfolio}>
    <Fade>
      <div className={styles.wrapper}>
        <Link to="/portfolio" className={styles.card}>
          <div className={styles.aspectRatio}>
            <div className={styles.background}>
              <IndexPortfolioBackground />
            </div>

            <div className={classnames(styles.column, styles.content)}>
              <h1 className={styles.title}>Portfolio</h1>
              <h3 className={styles.subtitle}>of Marcus Cemes</h3>
              <div className={styles.hint}>
                <IconMargin icon={LeftOutlined} right /> Click anywhere <IconMargin icon={RightOutlined} left />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Fade>
  </div>
);
