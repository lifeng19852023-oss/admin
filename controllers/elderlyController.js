const elderlyService = require('../services/elderlyService');

// 获取老人列表
async function getElderlyList(req, res) {

    // 获取分页参数
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

     // 获取搜索关键词
  const keyword = req.query.keyword || '';
  const gender = req.query.gender || '';

    // 获取年龄范围
    const minAge = req.query.minAge;
    const maxAge = req.query.maxAge;

    const sortOrder = req.sortOrder;
  
  
    // 查询数据
    const result = await elderlyService.getElderlyList(
      page,
      pageSize,
      keyword,
      gender,
      minAge,
      maxAge,
      sortOrder
    );
  
    // 计算总页数
    const totalPages = Math.ceil(
      result.total / pageSize
    );
  
    res.json({
      code: 200,
      message: '查询成功',
  
      // 当前页数据
      data: result.rows,
  
      // 分页信息
      pagination: {
        page,
        pageSize,
        total: result.total,
        totalPages
      }
    });
  }
// 新增老人
async function createElderly(req, res) {
     // req.body（获取前端发送过来的数据）
     const { name, gender, age, id_card, phone } = req.body;

     // 调用 Service（业务服务）
     const result = await elderlyService.createElderly(
       name,
       gender,
       age,
       id_card,
       phone
     );
 
     // 返回新增成功
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
     });
  }

  // 修改老人信息
async function updateElderly(req, res) {
    try {
      // req.params（获取 URL 参数）
      const { id } = req.params;
  
      // req.body（获取请求正文中的数据）
      const { name, gender, age, id_card, phone } = req.body;
  
      // 调用 Service（业务服务）
      const result = await elderlyService.updateElderly(
        id,
        name,
        gender,
        age,
        id_card,
        phone
      );
  
      // affectedRows（实际被修改的行数）
      if (result.affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '老人不存在'
        });
      }
  
      res.json({
        code: 200,
        message: '修改成功'
      });
  
    } catch (error) {
      // console.error（输出错误）
      console.error(error);
  
      res.status(500).json({
        code: 500,
        message: '修改失败'
      });
    }
  }
// 删除老人
async function deleteElderly(req, res) {
    try {
      // req.params（获取 URL 参数）
      const { id } = req.params;
  
      // 调用 Service（业务服务）
      const result = await elderlyService.deleteElderly(id);
  
      // affectedRows（实际删除的行数）
      if (result.affectedRows === 0) {
        return res.status(404).json({
          code: 404,
          message: '老人不存在'
        });
      }
  
      res.json({
        code: 200,
        message: '删除成功'
      });
  
    } catch (error) {
      // console.error（输出错误信息）
      console.error(error);
  
      res.status(500).json({
        code: 500,
        message: '删除失败'
      });
    }
  }
// 获取老人统计数据
async function getElderlyStatistics(req, res) {

    const data = await elderlyService.getElderlyStatistics();
  
    res.json({
      code: 200,
      message: '统计成功',
      data
    });
  }
module.exports = {
  getElderlyList,
  createElderly,
  updateElderly,
  deleteElderly,
  getElderlyStatistics
};