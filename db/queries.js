exports.queryList = {
  getBooksListQuery: `SELECT book_id, book_title, book_author, book_category, book_img, store_code
	                    FROM bms.book;`,

  insertBookQuery: `INSERT INTO bms.book(
                    book_title, book_description, book_author, book_publisher, book_pages, book_category, book_price, book_img, store_code, created_on, created_by)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,

  getBookDetailsQuery: `SELECT book_id, book_title,book_description , book_author, book_pages, book_price, book_img, book_category, book.store_code, store_id, store_name, store_address
                        From bms.book , bms.store
                        WHERE book.store_code = store.store_code and book_id =$1`,

  getBooksByCategoryQuery: `SELECT book_id, book_title,book_description , book_author, book_pages, book_price, book_img, book_category, book.store_code, store_id, store_name, store_address
                            From bms.book , bms.store
                            WHERE book.store_code = store.store_code and book_category =$1`,

  updateBookQuery: `UPDATE bms.book
                   SET book_title=$1, book_description=$2, book_author=$3, book_publisher=$4, book_pages=$5, book_category=$6, book_price=$7, book_img=$8, store_code=$9, created_by=$10
                   WHERE book_id=$11;`,

  deleteBookByIdQuery: `DELETE FROM bms.book WHERE book_id=$1;`,

  deleteBooksByStoreCodeQuery: `DELETE FROM bms.book WHERE store_code= $1;`,

  checkBookIdQuery: `SELECT COUNT( book_id ) FROM bms.book
                     WHERE book_id = $1;`,

  getStoresListQuery: `SELECT store_id, store_name, store_code FROM bms.store;`,

  checkStoreCodeQuery: `SELECT COUNT( store_id ) FROM bms.store
                                          WHERE store_code = $1;`,

  insertStoreQuery: `INSERT INTO bms.store(store_name, store_code, store_address , created_by, created_on)
                     VALUES ($1, $2, $3, $4, $5);`,

  updateStoreQuery: `UPDATE bms.store SET  store_name=$1, created_by=$2, store_address=$3
                    WHERE store_id = $4;`,

  checkStoreIdQuery: `SELECT COUNT( store_id ) FROM bms.store
                     WHERE store_id = $1;`,

  getStoreDetailsQuery: `SELECT store_id, store_code, store_name, store_address, created_by, created_on
                         From bms.store
                         WHERE store_id =$1`,

  getStoreBooksQuery: `SELECT store.store_code, store_id, store_name, store_address, book_id, book_title, book_description , book_author, book_pages, book_price, book_img, book_category, book.created_by, book.created_on
                      From bms.book , bms.store
                      WHERE book.store_code = store.store_code and store_id =$1`,

  deleteStoreByIdQuery: `DELETE FROM bms.store WHERE store_id= $1`,

  checkUsernameQuery: `SELECT COUNT( user_id ) FROM bms.user
                      WHERE username= $1;`,

  checkEmailQuery: `SELECT COUNT( user_id ) FROM bms.user
                      WHERE email= $1;`,

  insertUserQuery: `INSERT INTO bms.user(username, email, password, full_name, age, is_admin)
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,

  getUserByIdQuery: `SELECT user_id, username, email, full_name, user_img, age, is_admin
                    FROM bms.user WHERE user_id = $1`,

  updateUserQuery: `UPDATE bms.user 
                    SET username= $1, email=$2, full_name=$3, user_img=$4, age=$5 
                    WHERE user_id=$6`,

  getUsersListQuery: `SELECT user_id, username, email, full_name, user_img, age, is_admin
                      FROM bms.user`,

  getUserByEmailQuery: `SELECT user_id, username, email, password, is_admin
                       FROM bms.user WHERE email = $1`,
};
