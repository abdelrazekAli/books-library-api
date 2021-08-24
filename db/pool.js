const { Pool } = require("pg");

const db_config = {
  connectionString: process.env.DATABASE_URL,
  // number of milliseconds to wait before timing out when connecting a new client
  connectionTimeoutMillis: 3000,
  // number of milliseconds a client must sit idle in the pool and not be checked out
  idleTimeoutMillis: 200,
  // maximum number of clients the pool should contain
  max: 20,
};

let pool = new Pool(db_config);
pool.on("connect", () => {
  console.log("databases connected");
});

pool.on("remove", () => {
  console.log("database connection removed");
});
module.exports = pool;
