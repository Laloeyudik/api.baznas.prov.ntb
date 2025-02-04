import bcrypt from "bcrypt";

export function compareHash({ password, encrypt } = {}) {
  return bcrypt.compare(password, encrypt);
}
