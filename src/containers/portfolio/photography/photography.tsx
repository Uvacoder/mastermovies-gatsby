import React from "react";
import { PortfolioButton } from "../../../components/portfolio/button";
import { PortfolioContent, PortfolioSection, PortfolioTitle } from "../../../components/portfolio/section";
import { Brand500px } from "../../../images/icons/500px";
import { BrandInstagram } from "../../../images/icons/instagram";
import { PortfolioPhotoGallery } from "./gallery";
import styles from "./photography.module.css";

export const PortfolioPhotography: React.FC = () => (
  <PortfolioSection separate>
    <PortfolioContent padding vertical>
      <div className={styles.gallery}>
        <PortfolioPhotoGallery className={styles.shadow} />
        <PortfolioPhotoGallery />
      </div>
    </PortfolioContent>

    <PortfolioContent padding vertical>
      <PortfolioTitle>Photography</PortfolioTitle>
      <p>
        My interest for photography arose a few years after my first film, when the technical aspects of an image, such
        as the shutter speed, aperture and ISO settings (the three pillars of capturing an image) started taking
        precedence. Photography reverts back to the basics, focussing more on composition and lighting, the art of being
        able use that small window to peak into the world and capture the best snapshot possible.
      </p>
      <p>
        That's where their similarities end, both film and photography then diverge creatively and technically. Film
        remains, in my opinion, a superset over photography. Both fields have their specialities, but photography skills
        are greatly beneficial in film, which extends upon the basic concepts of capturing an image and infuses it with
        dynamic motion, requiring more people, more time, far more data, but providing a unique and absorbing story.
      </p>
      <p>
        My camera is a permanent companion when travelling. The thought of the unique pictures, very few of which I end
        up publishing, is what I look forward to most when looking at the world with my own eyes.
      </p>
      <div className={styles.buttons}>
        <PortfolioButton icon={<Brand500px />} href="https://500px.com/MarcusCemes">
          My 500px
        </PortfolioButton>
        <PortfolioButton icon={<BrandInstagram />} href="https://www.instagram.com/marcus_cemes/">
          My Instagram
        </PortfolioButton>
      </div>
    </PortfolioContent>
  </PortfolioSection>
);
