import { Button, Form, Icon, Input, Popconfirm } from "antd";
import { FormComponentProps } from "antd/lib/form";
import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../common/api/common";
import { IContactRequest, contact } from "../../common/api/contact";
import styles from "./form.module.css";
import { ContactFormOverlay } from "./overlay";

const nameRegex = /^(?:(?![×Þß÷þø])[-'0-9a-zÀ-ÿ\s])+$/i;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ContactForm: FunctionComponent<FormComponentProps> = ({ form }) => {
  // Send the form using useEffect
  const [sendValues, send] = useState<IContactRequest>(null);

  // Confirm the values (anonymous)
  const [confirm, setConfirm] = useState<IContactRequest>(null);

  // Success state
  const [finished, setFinished] = useState<boolean>(null);
  const [success, setSuccess] = useState<boolean>(null);
  const [error, setError] = useState<"csrf" | "limit">(null);

  const { getFieldDecorator, validateFields } = form;

  /* Prevent default action */
  const handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
  };

  /* Handle the actual submit button and popover confirmation */
  const handleVisibleChange = visible => {
    // Hide the popover
    if (!visible) {
      setConfirm(null);
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
    setConfirm(null);
  };

  /* Upload the form to the server */
  useEffect(() => {
    if (!sendValues) return;

    let mounted = true;
    const cancel = createCancelToken();
    contact(cancel.token, sendValues)
      .then(() => {
        if (mounted) {
          setFinished(true);
          send(null);
          setSuccess(true);
        }
      })
      .catch(err => {
        if (mounted) {
          setFinished(true);
          send(null);
          setSuccess(false);
          if (err && err.response) {
            if (err.response.status === 429) {
              setError("limit");
            } else if (
              err.response.status === 403 &&
              err.response.data &&
              err.response.data.message === "Bad CSRF token"
            ) {
              setError("csrf");
            } else if (typeof err.response.message === "string") {
              setError(err.response.message);
            }
          } else if (err && typeof err.message === "string") {
            setError(err.message);
          }
        }
      });
    return () => (mounted = false);
  }, [sendValues]);

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <ContactFormOverlay
        active={finished}
        success={success}
        error={error}
        onRetry={() => setFinished(false)}
      />
      <Form.Item>
        {getFieldDecorator("name", {
          rules: [
            { pattern: nameRegex, message: "That's a strange name... " },
            { max: 30, message: "Try a shorter version of your name..." },
          ],
        })(
          <Input
            disabled={sendValues !== null}
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Name"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("email", {
          rules: [
            { pattern: emailRegex, message: "That's a strange email..." },
          ],
        })(
          <Input
            disabled={sendValues !== null}
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
            disabled={sendValues !== null}
            prefix={
              <Icon type="highlight" style={{ color: "rgba(0,0,0,.25)" }} />
            }
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
        })(
          <Input.TextArea
            disabled={sendValues !== null}
            placeholder="So what did you want to say?"
          />
        )}
      </Form.Item>
      <Form.Item className={styles.button}>
        <Popconfirm
          title="Are you sure you want to send this anonymously?"
          visible={confirm !== null}
          onVisibleChange={handleVisibleChange}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            htmlType="submit"
            icon={!finished? "mail" : success? "check" : "exclamation"}
            size="large"
            loading={sendValues !== null}
          >
            Dispatch an owl
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};

export const ContactCardContentForm = Form.create({ name: "contact" })(
  ContactForm
);
