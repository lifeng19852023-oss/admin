const db = require('../db/mysql');


// 获取老人分页列表
async function getElderlyList(page, pageSize, keyword, gender, minAge, maxAge, sortOrder) {
 // 计算 OFFSET（跳过多少条）
 const offset = (page - 1) * pageSize;

 // WHERE 条件
 const conditions = [];

 // SQL 参数
 const params = [];

 // 如果有关键词
 if (keyword) {
   conditions.push('name LIKE ?');
   params.push(`%${keyword}%`);
 }

 // 如果有性别
 if (gender) {
   conditions.push('gender = ?');
   params.push(gender);
 }

// 最小年龄
if (minAge !== undefined && minAge !== '') {
    conditions.push('age >= ?');
    params.push(Number(minAge));
  }
  
  // 最大年龄
  if (maxAge !== undefined && maxAge !== '') {
    conditions.push('age <= ?');
    params.push(Number(maxAge));
  }


 // 生成 WHERE
 let whereSql = '';

 if (conditions.length > 0) {
   whereSql = 'WHERE ' + conditions.join(' AND ');
 }

 // 查询数据
 const [rows] = await db.query(
   `
   SELECT *
   FROM elderly
   ${whereSql}
   ORDER BY ${sortOrder}
   LIMIT ? OFFSET ?
   `,
   [...params, pageSize, offset]
 );

 // 查询总数量
 const [countRows] = await db.query(
   `
   SELECT COUNT(*) AS total
   FROM elderly
   ${whereSql}
   `,
   params
 );

 const total = countRows[0].total;


    return {
      rows,
      total
    };
  }
// 新增老人
async function createElderly(name, gender, age, id_card, phone) {
    const [result] = await db.query(
      'INSERT INTO elderly (name, gender, age, id_card, phone) VALUES (?, ?, ?,?,?)',
      [name, gender, age, id_card, phone]
    );
  
    return result;
  }

// 修改老人信息
async function updateElderly(id, name, gender, age, id_card, phone) {
    // UPDATE（更新数据库中的数据）
    const [result] = await db.query(
      'UPDATE elderly SET name = ?, gender = ?, age = ?, id_card = ?, phone = ? WHERE id = ?',
      [name, gender, age, id_card, phone, id]
    );
  
    return result;
  }

  // 删除老人
async function deleteElderly(id) {
    // DELETE（删除数据库中的数据）
    const [result] = await db.query(
      'DELETE FROM elderly WHERE id = ?',
      [id]
    );
  
    return result;
  }

  // 获取老人统计数据
async function getElderlyStatistics() {

    // 老人总人数
    const [totalRows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM elderly
    `);
  
    // 男性人数
    const [maleRows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM elderly
      WHERE gender = '男'
    `);
  
    // 女性人数
    const [femaleRows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM elderly
      WHERE gender = '女'
    `);
  
    // 平均年龄
    const [averageAgeRows] = await db.query(`
      SELECT ROUND(AVG(age), 2) AS averageAge
      FROM elderly
    `);
  
    // 80岁以上人数
    const [over80Rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM elderly
      WHERE age >= 80
    `);

    // 年龄分布
    const [ageGroupRows] = await db.query(`
    SELECT
      CASE
        WHEN age >= 60 AND age < 70 THEN '60-69岁'
        WHEN age >= 70 AND age < 80 THEN '70-79岁'
        WHEN age >= 80 AND age < 90 THEN '80-89岁'
        WHEN age >= 90 THEN '90岁以上'
      END AS ageGroup,
      COUNT(*) AS total
    FROM elderly
    GROUP BY ageGroup
    ORDER BY ageGroup
  `);
  
    return {
      total: totalRows[0].total,
      male: maleRows[0].total,
      female: femaleRows[0].total,
      averageAge: averageAgeRows[0].averageAge,
      over80: over80Rows[0].total,
      ageGroup: ageGroupRows
    };
  }


module.exports = {
  getElderlyList,
  createElderly,
  updateElderly,
  deleteElderly,
  getElderlyStatistics
};