const db = require('../db/mysql')

// 床位编号格式校验
function validateBedNo(bed_no) {

  if (
    typeof bed_no !== 'string' ||
    !/^[A-Za-z0-9]{1,10}$/.test(bed_no)
  ) {
    throw new Error(
      '床位编号只能使用数字和英文字母，例如：01、02、A01、B01'
    )
  }

}
// 查询床位列表
async function getBedList(){

  const [rows] = await db.query(
    `
    SELECT
      beds.id,
      beds.bed_no,
      beds.status,
      rooms.room_no,
      rooms.floor,
      rooms.type

    FROM beds

    LEFT JOIN rooms
    ON beds.room_id = rooms.id

    ORDER BY rooms.floor, rooms.room_no, beds.bed_no
    `
  )

  return rows

}



// 新增床位
async function createBed(data){

  const {
    room_id,
    bed_no
  } = data


  if(!room_id || !bed_no){

    throw new Error('房间和床号不能为空')

  }

  validateBedNo(bed_no)


  // 检查房间是否存在
  const [rooms] = await db.query(
    `
    SELECT id
    FROM rooms
    WHERE id=?
    `,
    [
      room_id
    ]
  )


  if(!rooms.length){

    throw new Error('房间不存在')

  }



  // 检查重复床号
  const [exists] = await db.query(
    `
    SELECT id
    FROM beds
    WHERE room_id=?
    AND bed_no=?
    `,
    [
      room_id,
      bed_no
    ]
  )


  if(exists.length){

    throw new Error('该房间床号已经存在')

  }



  const [result] = await db.query(
    `
    INSERT INTO beds
    (
      room_id,
      bed_no,
      status
    )
    VALUES
    (
      ?,
      ?,
      '空闲'
    )
    `,
    [
      room_id,
      bed_no
    ]
  )


  return result.insertId

}





// 修改床位
async function updateBed(id,data){


  const {
    bed_no
  } = data

  validateBedNo(bed_no)

  // 查询当前床位
  const [beds] = await db.query(
    `
    SELECT status
    FROM beds
    WHERE id=?
    `,
    [
      id
    ]
  )


  if(!beds.length){

    throw new Error('床位不存在')

  }



  await db.query(
    `
    UPDATE beds
    SET
      bed_no=?
    WHERE id=?
    `,
    [
      bed_no,
      id
    ]
  )


}





// 删除床位
async function deleteBed(id){


  // 检查是否有人入住
  const [admissions] = await db.query(
    `
    SELECT id
    FROM admissions
    WHERE bed_id=?
    AND status='入住中'
    `,
    [
      id
    ]
  )


  if(admissions.length){

    throw new Error(
      '该床位正在使用，不能删除'
    )

  }



  await db.query(
    `
    DELETE FROM beds
    WHERE id=?
    `,
    [
      id
    ]
  )

}




// 查询空闲床位
async function getFreeBeds(){

  const [rows] = await db.query(
    `
    SELECT
      beds.id,
      beds.bed_no,
      rooms.room_no

    FROM beds

    LEFT JOIN rooms
    ON beds.room_id = rooms.id

    WHERE beds.status='空闲'

    ORDER BY rooms.room_no,beds.bed_no
    `
  )


  return rows

}





module.exports = {

  getBedList,

  createBed,

  updateBed,

  deleteBed,

  getFreeBeds

}