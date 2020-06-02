import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);
const database_name = 'React_pract.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;
//The typescript of SQLite plugin  shoe few errors that why now kept the file as JS only.

export default class Database {
  initDB() {
    let db;
    return new Promise((resolve) => {
      console.log('Plugin integrity check ...');
      SQLite.echoTest()
        .then(() => {
          console.log('Integrity check passed ...');
          console.log('Opening database ...');
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          )
            .then((DB) => {
              db = DB;
              console.log('Database OPEN');
              db.executeSql('SELECT * FROM userDetails')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch((error) => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                  db.transaction((tx) => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS userDetails (name,email,password)',
                    );
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS ProductList (title,quantity,discription)',
                    );
                  })
                    .then(() => {
                      console.log('Table created successfully');
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              resolve(db);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log('echoTest failed - plugin not functional');
        });
    });
  }
  closeDatabase(db) {
    if (db) {
      console.log('Closing DB');
      db.close()
        .then((status) => {
          console.log('Database CLOSED');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Database was not OPENED');
    }
  }
  getDataList(query, data) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(query, data).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              let data = [];
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                data.push(row);
              }
              resolve(data);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  insertBulk(data) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.sqlBatch(data)
            .then((result) => {
              console.log('Batch Execution was Success');
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  insertSingleRecord(query, data, keepDBOpen) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(query, data).then(([tx, results]) => {
              console.log('Data inserted successfully');
              resolve(data);
            });
          })
            .then((result) => {
              if (!keepDBOpen) this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  checkData(query, data, keepDBOpen) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(query, data).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              resolve(len > 0 ? true : false);
            });
          })
            .then((result) => {
              if (!keepDBOpen) this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
