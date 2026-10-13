// 老人数据校验中间件
function validateElderly(req, res, next) {

    // req.body（获取前端提交的数据）
    const { name, gender, age, id_card, phone } = req.body;
  
    // 检查姓名
    if (!name || name.trim() === '') {
      return res.status(400).json({
        code: 400,
        message: '姓名不能为空'
      });
    }
  
    // 检查性别
    if (gender !== '男' && gender !== '女') {
      return res.status(400).json({
        code: 400,
        message: '性别只能是男或女'
      });
    }
  
    // 检查年龄
    if (!Number.isInteger(age)) {
      return res.status(400).json({
        code: 400,
        message: '年龄必须是整数'
      });
    }
  
    // 检查年龄范围
    if (age < 0 || age > 120) {
      return res.status(400).json({
        code: 400,
        message: '年龄必须在0到120之间'
      });
    }
    if(!id_card){
      return res.status(400).json({
        code:400,
        message:'身份证不能为空'
      })
    }
    if(!phone){
      return res.status(400).json({
        code:400,
        message:'手机号不能为空'
      })
    }
  
    // next（继续执行后面的处理）
    next();
  }
  
  module.exports = validateElderly;