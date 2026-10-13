const userService = require('../services/userService')

// 获取用户列表
async function getUserList(req,res){
  const users = await userService.getUserList()
  res.json({
    code:200,
    data:users
  })
}

// 创建用户
async function createUser(req,res){
  const {
    username,
    password,
    role
  } = req.body
  await userService.createUser(
    username,
    password,
    role
  )
  res.json({
    code:200,
    message:'创建成功'
  })
}
// 删除用户
async function deleteUser(req,res){
    const id = req.params.id
      // 防止删除自己的账号
      if(
        req.user.id === id
      ){
    
        return res.json({
          code:400,
          message:'不能删除自己的账号'
        })
    
      }
    await userService.deleteUser(id)
    res.json({
      code:200,
      message:'删除成功'
    })
  }

  // 修改角色
async function updateUserRole(req,res){

    const id =
      Number(req.params.id)
  
    const {
      role
    } = req.body
  
  
    await userService.updateUserRole(
      id,
      role
    )
  
  
    res.json({
      code:200,
      message:'修改成功'
    })
  
  }
module.exports={
  getUserList,
  createUser,
  deleteUser,
  updateUserRole
}