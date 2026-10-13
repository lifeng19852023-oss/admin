
require('dotenv').config()
const mysql = require('mysql2')

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`缺少环境变量：${key}`)
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = pool.promise()
