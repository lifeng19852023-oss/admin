
function validateCreateElderly(req, res, next) {
    const { name, gender, age, id_card, phone } = req.body
  
    // 校验姓名
    if (typeof name !== 'string' || !name.trim()) {
      const err = new Error('姓名不能为空')
      err.status = 400
      return next(err)
    }
  
    // 校验性别
    if (typeof gender !== 'string' || !gender.trim()) {
      const err = new Error('请选择性别')
      err.status = 400
      return next(err)
    }
  
    // 校验年龄
    const ageNumber = Number(age)
    if (age === '' || age === null || age === undefined ||
        !Number.isInteger(ageNumber) || ageNumber < 0 || ageNumber > 150) {
      const err = new Error('年龄必须是 0 到 150 之间的整数')
      err.status = 400
      return next(err)
    }
  
    // 校验身份证号的基本格式
    if (typeof id_card !== 'string' ||
        !/^\d{17}[\dXx]$/.test(id_card.trim())) {
      const err = new Error('身份证号格式不正确')
      err.status = 400
      return next(err)
    }
  
    // 校验手机号的基本格式
    if (typeof phone !== 'string' ||
        !/^1\d{10}$/.test(phone.trim())) {
      const err = new Error('手机号格式不正确')
      err.status = 400
      return next(err)
    }
  
    // 规范化数据，供后续控制器使用
    req.body.name = name.trim()
    req.body.gender = gender.trim()
    req.body.age = ageNumber
    req.body.id_card = id_card.trim().toUpperCase()
    req.body.phone = phone.trim()
  
    // 校验成功，交给下一个中间件或控制器
    next()
  }
  
  module.exports = {
    validateCreateElderly
  }
  