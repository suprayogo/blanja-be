const { query } = require("express");
const db = require("../connection");

const getAllProduct = async () => {
  query = db`SELECT * FROM product`;
};

const getProductByKeyword = async (keyword, sort) => {
  try {
    const query =
      await db`SELECT *, count(*) OVER() as full_count FROM product WHERE LOWER(product.product_name) ILIKE LOWER(${keyword}) ORDER BY "date_created" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};

const getProductByReview = async () => {
  try {
    const query =
      await db`SELECT COALESCE(ROUND(AVG(product_review.review_score),1),0) AS score, product.* 
      FROM product LEFT JOIN product_review ON product_review.product_id = product.product_id 
      GROUP BY product.product_id ORDER BY score DESC`;
    return query;
  } catch (error) {
    return error;
  }
};
const getProductByCategory = async (category, sort) => {
  try {
    const query =
      await db`SELECT *, count(*) OVER() as full_count FROM product WHERE LOWER(product.product_category) ILIKE LOWER(${category}) ORDER BY "date_created" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};
const getProductByKeywordCategory = async (keyword, category, sort) => {
  try {
    const query = await db`SELECT *, count(*) OVER() as full_count FROM product 
      WHERE LOWER(product.product_name) ILIKE LOWER(${keyword}) AND 
      LOWER(product.product_category) LIKE LOWER(${category}) 
      ORDER BY "date_created" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};
const getProductBySort = async (sort) => {
  try {
    const query =
      await db`SELECT *, count(*) OVER() as full_count FROM product ORDER BY "date_created" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};
const getProductById = async (id) => {
  try {
    const query = await db`SELECT * FROM product WHERE product_id = ${id}`;
    return query;
  } catch (error) {
    return error;
  }
};
const getCategory = async () => {
  try {
    const query = await db`SELECT DISTINCT product_category FROM product`;
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllProduct,
  getProductByKeyword,
  getProductByKeywordCategory,
  getProductByReview,
  getProductBySort,
  getProductByCategory,
  getProductById,
  getCategory,
};
