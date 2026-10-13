const dashboardService =
require('../services/dashboardService')


// 首页统计

async function getDashboardStatistics(
  req,
  res
){

  const data =
    await dashboardService
    .getDashboardStatistics()


  res.json({

    code:200,

    message:'获取首页统计成功',

    data

  })

}


module.exports={
  getDashboardStatistics
}