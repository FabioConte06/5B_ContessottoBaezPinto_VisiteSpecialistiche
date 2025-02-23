const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl = {
   ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject();
         }
         console.log('done');
         resolve(result);
      });
   })
}

const database = {
   createTable: async () => {
      await executeQuery(`
         CREATE TABLE IF NOT EXISTS accident (
         id INT PRIMARY KEY AUTO_INCREMENT,
         address varchar(255) NOT NULL,
         date DATE NOT NULL,
         time TIME NOT NULL,
         injured int NOT NULL,
         dead int NOT NULL)             
      `);
      return await executeQuery(`
         CREATE TABLE IF NOT EXISTS plates (
            id INT PRIMARY KEY AUTO_INCREMENT,
            plate VARCHAR(20) NOT NULL,
            idAccident INT NOT NULL,
            FOREIGN KEY (idAccident) REFERENCES accident(id) ON DELETE CASCADE)      
      `);
   },
   insert: async (accident) => {
      let sql = `
         INSERT INTO accident(address, date, time, injured, dead)
         VALUES (
            '${accident.address}', 
            '${accident.date}', 
            '${accident.time}', 
            ${accident.injured}, 
            ${accident.dead})
           `;
      const result = await executeQuery(sql);
      accident.plates.forEach(async (element) => {
         sql = `
            INSERT INTO plates(plate, idAccident) 
            VALUES (
               '${element}', 
               ${result.insertId})
         `;
         await executeQuery(sql);
      });
   },
   delete: (id) => {
      let sql = `
        DELETE FROM accident
        WHERE id=${id}
           `;
      return executeQuery(sql);
   },
   select: async () => {
      let sql = `
        SELECT id, address, date, time, injured, dead FROM accident 
           `;
      const result = await executeQuery(sql);
      await Promise.all(result.map(async (accident) => {
         sql = `
            SELECT plate FROM plates WHERE idAccident=${accident.id} 
           `;
         const list = await executeQuery(sql);
         accident.plates = list.map(p => p.plate);
      }));
      return result;
   },
   drop: async () => {
      let sql = `
            DROP TABLE IF EXISTS plates
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS accident
           `;
      await executeQuery(sql);
   }
}

module.exports = database;