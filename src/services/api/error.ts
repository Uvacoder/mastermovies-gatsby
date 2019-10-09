import { Cancel } from "../../lib/cancelToken";
import { IHumanError } from "../../types/app";
import { CsrfError } from "./csrf";

export function humanError(err: any): IHumanError {
  const human: IHumanError = {
    text: "Some sort of error has occurred",
    code: err.message,
    icon: "exclamation-circle",
  };

  // Cancel Error
  if (err instanceof Cancel) {
    human.text = "Would you like to try that again?";
    human.code = "Operation was cancelled";
    human.icon = "delete";
  }

  // CSRF Error
  if (err instanceof CsrfError) {
    human.text = "Your request could not be carried out";
    human.code = "MISSING_CSRF_TOKEN";
    human.icon = "stop";
  }

  // Axios based errors
  if (err.isAxiosError) {
    if (err.message === "Network Error") {
      human.text = "Failed to connect to server";
      human.icon = "api";
    }

    switch (err.response && err.response.status) {
      case 400:
        human.text = "A misunderstanding occurred, try again";
        human.code = "400 Bad Request";
        human.icon = "question-circle";
        break;
      case 401:
        human.text = "You can't access this resource";
        human.code = "401 Unauthorized";
        human.icon = "lock";
        break;
      case 403:
        human.text = "Access not permitted";
        human.code = "403 Forbidden";
        human.icon = "stop";
        break;
      case 429:
        human.text = "Try again in a few minutes";
        human.code = "429 Too Many Requests";
        human.icon = "fire";
        break;
      case 500:
        human.text = "The server encountered an error";
        human.code = "500 Internal Server Error";
        human.icon = "database";
        break;
    }
  }

  return human;
}
