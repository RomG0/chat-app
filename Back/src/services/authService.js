import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(ptextPass) {
  const hashPass = await bcrypt.hash(ptextPass, saltRounds);
  return hashPass;
}

export async function verifyPassword(ptextPass, storedHash) {
  const isMatch = await bcrypt.compare(ptextPass, storedHash);
  return isMatch;
}
