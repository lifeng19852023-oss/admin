const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})

const secret = process.env.JWT_SECRET
const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

if (!secret) {
  throw new Error('缺少 JWT_SECRET 环境变量，请检查 backend/.env')
}

module.exports = {
  secret,
  expiresIn
}