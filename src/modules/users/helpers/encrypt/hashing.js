import bcrypt from "bcrypt";

export function hashing(data, salt = 10) {
  return bcrypt.hash(data, salt);
}
