const careService =
require('../services/careService')


// 获取护理记录

async function getCareList(req,res){

  const data =
    await careService.getCareList()

  res.json({

    code:200,

    message:'获取护理记录成功',

    data

  })

}


// 新增护理记录

async function createCare(req,res){

  const {

    elderly_id,

    care_type,

    care_date,

    content

  } = req.body


  if(
    !elderly_id ||
    !care_type ||
    !care_date
  ){

    return res.json({

      code:400,

      message:'参数不能为空'

    })

  }


  await careService.createCare({

    elderly_id,

    care_type,

    care_date,

    content

  })


  res.json({

    code:200,

    message:'新增护理记录成功'

  })

}


module.exports={

  getCareList,

  createCare

}