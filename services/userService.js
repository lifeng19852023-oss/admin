const db = require('../db/mysql')

// 用户登录
async function login(username, password) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM users
    WHERE username=?
    AND password=?
    `,
    [
      username,
      password
    ]
  )

  if(rows.length === 0){
    return null
  }

  const user = rows[0]

  // 查询用户角色
  const role = await getUserRole(
    user.id
  )

  // 查询用户权限
  const permissions = await getUserPermissions(
    user.id
  )

  return {
    id:user.id,
    username:user.username,
    role,
    permissions
  }
}

// 查询用户角色
async function getUserRole(userId){
  const [rows] = await db.query(
    `
    SELECT
      r.code
    FROM user_roles ur
    JOIN roles r
    ON ur.role_id=r.id
    WHERE ur.user_id=?
    `,
    [
      userId
    ]
  )

  if(rows.length === 0){
    return null
  }

  return rows[0].code
}

// 查询用户权限
async function getUserPermissions(userId){
  const [rows] = await db.query(
    `
    SELECT
      p.code
    FROM user_roles ur
    JOIN role_permissions rp
    ON ur.role_id=rp.role_id
    JOIN permissions p
    ON rp.permission_id=p.id
    WHERE ur.user_id=?
    `,
    [
      userId
    ]
  )

  return rows.map(
    item=>item.code
  )
}

// 查询所有用户
async function getUserList(){

    const [rows] = await db.query(
      `
      SELECT
        u.id,
        u.username,
        r.name AS roleName,
        r.code AS roleCode
      FROM users u
  
      LEFT JOIN user_roles ur
      ON u.id = ur.user_id
  
      LEFT JOIN roles r
      ON ur.role_id = r.id
      `
    )
  
    return rows
  }
  
  
  // 创建用户
  async function createUser(
    username,
    password,
    roleCode
  ){
  
    // 1. 创建用户
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        username,
        password
      )
      VALUES(?,?)
      `,
      [
        username,
        password
      ]
    )
  
  
    const userId = result.insertId
  
  
    // 2. 查询角色ID
    const [roles] = await db.query(
      `
      SELECT id
      FROM roles
      WHERE code=?
      `,
      [
        roleCode
      ]
    )
  
  
    if(roles.length===0){
      throw new Error(
        '角色不存在'
      )
    }
  
  
    // 3. 分配角色
    await db.query(
      `
      INSERT INTO user_roles
      (
        user_id,
        role_id
      )
      VALUES(?,?)
      `,
      [
        userId,
        roles[0].id
      ]
    )
  
  }
// 删除用户
async function deleteUser(id){

    await db.query(
      `
      DELETE FROM users
      WHERE id=?
      `,
      [
        id
      ]
    )
  
  }
// 修改用户角色
async function updateUserRole(
    userId,
    roleCode
  ){
  
    // 查询角色ID
    const [roles] =
      await db.query(
        `
        SELECT id
        FROM roles
        WHERE code=?
        `,
        [
          roleCode
        ]
      )
  
  
    if(roles.length===0){
  
      throw new Error(
        '角色不存在'
      )
  
    }
  
  
    await db.query(
      `
      UPDATE user_roles
      SET role_id=?
      WHERE user_id=?
      `,
      [
        roles[0].id,
        userId
      ]
    )
  
  }
module.exports={
  login,
  getUserPermissions,
  getUserRole,
  getUserList,
  createUser,
  deleteUser,
  updateUserRole
}