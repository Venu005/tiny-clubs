export const CANCELLED_AUTH_MESSAGE = "Sign-in cancelled";
export const INVALID_OTP_MESSAGE = "Code is invalid or expired";
export const OFFLINE_AUTH_MESSAGE =
  "You appear to be offline. Check your connection and try again.";
export const CALLBACK_AUTH_MESSAGE =
  "Sign-in could not be completed. Check your sign-in configuration and try again.";

function readErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }

  return null;
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return null;
}

export function getAuthErrorMessage(error: unknown) {
  const code = readErrorCode(error);
  const message = readErrorMessage(error);

  if (
    code === "SIGN_IN_CANCELLED" ||
    code === "ERR_REQUEST_CANCELED" ||
    code === "-5"
  ) {
    return CANCELLED_AUTH_MESSAGE;
  }

  if (
    code === "form_code_incorrect" ||
    code === "form_code_expired" ||
    code === "verification_expired"
  ) {
    return INVALID_OTP_MESSAGE;
  }

  if (message?.toLowerCase().includes("network request failed")) {
    return OFFLINE_AUTH_MESSAGE;
  }

  if (
    code?.toLowerCase().includes("callback") ||
    message?.toLowerCase().includes("callback") ||
    message?.toLowerCase().includes("redirect")
  ) {
    return CALLBACK_AUTH_MESSAGE;
  }

  return message ?? "Sign-in could not be completed. Please try again.";
}

