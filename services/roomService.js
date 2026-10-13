const db = require('../db/mysql')

// 查询房间列表
async function getRoomList(){

  const [rows] = await db.query(
    `
    SELECT *
    FROM rooms
    ORDER BY id DESC
    `
  )

  return rows
}


// 根据ID查询房间
async function getRoomById(id){

  const [rows] = await db.query(
    `
    SELECT *
    FROM rooms
    WHERE id=?
    `,
    [
      id
    ]
  )

  return rows[0]

}


// 新增房间
async function createRoom(data){

  const {
    room_no,
    floor,
    type
  } = data


  const [result] = await db.query(
    `
    INSERT INTO rooms
    (
      room_no,
      floor,
      type
    )
    VALUES
    (
      ?,
      ?,
      ?
    )
    `,
    [
      room_no,
      floor,
      type
    ]
  )


  return result.insertId

}


// 修改房间
async function updateRoom(
  id,
  data
){

  const {
    room_no,
    floor,
    type,
    status
  } = data


  await db.query(
    `
    UPDATE rooms
    SET
      room_no=?,
      floor=?,
      type=?,
      status=?
    WHERE id=?
    `,
    [
      room_no,
      floor,
      type,
      status,
      id
    ]
  )

}


// 删除房间
async function deleteRoom(id){

  await db.query(
    `
    DELETE FROM rooms
    WHERE id=?
    `,
    [
      id
    ]
  )

}


module.exports={
  getRoomList,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
}