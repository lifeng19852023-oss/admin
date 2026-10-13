const bedService = require('../services/bedService')


// 获取床位列表
async function getBedList(req,res){

  const data =
    await bedService.getBedList()

  res.json({
    code:200,
    message:'获取床位成功',
    data
  })

}
// 创建床位
async function createBed(req,res){

    const id =
      await bedService.createBed(
        req.body
      )
  
  
    res.json({
      code:200,
      message:'创建床位成功',
      data:{
        id
      }
    })
  
  }
// 修改床位
async function updateBed(req,res){

    const id =
      req.params.id
  
  
    await bedService.updateBed(
      id,
      req.body
    )
  
  
    res.json({
      code:200,
      message:'修改床位成功'
    })
  
  }
  // 删除床位
async function deleteBed(req,res){

    const id =
      req.params.id
  
  
    await bedService.deleteBed(id)
  
  
    res.json({
      code:200,
      message:'删除床位成功'
    })
  
  }

module.exports = {

  getBedList,
  createBed,
  updateBed,
  deleteBed

}