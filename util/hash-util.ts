import crypto from 'crypto'

export const md5 = (str: string) => {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export const sha256 = (str: string) => {
  const hash = crypto.createHash('sha256')
  hash.update(str)
  return hash.digest('hex')
}
