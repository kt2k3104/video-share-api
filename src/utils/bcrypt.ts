import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function compare(payload: string, hash: string) {
  return bcrypt.compareSync(payload, hash);
}
