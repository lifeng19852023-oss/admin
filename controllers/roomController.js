const roomService = require('../services/roomService')


// 获取房间列表
async function getRoomList(req,res){

  const rooms =
    await roomService.getRoomList()

  res.json({
    code:200,
    data:rooms
  })

}


// 获取单个房间
async function getRoomById(req,res){

  const id =
    req.params.id

  const room =
    await roomService.getRoomById(id)

  if(!room){

    return res.json({
      code:404,
      message:'房间不存在'
    })

  }

  res.json({
    code:200,
    data:room
  })

}


// 新增房间
async function createRoom(req,res){

  const id =
    await roomService.createRoom(
      req.body
    )

  res.json({
    code:200,
    message:'新增房间成功',
    data:{
      id
    }
  })

}


// 修改房间
async function updateRoom(req,res){

  const id =
    req.params.id

  await roomService.updateRoom(
    id,
    req.body
  )

  res.json({
    code:200,
    message:'修改成功'
  })

}


// 删除房间
async function deleteRoom(req,res){

  const id =
    req.params.id

  await roomService.deleteRoom(id)

  res.json({
    code:200,
    message:'删除成功'
  })

}


module.exports={
  getRoomList,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
}