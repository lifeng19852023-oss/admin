
const elderlyService = require('../services/elderlyService')

// 获取老人列表
async function getElderlyList(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10))
  const keyword = req.query.keyword || ''
  const gender = req.query.gender || ''
  const minAge = req.query.minAge
  const maxAge = req.query.maxAge
  const sortOrder = req.sortOrder

  const result = await elderlyService.getElderlyList(
    page, pageSize, keyword, gender, minAge, maxAge, sortOrder
  )
  const totalPages = Math.ceil(result.total / pageSize)

  res.json({
    code: 200,
    message: '查询成功',
    data: {
      list: result.rows,
      pagination: {
        page,
        pageSize,
        total: result.total,
        totalPages
      }
    }
  })
}

// 新增老人


async function createElderly(req, res) {
  const { name, gender, age, id_card, phone } = req.body

  try {
    const result = await elderlyService.createElderly(
      name, gender, age, id_card, phone
    )

    res.json({
      code: 200,
      message: '新增成功',
      data: {
        id: result.insertId,
        name,
        gender,
        age,
        id_card,
        phone
      }
    })
  } catch (error) {
    // MySQL 重复键错误
    if (error.code === 'ER_DUP_ENTRY') {
      const err = new Error('该身份证号已登记，请勿重复添加')
      err.status = 409
      throw err
    }

    // 其他异常交给统一错误处理中间件
    throw error
  }
}


// 修改老人
async function updateElderly(req, res) {
  const { id } = req.params
  const { name, gender, age, id_card, phone } = req.body
  const result = await elderlyService.updateElderly(id, name, gender, age, id_card, phone)

  if (result.affectedRows === 0) {
    return res.status(404).json({ code: 404, message: '老人不存在' })
  }

  res.json({ code: 200, message: '修改成功' })
}

// 删除老人
async function deleteElderly(req, res) {
  const { id } = req.params
  const result = await elderlyService.deleteElderly(id)

  if (result.affectedRows === 0) {
    return res.status(404).json({ code: 404, message: '老人不存在' })
  }

  res.json({ code: 200, message: '删除成功' })
}

// 获取老人统计数据
async function getElderlyStatistics(req, res) {
  const data = await elderlyService.getElderlyStatistics()
  res.json({ code: 200, message: '统计成功', data })
}

module.exports = {
  getElderlyList,
  createElderly,
  updateElderly,
  deleteElderly,
  getElderlyStatistics
}