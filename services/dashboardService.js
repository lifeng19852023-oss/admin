const db = require('../db/mysql')


async function getDashboardStatistics(){

  // 老人统计
  const [elderlyRows] =
    await db.query(
      `
      SELECT
      COUNT(*) AS total,
      SUM(gender='男') AS male,
      SUM(gender='女') AS female,
      ROUND(AVG(age),2) AS averageAge
      FROM elderly
      `
    )


  // 入住统计
  const [admissionRows] =
    await db.query(
      `
      SELECT
      COUNT(*) AS current
      FROM admissions
      WHERE status='入住中'
      `
    )


  // 床位统计
  const [bedRows] =
  await db.query(
    `
    SELECT

    COUNT(*) AS total,

    SUM(status='空闲') AS empty_count,

    SUM(status='入住中') AS used_count

    FROM beds
    `
  )


  // 今日护理
  const [careRows] =
    await db.query(
      `
      SELECT
      COUNT(*) AS today

      FROM care_records

      WHERE care_date=CURDATE()
      `
    )


  // 年龄分布

  const [ageRows] =
    await db.query(
      `
      SELECT

      CASE

      WHEN age <70 THEN '60-69岁'

      WHEN age <80 THEN '70-79岁'

      WHEN age <90 THEN '80-89岁'

      ELSE '90岁以上'

      END AS ageGroup,

      COUNT(*) AS total


      FROM elderly

      GROUP BY ageGroup

      `
    )


  // 护理趋势

  const [careTrendRows] =
    await db.query(
      `
      SELECT

      DATE_FORMAT(
        care_date,
        '%m-%d'
      ) AS date,

      COUNT(*) AS total


      FROM care_records

      WHERE care_date >= DATE_SUB(
        CURDATE(),
        INTERVAL 6 DAY
      )


      GROUP BY care_date

      ORDER BY care_date

      `
    )


  return {

    elderly:{

      total:
      elderlyRows[0].total,

      male:
      elderlyRows[0].male || 0,

      female:
      elderlyRows[0].female || 0,

      averageAge:
      elderlyRows[0].averageAge

    },


    admission:{

      current:
      admissionRows[0].current

    },


    bed:{
      total:
      bedRows[0].total,
    
      empty:
      bedRows[0].empty_count || 0,
    
      used:
      bedRows[0].used_count || 0
    },


    care:{

      today:
      careRows[0].today,

      trend:
      careTrendRows

    },


    ageGroup:
    ageRows

  }

}


module.exports={

 getDashboardStatistics

}