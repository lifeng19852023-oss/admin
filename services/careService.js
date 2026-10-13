const db = require('../db/mysql')


// 查询护理记录

async function getCareList(){

  const [rows] =
    await db.query(
      `
      SELECT

      care_records.id,

      elderly.name AS elderly_name,

      care_records.care_type,

      care_records.care_date,

      care_records.content


      FROM care_records


      LEFT JOIN elderly

      ON care_records.elderly_id = elderly.id


      ORDER BY care_records.id DESC

      `
    )


  return rows

}
async function createCare(data){

    const {
  
      elderly_id,
  
      care_type,
  
      care_date,
  
      content
  
    } = data
  
  
    const [result] =
      await db.query(
        `
        INSERT INTO care_records
  
        (
  
        elderly_id,
  
        care_type,
  
        care_date,
  
        content
  
        )
  
  
        VALUES
  
        (?,?,?,?)
  
        `,
        [
  
          elderly_id,
  
          care_type,
  
          care_date,
  
          content
  
        ]
  
      )
  
  
    return result.insertId
  
  }
  module.exports={

    getCareList,
  
    createCare
  
  }