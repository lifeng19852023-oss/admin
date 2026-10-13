const admissionService = require('../services/admissionService')


// 获取入住列表
async function getAdmissionList(req,res){

  const data =
    await admissionService.getAdmissionList()

  res.json({
    code:200,
    message:'获取入住列表成功',
    data
  })

}


// 创建入住
async function createAdmission(req,res){

  const {
    elderly_id,
    bed_id
  } = req.body

  if(!elderly_id || !bed_id){

    return res.json({
      code:400,
      message:'老人和床位不能为空'
    })
  
  }


  await admissionService.createAdmission({
    elderly_id,
    bed_id
  })


  res.json({
    code:200,
    message:'入住成功'
  })

}
async function checkoutAdmission(req,res){

    const {
      id
    } = req.params
  
  
    await admissionService.checkoutAdmission(
      id
    )
  
  
    res.json({
  
      code:200,
  
      message:'退住成功'
  
    })
  
  }

module.exports = {
  getAdmissionList,
  createAdmission,
  checkoutAdmission
}