const Joi = require("joi");
const queries = require("../db/queries").queryList;
const { dbQuery } = require("../db/connection");

exports.Store = class Store {
  constructor(storeId, storeName, storeCode, storeAddress) {
    (this.storeId = storeId),
      (this.storeName = storeName),
      (this.storeCode = storeCode),
      (this.storeAddress = storeAddress);
  }
};

// Store validation
exports.storeValidation = async (data) => {
  const schema = Joi.object({
    storeId: Joi.number().integer(),
    storeName: Joi.string().min(2).max(100).required(),
    storeAddress: Joi.string().min(2).max(200).required(),
    createdBy: Joi.string().max(50),
  });
  return schema.validate(data).error;
};

// Check store id
exports.checkId = async (id) => {
  let { checkStoreIdQuery } = queries;
  let result = await dbQuery(checkStoreIdQuery, [id]);
  if (result.rows[0].count == 0) return false;
  return true;
};
