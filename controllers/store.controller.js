const queries = require("../db/queries");
const dbConnection = require("../db/connection");
const logger = require("../config/logger");
const util = require("../util/utility");
const { storeValidation, checkId } = require("../models/store.model");

exports.getStoresList = async (req, res) => {
  try {
    let storesListQuery = queries.queryList.getStoresListQuery;
    let result = await dbConnection.dbQuery(storesListQuery);
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (err) {
    logger.error(`From store.controller on getStoreList : ${err}`);
    return res.status(500).send({ error: "Faild to get store list" });
  }
};

exports.getStoreDetails = async (req, res) => {
  try {
    let storeId = req.params.storeId;

    let getStoreDetailsQuery = queries.queryList.getStoreDetailsQuery;
    let result = await dbConnection.dbQuery(getStoreDetailsQuery, [storeId]);
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Store with this id: ${storeId} not found` });
    }

    return res.status(200).send(JSON.stringify(result.rows));
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

    let validationError = await storeValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }
    let storeCode = util.getStoreCode();

    let values = [storeName, storeCode, storeAddress, createdBy, createdOn];
    let insertStoreQuery = queries.queryList.insertStoreQuery;
    await dbConnection.dbQuery(insertStoreQuery, values);
    return res.status(200).send("store created successfully");
  } catch (err) {
    logger.error(`From store.controller on insertStore : ${err}`);
    return res.status(500).send({ error: "Faild to save store" });
  }
};

exports.updateStore = async (req, res) => {
  try {
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

    let checkIdResult = await checkId(storeId);
    if (!checkIdResult) {
      return res.status(404).send({ error: `Store id: ${storeId} not found` });
    }

    let values = [storeName, createdBy, storeAddress, storeId];
    let updateStoreQuery = queries.queryList.updateStoreQuery;
    await dbConnection.dbQuery(updateStoreQuery, values);
    return res.status(200).send("store updated successfully");
  } catch (err) {
    logger.error(`From store.controller on updateStore : ${err}`);
    return res.status(500).send({ error: "Faild to update store" });
  }
};

exports.getStoreBooks = async (req, res) => {
  try {
    let storeId = req.params.storeId;

    let checkStoreIdQuery = queries.queryList.checkStoreIdQuery;
    let result1 = await dbConnection.dbQuery(checkStoreIdQuery, [storeId]);
    if (result1.rows[0].count == 0) {
      return res.status(404).send({ error: `Store id: ${storeId} not found` });
    }

    let getStoreBooksQuery = queries.queryList.getStoreBooksQuery;
    let result = await dbConnection.dbQuery(getStoreBooksQuery, [storeId]);
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (err) {
    logger.error(`From store.controller on getStoreBooks : ${err}`);
    return res.status(500).send({ error: "Faild to get store Books" });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    let storeId = req.params.storeId;
    //check that store exist
    let getStoreDetailsQuery = queries.queryList.getStoreDetailsQuery;
    let result = await dbConnection.dbQuery(getStoreDetailsQuery, [storeId]);
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Store with this id: ${storeId} not found` });
    }
    //delete books with the storecode
    let storeCode = result.rows[0].store_code;
    let deleteBooksByStoreCodeQuery =
      queries.queryList.deleteBooksByStoreCodeQuery;
    dbConnection.dbQuery(deleteBooksByStoreCodeQuery, [storeCode]);
    //delete store
    let deleteStoreByIdQuery = queries.queryList.deleteStoreByIdQuery;
    dbConnection.dbQuery(deleteStoreByIdQuery, [storeId]);
    return res
      .status(200)
      .send(`Store with the ID: ${storeId} deleted successfully`);
  } catch (err) {
    logger.error(`From store.controller on deleteStore : ${err}`);
    return res.status(500).send({ error: "Faild to get delete store" });
  }
};
