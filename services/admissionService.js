const db = require('../db/mysql')


// 创建入住记录
async function createAdmission(data) {

  const {
    elderly_id,
    bed_id,
    check_in
  } = data


  if (!elderly_id || !bed_id) {
    throw new Error('老人和床位不能为空')
  }


  const connection = await db.getConnection()

  try {

    await connection.beginTransaction()


    // 检查老人是否已经入住
    const [oldAdmissions] = await connection.query(
      `
      SELECT id
      FROM admissions
      WHERE elderly_id = ?
      AND status = '入住中'
      `,
      [
        elderly_id
      ]
    )


    if (oldAdmissions.length > 0) {
      throw new Error('该老人已经入住')
    }



    // 锁定床位，防止多人同时选择
    const [beds] = await connection.query(
      `
      SELECT id,status
      FROM beds
      WHERE id = ?
      FOR UPDATE
      `,
      [
        bed_id
      ]
    )


    if (beds.length === 0) {
      throw new Error('床位不存在')
    }



    const bed = beds[0]


    if (bed.status !== '空闲') {
      throw new Error('该床位不可入住')
    }



    // 创建入住记录
    const [result] = await connection.query(
      `
      INSERT INTO admissions
      (
        elderly_id,
        bed_id,
        check_in,
        status
      )
      VALUES
      (
        ?,
        ?,
        ?,
        '入住中'
      )
      `,
      [
        elderly_id,
        bed_id,
        check_in || new Date()
      ]
    )



    // 修改床位状态
    await connection.query(
      `
      UPDATE beds
      SET status = '入住中'
      WHERE id = ?
      `,
      [
        bed_id
      ]
    )



    await connection.commit()


    return result.insertId



  } catch (error) {


    await connection.rollback()

    throw error


  } finally {


    connection.release()

  }

}





// 办理退住
async function checkoutAdmission(id) {


  const connection = await db.getConnection()


  try {


    await connection.beginTransaction()



    const [rows] = await connection.query(
      `
      SELECT bed_id,status
      FROM admissions
      WHERE id = ?
      `,
      [
        id
      ]
    )



    if (rows.length === 0) {
      throw new Error('入住记录不存在')
    }



    const admission = rows[0]



    if (admission.status !== '入住中') {
      throw new Error('该入住已经结束')
    }




    // 修改入住状态

    await connection.query(
      `
      UPDATE admissions
      SET
        status = '已退住',
        check_out = NOW()
      WHERE id = ?
      `,
      [
        id
      ]
    )



    // 释放床位

    await connection.query(
      `
      UPDATE beds
      SET status = '空闲'
      WHERE id = ?
      `,
      [
        admission.bed_id
      ]
    )



    await connection.commit()



  } catch(error) {


    await connection.rollback()

    throw error


  } finally {


    connection.release()

  }

}





// 查询入住列表
async function getAdmissionList() {


  const [rows] = await db.query(
    `
    SELECT
      a.id,
      a.elderly_id,
      a.bed_id,
      a.check_in,
      a.check_out,
      a.status,

      e.name AS elderly_name,

      r.room_no,

      b.bed_no

    FROM admissions a

    LEFT JOIN elderly e
      ON a.elderly_id = e.id

    LEFT JOIN beds b
      ON a.bed_id = b.id

    LEFT JOIN rooms r
      ON b.room_id = r.id

    ORDER BY a.id DESC
    `
  )


  return rows

}





module.exports = {

  createAdmission,

  checkoutAdmission,

  getAdmissionList

}