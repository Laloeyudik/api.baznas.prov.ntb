import crypto from "crypto";

export function generateOneTimeToken() {
  return crypto.randomBytes(32).toString("base64url");
}
