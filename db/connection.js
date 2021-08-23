const pool = require("./pool");
const logger = require("../config/logger");

exports.dbQuery = (queryText, queryParams) => {
  return new Promise((resolve, reject) => {
    pool
      .query(queryText, queryParams)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        logger.error(`From db/connection on dbQuery: ${err}`);
        reject(err);
      });
  });
};
