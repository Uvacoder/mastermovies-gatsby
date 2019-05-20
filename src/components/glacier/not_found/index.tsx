import { RouteComponentProps } from "@reach/router"
import React, { FunctionComponent } from "react"

import styles from "./index.module.css"
import { NotFound } from "../../common/not_found"

export const GlacierNotFound: FunctionComponent<RouteComponentProps> = () => {
  return (
    <NotFound
      title="Glacier"
      titleClass={styles.glacierTitle}
      theme="dark"
      titleLink="/glacier"
      buttonLink="/glacier"
    />
  )
}
