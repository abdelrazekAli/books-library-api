const util = require("../util/utility");
const logger = require("../config/logger");
const { dbQuery } = require("../db/connection");
const queries = require("../db/queries").queryList;
const { storeValidation, checkId } = require("../models/store.model");

exports.getStoresList = async (req, res) => {
  try {
    let { getStoresListQuery } = queries;
    let result = await dbQuery(getStoresListQuery);
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From store.controller on getStoreList : ${err}`);
    return res.status(500).send({ error: "Faild to get store list" });
  }
};

exports.getStoreDetails = async (req, res) => {
  try {
    let storeId = req.params.storeId;

    // Check store id
    let { getStoreDetailsQuery } = queries;
    let result = await dbQuery(getStoreDetailsQuery, [storeId]);
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Store with this id: ${storeId} not found` });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From store.controller on getStoredetails : ${err}`);
    return res.status(500).send({ error: "Faild to get store details" });
  }
};

exports.insertStore = async (req, res) => {
  try {
    let createdBy = "admin";
    let createdOn = new Date();
    let { storeName, storeAddress } = req.body;

    // Check validation errors
    let validationError = await storeValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Generate random store code
    let storeCode = util.getStoreCode();

    let values = [storeName, storeCode, storeAddress, createdBy, createdOn];
    let { insertStoreQuery } = queries;
    await dbQuery(insertStoreQuery, values);
    return res.status(200).send("store created successfully");
  } catch (err) {
    logger.error(`From store.controller on insertStore : ${err}`);
    return res.status(500).send({ error: "Faild to save store" });
  }
};

exports.updateStore = async (req, res) => {
  try {
    // Check validation errors
    let validationError = await storeValidation(req.body);
    if (validationError) {
      return res.status(500).send(validationError.details[0].message);
    }

    let { storeName, createdBy, storeAddress, storeId } = req.body;

    if (!createdBy || !storeId) {
      return res
        .status(500)
        .send({ error: "Store createdBy and id is required" });
    }

    // Check store id
    let checkIdResult = await checkId(storeId);
    if (!checkIdResult) {
      return res.status(404).send({ error: `Store id: ${storeId} not found` });
    }

    // Update store
    let values = [storeName, createdBy, storeAddress, storeId];
    let { updateStoreQuery } = queries;
    await dbQuery(updateStoreQuery, values);
    return res.status(200).send("store updated successfully");
  } catch (err) {
    logger.error(`From store.controller on updateStore : ${err}`);
    return res.status(500).send({ error: "Faild to update store" });
  }
};

exports.getStoreBooks = async (req, res) => {
  try {
    let { storeId } = req.params;

    // Check store id
    let checkIdResult = await checkId(storeId);
    if (!checkIdResult) {
      return res.status(404).send({ error: `Store id: ${storeId} not found` });
    }

    let { getStoreBooksQuery } = queries;
    let result = await dbQuery(getStoreBooksQuery, [storeId]);
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From store.controller on getStoreBooks : ${err}`);
    return res.status(500).send({ error: "Faild to get store Books" });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    let { storeId } = req.params;

    // Check store id
    let { getStoreDetailsQuery } = queries;
    let result = await dbQuery(getStoreDetailsQuery, [storeId]);
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Store with this id: ${storeId} not found` });
    }

    // Delete books with store code
    let storeCode = result.rows[0].store_code;
    let { deleteBooksByStoreCodeQuery } = queries;
    dbQuery(deleteBooksByStoreCodeQuery, [storeCode]);

    // Delete store
    let { deleteStoreByIdQuery } = queries;
    dbQuery(deleteStoreByIdQuery, [storeId]);
    return res
      .status(200)
      .send(`Store with the ID: ${storeId} deleted successfully`);
  } catch (err) {
    logger.error(`From store.controller on deleteStore : ${err}`);
    return res.status(500).send({ error: "Faild to get delete store" });
  }
};
