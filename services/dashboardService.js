
const db = require('../db/mysql')

// 获取首页统计数据
async function getDashboardStatistics() {
  // 1. 老人总数、男女数量、平均年龄
  const [elderlyRows] = await db.query(`
    SELECT
      COUNT(*) AS total,
      SUM(gender = '男') AS male,
      SUM(gender = '女') AS female,
      ROUND(AVG(age), 2) AS averageAge
    FROM elderly
  `)

  // 2. 当前入住人数
  const [admissionRows] = await db.query(`
    SELECT COUNT(*) AS current
    FROM admissions
    WHERE status = '入住中'
  `)

  // 3. 床位总数、空闲床位、已使用床位
  const [bedRows] = await db.query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = '空闲') AS empty_count,
      SUM(status = '入住中') AS used_count
    FROM beds
  `)

  // 4. 今日护理记录数量
  const [careRows] = await db.query(`
    SELECT COUNT(*) AS today
    FROM care_records
    WHERE care_date >= CURDATE()
      AND care_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
  `)

  // 5. 老人年龄分布
  const [ageRows] = await db.query(`
    SELECT
      CASE
        WHEN age IS NULL THEN '未知'
        WHEN age < 60 THEN '60岁以下'
        WHEN age < 70 THEN '60-69岁'
        WHEN age < 80 THEN '70-79岁'
        WHEN age < 90 THEN '80-89岁'
        ELSE '90岁以上'
      END AS ageGroup,
      COUNT(*) AS total
    FROM elderly
    GROUP BY ageGroup
    ORDER BY FIELD(
      ageGroup,
      '60岁以下',
      '60-69岁',
      '70-79岁',
      '80-89岁',
      '90岁以上',
      '未知'
    )
  `)

  // 6. 近7天护理趋势：没有记录的日期也显示0
  const [careTrendRows] = await db.query(`
    SELECT
      DATE_FORMAT(d.day, '%m-%d') AS date,
      COALESCE(c.total, 0) AS total
    FROM (
      SELECT CURDATE() AS day
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY)
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY)
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY)
      UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    ) AS d
    LEFT JOIN (
      SELECT
        DATE(care_date) AS day,
        COUNT(*) AS total
      FROM care_records
      WHERE care_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND care_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      GROUP BY DATE(care_date)
    ) AS c ON c.day = d.day
    ORDER BY d.day
  `)

  // 7. 统一整理返回数据
  return {
    elderly: {
      total: elderlyRows[0].total,
      male: elderlyRows[0].male || 0,
      female: elderlyRows[0].female || 0,
      averageAge: elderlyRows[0].averageAge
    },
    admission: {
      current: admissionRows[0].current
    },
    bed: {
      total: bedRows[0].total,
      empty: bedRows[0].empty_count || 0,
      used: bedRows[0].used_count || 0
    },
    care: {
      today: careRows[0].today,
      trend: careTrendRows
    },
    ageGroup: ageRows
  }
}

module.exports = {
  getDashboardStatistics
}
