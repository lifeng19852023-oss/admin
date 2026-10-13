
const userService = require('../services/userService')

// 获取用户列表
async function getUserList(req, res) {
  const users = await userService.getUserList()
  res.json({ code: 200, data: users })
}

// 创建用户
async function createUser(req, res) {
  const { username, password, role } = req.body
  await userService.createUser(username, password, role)
  res.json({ code: 200, message: '创建成功' })
}

// 删除用户
async function deleteUser(req, res) {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ code: 400, message: '用户 ID 无效' })
  }

  if (Number(req.user.id) === id) {
    return res.status(400).json({ code: 400, message: '不能删除自己的账号' })
  }

  // 查询目标用户角色
  const targetRole = await userService.getUserRole(id)

  if (!targetRole) {
    return res.status(404).json({ code: 404, message: '用户不存在或未分配角色' })
  }

  // 禁止删除最后一个管理员
  if (targetRole === 'admin') {
    const adminCount = await userService.countUsersByRole('admin')

    if (adminCount <= 1) {
      return res.status(400).json({ code: 400, message: '不能删除最后一个管理员' })
    }
  }

  await userService.deleteUser(id)
  res.json({ code: 200, message: '删除成功' })
}

// 修改角色
async function updateUserRole(req, res) {
  const id = Number(req.params.id)
  const { role } = req.body

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ code: 400, message: '用户 ID 无效' })
  }

  if (typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ code: 400, message: '角色不能为空' })
  }

  await userService.updateUserRole(id, role)
  res.json({ code: 200, message: '修改成功' })
}

module.exports = {
  getUserList,
  createUser,
  deleteUser,
  updateUserRole
}
