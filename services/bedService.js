const db = require('../db/mysql')


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


  const [result] =
    await db.query(
      `
      INSERT INTO beds
      (
        room_id,
        bed_no
      )
      VALUES
      (
        ?,
        ?
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
    bed_no,
    status
  } = data

  await db.query(
    `
    UPDATE beds
    SET
      bed_no=?,
      status=?
    WHERE id=?
    `,
    [
      bed_no,
      status,
      id
    ]
  )

}
// 删除床位
async function deleteBed(id){

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
module.exports = {

  getBedList,
  createBed,
  updateBed,
  deleteBed

}