import { Icon, Input, Popover, Spin } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useState } from "react";

import { AnimatedCheck } from "../../../../../components/common/animated_check";
import { IconMargin } from "../../../../../components/common/icon_margin";
import { DarkButton } from "../../../../../components/glacier/dark_button";
import { IHumanError } from "../../../../../types/app";
import styles from "./components.module.css";

const Ready: FunctionComponent = () => (
  <>
    <IconMargin type="rocket" marginRight /> Ready
  </>
);

const Query: FunctionComponent = () => (
  <div className={styles.align}>
    <Spin className={styles.largerSeparation} /> Querying
  </div>
);

const Prompt: FunctionComponent<{ failed?: boolean; onSubmit: (password: string) => void }> = ({
  failed,
  onSubmit,
}) => {
  const [input, setInput] = useState<string>("");
  const [popover, setPopover] = useState<boolean>(false);

  const submit = () => {
    if (input) onSubmit(input);
  };

  return (
    <>
      <div>
        {failed ? (
          <>
            <div className={classnames(styles.failed, styles.align)}>
              <AnimatedCheck active failed size={18} className={styles.check} /> Unauthorised
            </div>

            <p className={styles.promptHint}>The credentials you provided were not accepted</p>
          </>
        ) : (
          <>
            <p className={styles.promptHint}>This film requires an unlock key</p>
          </>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <Input.Password
          onChange={e => setInput(e.target.value)}
          className={styles.darkInput}
          visibilityToggle
          onPressEnter={submit}
          autoFocus
        />
        <Popover
          placement="bottom"
          visible={popover && !input}
          onVisibleChange={setPopover}
          title={void 0}
          trigger="hover"
          content={
            <>
              <IconMargin type="cross-circle" marginRight /> Password can't be empty!
            </>
          }
        >
          <DarkButton className={styles.inputButton} onClick={submit}>
            Unlock
          </DarkButton>
        </Popover>
      </div>
    </>
  );
};

const Auth: FunctionComponent = () => (
  <div className={styles.align}>
    <Spin className={classnames(styles.authSpin, styles.largerSeparation)} /> Authorising
  </div>
);

const Success: FunctionComponent = () => (
  <div className={classnames(styles.success, styles.align)}>
    <AnimatedCheck active size={22} className={styles.check} /> Authorised
  </div>
);

const Error: FunctionComponent<{ error?: IHumanError; onRetry?: () => void }> = ({ error, onRetry }) => (
  <>
    <div className={classnames(styles.error, styles.align)}>
      <AnimatedCheck active failed size={22} className={styles.check} /> Error
    </div>
    {error && (
      <div className={styles.errorInfo}>
        {error.icon && (
          <div>
            <Icon type={error.icon} className={styles.errorInfoIcon} />
          </div>
        )}
        {error.text && <div>{error.text}</div>}
        {error.code && (
          <div className={styles.errorInfoCode}>
            <code>{error.code}</code>
          </div>
        )}
      </div>
    )}
    {onRetry && (
      <DarkButton className={styles.errorButton} onClick={onRetry}>
        <IconMargin type="reload" marginRight /> Retry
      </DarkButton>
    )}
  </>
);

export const GlacierAuthComponent = {
  Ready,
  Query,
  Prompt,
  Auth,
  Success,
  Error,
};
