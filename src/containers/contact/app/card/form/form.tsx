import { Button, Form, Icon, Input, Popconfirm } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { FunctionComponent, useEffect, useState } from "react";

import { Cancel, cancelTokenSource } from "../../../../../lib/cancelToken";
import { IContactRequest, submitContact } from "../../../../../services/api/contact";
import { humanError } from "../../../../../services/api/error";
import { IHumanError } from "../../../../../types/app";
import { ContactFormOverlay } from "../overlay";
import styles from "./form.module.css";

const nameRegex = /^(?:(?![×Þß÷þø])[-'0-9a-zÀ-ÿ\s])+$/i;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// TODO clean up
const ContactForm: FunctionComponent<FormComponentProps> = ({ form }) => {
  // Send the form using useEffect
  const [sendValues, send] = useState<IContactRequest>(void 0);

  // Confirm the values (anonymous)
  const [confirm, setConfirm] = useState<IContactRequest>(void 0);

  // Success state
  const [finished, setFinished] = useState<boolean>(void 0);
  const [success, setSuccess] = useState<boolean>(void 0);
  const [error, setError] = useState<IHumanError>(void 0);

  const { getFieldDecorator, validateFields } = form;

  /* Prevent default action */
  const handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
  };

  /* Handle the actual submit button and popover confirmation */
  const handleVisibleChange = visible => {
    // Hide the popover
    if (!visible) {
      setConfirm(void 0);
    }

    // Show if necessary
    validateFields((err, values) => {
      if (!err) {
        if (!values.name || !values.email) {
          setConfirm(values);
        } else {
          send(values);
        }
      }
    });
  };

  /** Confirm the popover */
  const handleConfirm = () => {
    send(confirm);
    setConfirm(void 0);
  };

  /* Upload the form to the server */
  useEffect(() => {
    if (!sendValues) return;

    const { token, cancel } = cancelTokenSource();

    // tslint:disable-next-line: no-floating-promises
    (async () => {
      try {
        await submitContact(sendValues, token);
        setFinished(true);
        send(void 0);
        setSuccess(true);
      } catch (err) {
        if (err instanceof Cancel) return;

        setError(humanError(err));
      }
    })();

    return cancel;
  }, [sendValues]);

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <ContactFormOverlay active={finished} success={success} error={error} onRetry={() => setFinished(false)} />
      <Form.Item>
        {getFieldDecorator("name", {
          rules: [
            { pattern: nameRegex, message: "That's a strange name... " },
            { max: 30, message: "Try a shorter version of your name..." },
          ],
        })(
          <Input
            disabled={!!sendValues || success === true}
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Name"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("email", {
          rules: [{ pattern: emailRegex, message: "That's a strange email..." }],
        })(
          <Input
            disabled={!!sendValues || success === true}
            prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Email"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("subject", {
          rules: [
            { required: true, message: "What is it about?" },
            { max: 40, message: "Try and make it a bit shorter..." },
          ],
        })(
          <Input
            disabled={!!sendValues || success === true}
            prefix={<Icon type="highlight" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Subject"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("message", {
          rules: [
            {
              required: true,
              message: "It's rude to leave without saying anything...",
            },
            {
              max: 1000,
              message: "Try and make the initial message a bit shorter...",
            },
          ],
        })(<Input.TextArea disabled={!!sendValues || success === true} placeholder="So what did you want to say?" />)}
      </Form.Item>
      <Form.Item className={styles.button}>
        <Popconfirm
          title="Are you sure you want to send this anonymously?"
          visible={!!confirm}
          onVisibleChange={handleVisibleChange}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(void 0)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            htmlType="submit"
            icon={!finished ? "mail" : success ? "check" : "exclamation"}
            size="large"
            loading={!!sendValues}
            disabled={success === true}
          >
            Dispatch an owl
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};

export const ContactCardContentForm = Form.create({ name: "contact" })(ContactForm);
