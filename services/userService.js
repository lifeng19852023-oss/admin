
const db = require('../db/mysql')
const bcrypt = require('bcryptjs')

// 用户登录
async function login(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) return null

  const [rows] = await db.query(
    'SELECT id, username, password, status FROM users WHERE username = ?',
    [username]
  )
  if (rows.length === 0) return null

  const user = rows[0]
  let passwordMatched = false
  // 禁用账号不允许登录
  if (user.status !== 'active') return null


  if (typeof user.password === 'string' && /^\$2[aby]\$\d{2}\$/.test(user.password)) {
    passwordMatched = await bcrypt.compare(password, user.password)
  } else {
    // 兼容旧明文密码：验证成功后迁移为 bcrypt 哈希
    passwordMatched = user.password === password
    if (passwordMatched) {
      const hashedPassword = await bcrypt.hash(password, 12)
      await db.query(
        'UPDATE users SET password = ? WHERE id = ? AND password = ?',
        [hashedPassword, user.id, user.password]
      )
    }
  }

  if (!passwordMatched) return null

  const role = await getUserRole(user.id)
  const permissions = await getUserPermissions(user.id)
  return { id: user.id, username: user.username, role, permissions }
}

// 查询用户角色
async function getUserRole(userId) {
  const [rows] = await db.query(
    `SELECT r.code
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  )
  return rows.length ? rows[0].code : null
}
// 查询用户账号状态
async function getUserStatus(userId) {
  const [rows] = await db.query(
    'SELECT status FROM users WHERE id = ?',
    [userId]
  )
  return rows.length ? rows[0].status : null
}
// 查询用户权限
async function getUserPermissions(userId) {
  const [rows] = await db.query(
    `SELECT DISTINCT p.code
     FROM user_roles ur
     JOIN role_permissions rp ON ur.role_id = rp.role_id
     JOIN permissions p ON rp.permission_id = p.id
     WHERE ur.user_id = ?`,
    [userId]
  )
  return rows.map(item => item.code)
}

// 获取用户列表
async function getUserList() {
  const [rows] = await db.query(
    `SELECT u.id, u.username, r.name AS roleName, r.code AS roleCode
     FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id`
  )
  return rows
}

// 创建用户：使用事务保证用户与角色关联一起成功
async function createUser(username, password, roleCode) {
  if (
    typeof username !== 'string' || !username.trim() ||
    typeof password !== 'string' || password.length < 6 ||
    typeof roleCode !== 'string' || !roleCode.trim()
  ) {
    throw new Error('用户名、角色不能为空，密码至少需要 6 个字符')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const connection = await db.getConnection()
  let transactionStarted = false

  try {
    await connection.beginTransaction()
    transactionStarted = true

    const [roles] = await connection.query(
      'SELECT id FROM roles WHERE code = ?',
      [roleCode.trim()]
    )
    if (roles.length === 0) throw new Error('角色不存在')

    const [result] = await connection.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username.trim(), hashedPassword]
    )

    await connection.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [result.insertId, roles[0].id]
    )

    await connection.commit()
    transactionStarted = false
  } catch (error) {
    if (transactionStarted) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error('数据库事务回滚失败')
      }
    }
    throw error
  } finally {
    connection.release()
  }
}

// 删除用户
async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = ?', [id])
}

// 修改用户角色
async function updateUserRole(userId, roleCode) {
  const [roles] = await db.query(
    'SELECT id FROM roles WHERE code = ?',
    [roleCode]
  )
  if (roles.length === 0) throw new Error('角色不存在')

  await db.query(
    'UPDATE user_roles SET role_id = ? WHERE user_id = ?',
    [roles[0].id, userId]
  )
}
// 统计指定角色的用户数量
async function countUsersByRole(roleCode) {
  const [rows] = await db.query(
    `SELECT COUNT(DISTINCT ur.user_id) AS total
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE r.code = ?`,
    [roleCode]
  )
  return Number(rows[0].total)
}
module.exports = {
  login,
  getUserPermissions,
  getUserRole,
  getUserList,
  createUser,
  deleteUser,
  updateUserRole,
  countUsersByRole,
  getUserStatus
}
