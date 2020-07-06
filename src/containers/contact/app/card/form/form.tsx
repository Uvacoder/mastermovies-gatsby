import { CheckOutlined, ExclamationOutlined, HighlightOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Popconfirm } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { Reducer, useEffect, useReducer } from "react";
import { Cancel, cancelTokenSource } from "../../../../../lib/cancelToken";
import { IContactRequest, submitContact } from "../../../../../services/api/contact";
import { humanError } from "../../../../../services/api/error";
import { IHumanError } from "../../../../../types/app";
import { ContactFormOverlay } from "../overlay";
import styles from "./form.module.css";

const nameRegex = /^(?:(?![×Þß÷þø])[-'0-9a-zÀ-ÿ\s])+$/i;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface State {
  status: "ready" | "confirm" | "sending" | "done";
  values?: IContactRequest;
  error?: IHumanError;
}

export const ContactCardContentForm: React.FC = () => {
  const [form] = useForm();

  const [state, setState] = useReducer<Reducer<State, Partial<State>>>((state, change) => ({ ...state, ...change }), {
    status: "ready",
  });

  /**
   * Fired when the popover should open, or the mouse clicks away and it should close.
   * The popover completely overrides the submit button, submit logic is done here.
   */
  const popoverVisibleRequest = async (shouldBeVisible) => {
    if (!shouldBeVisible) {
      setState({ status: "ready" });
      return;
    }

    try {
      const values = await form.validateFields();
      setState({ status: !values.name || !values.email ? "confirm" : "sending", error: void 0 });
    } catch {
      // form did not validate, error hints are shown
    }
  };

  /** When the OK/Cancel popover buttons are clicked */
  const handlePopoverAction = (ok: boolean) => {
    setState({ status: ok ? "sending" : "ready", error: void 0 });
  };

  /** When the overlay retry button is clicked */
  const onRetry = () => {
    setState({ status: "ready" }); // clearing error here causes flicker
  };

  /** Submit the form to the server */
  useEffect(() => {
    if (state.status !== "sending") return;

    const { token, cancel } = cancelTokenSource();

    (async () => {
      try {
        await submitContact(form.getFieldsValue() as IContactRequest, token);
        setState({
          status: "done",
        });
      } catch (err) {
        if (err instanceof Cancel) return;

        setState({ status: "done", error: humanError(err) });
      }
    })();

    return cancel;
  }, [state.status]);

  const disabled = state.status !== "ready";

  return (
    <Form form={form} className={styles.form}>
      <ContactFormOverlay
        active={state.status === "done"}
        success={!state.error}
        error={state.error}
        onRetry={onRetry}
      />

      <Form.Item
        name="name"
        rules={[
          { pattern: nameRegex, message: "That's a strange name... " },
          { max: 30, message: "Try a shorter version of your name..." },
        ]}
      >
        <Input disabled={disabled} prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Name" />
      </Form.Item>

      <Form.Item name="email" rules={[{ pattern: emailRegex, message: "That's a strange email..." }]}>
        <Input disabled={disabled} prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="subject"
        rules={[
          { required: true, message: "What is it about?" },
          { max: 40, message: "Try and make it a bit shorter..." },
        ]}
      >
        <Input
          disabled={disabled}
          prefix={<HighlightOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Subject"
        />
      </Form.Item>

      <Form.Item
        name="message"
        rules={[
          {
            required: true,
            message: "It's rude to leave without saying anything...",
          },
          {
            max: 1000,
            message: "Try and make the initial message a bit shorter...",
          },
        ]}
      >
        <Input.TextArea disabled={disabled} placeholder="So what did you want to say?" />
      </Form.Item>

      <Form.Item className={styles.button}>
        <Popconfirm
          title="Are you sure you want to send this anonymously?"
          visible={state.status === "confirm"}
          onVisibleChange={popoverVisibleRequest}
          onConfirm={() => handlePopoverAction(true)}
          onCancel={() => handlePopoverAction(false)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            htmlType="submit"
            icon={
              state.status !== "done" ? <MailOutlined /> : !state.error ? <CheckOutlined /> : <ExclamationOutlined />
            }
            size="large"
            loading={state.status === "sending"}
            disabled={state.status === "done"}
          >
            Dispatch an owl
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
