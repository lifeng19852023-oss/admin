const db = require('../db/mysql')
async function getAdmissionList(){

    const [rows] = await db.query(
      `
      SELECT
        admissions.id,
        elderly.name AS elderly_name,
        rooms.room_no,
        beds.bed_no,
        admissions.check_in,
        admissions.check_out,
        admissions.status
  
      FROM admissions
  
      LEFT JOIN elderly
      ON admissions.elderly_id = elderly.id
  
      LEFT JOIN beds
      ON admissions.bed_id = beds.id
  
      LEFT JOIN rooms
      ON beds.room_id = rooms.id
  
      ORDER BY admissions.id DESC
      `
    )
  
    return rows
  }

  async function createAdmission(data){

    const {
      elderly_id,
      bed_id
    } = data
  
  
    const connection =
      await db.getConnection()
  
  
    try{
  
      await connection.beginTransaction()
  
  
      await connection.query(
        `
        INSERT INTO admissions
        (
          elderly_id,
          bed_id,
          check_in
        )
        VALUES
        (
          ?,
          ?,
          CURDATE()
        )
        `,
        [
          elderly_id,
          bed_id
        ]
      )
  
  
      await connection.query(
        `
        UPDATE beds
        SET status='入住中'
        WHERE id=?
        `,
        [
          bed_id
        ]
      )
  
  
      await connection.commit()
  
  
    }catch(error){
  
      await connection.rollback()
  
      throw error
  
    }finally{
  
      connection.release()
  
    }
  
  }
  async function checkoutAdmission(id){

    const connection =
      await db.getConnection()
  
    try{
  
      await connection.beginTransaction()
  
      const [rows] =
        await connection.query(
          `
          SELECT bed_id
          FROM admissions
          WHERE id=?
          `,
          [
            id
          ]
        )
  
  
      if(rows.length===0){
  
        throw new Error(
          '入住记录不存在'
        )
  
      }
  
  
      const bedId =
        rows[0].bed_id
  
  
      // 修改入住状态
  
      await connection.query(
        `
        UPDATE admissions
        SET
        status='已退住',
        check_out=CURDATE()
  
        WHERE id=?
        `,
        [
          id
        ]
      )
  
  
      // 恢复床位状态
  
      await connection.query(
        `
        UPDATE beds
        SET status='空闲'
  
        WHERE id=?
        `,
        [
          bedId
        ]
      )
  
  
      await connection.commit()
  
  
    }catch(error){
  
      await connection.rollback()
  
      throw error
  
    }finally{
  
      connection.release()
  
    }
  
  }
  module.exports = {

    getAdmissionList,
    createAdmission,
    checkoutAdmission
  }