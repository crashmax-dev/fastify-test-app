import crypto from 'crypto'

interface VerifyPassword {
  candidatePassword: string
  salt: string
  hash: string
}

export function hashPassword(password: string): Omit<VerifyPassword, 'candidatePassword'> {
  /**
   * Creating a unique salt for a particular user
   * Salt is a random bit of data added to the user's password
   * Salt means that every password's hash is going to be unique
   */
  const salt = crypto.randomBytes(16).toString('hex')

  /**
   * Create a hash with 1000 iterations
   */
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  return { hash, salt }
}

export function verifyPassword(
  { candidatePassword, salt, hash }: VerifyPassword
): boolean {
  /**
   * Create a hash with the salt from the user and the password
   * the user tried to login with
   */
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
    .toString('hex')

  /**
   * If the hash matches the hash we have stored for the user
   * then the candidate password is correct
   */
  return candidateHash === hash
}
