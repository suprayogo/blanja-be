const model = require("../models/product.models");
const db = require("../connection");

async function getProduct(req, res) {
  try {
    let query;
    let keyword = `%${req?.query?.keyword}%`;
    let category = `%${req?.query?.category}%`;
    let sort = db`DESC`;
    let isPaginate =
      req?.query?.page &&
      !isNaN(req?.query?.page) &&
      parseInt(req?.query?.page) >= 1;

    if (req?.query?.sortType?.toLowerCase() === "asc") {
      if (isPaginate) {
        sort = db`ASC LIMIT 15 OFFSET ${15 * (parseInt(req?.query?.page) - 1)}`;
      } else {
        sort = db`ASC`;
      }
    }

    if (isPaginate && !req?.query?.sortType) {
      sort = db`DESC LIMIT 15 OFFSET ${15 * (parseInt(req?.query?.page) - 1)}`;
    }

    // ketika memasukkan keyword
    if (req?.query?.keyword && req?.query?.category) {
      query = await model.getProductByKeywordCategory(keyword, category, sort);
      // ketika memasukkan category
    } else if (req?.query?.category) {
      query = await model.getProductByCategory(category, sort);
      // ketika memasukkan keyword dan kategory maka data yang muncul adalah dari keyword dan category
    } else if (req?.query?.keyword) {
      query = await model.getProductByKeyword(keyword, sort);
    } else {
      query = await model.getProductBySort(sort);
    }

    console.log(query);

    res.json({
      status: query?.length ? true : false,
      message: query?.length ? "Get data success" : "Data not found",
      total: query?.length ?? 0,
      pages: isPaginate
        ? {
            current: parseInt(req?.query?.page),
            total: query?.[0]?.full_count
              ? Math.ceil(parseInt(query?.[0]?.full_count) / 15)
              : 0,
          }
        : null,
      data: query?.map((item) => {
        delete item.full_count;
        return item;
      }),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

async function getProductById(req, res) {
  try {
    const {
      params: { id },
    } = req;

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: "ID must be integer",
      });
      return;
    }

    const query = await model.getProductById(id);

    if (!query.length) {
      res.status(404).json({
        status: false,
        message: "Data not found",
      });
      return;
    }

    res.json({
      status: true,
      message: "Get data success",
      data: query,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error not found",
    });
  }
}

async function getCategory(req, res) {
  try {
    const data = await model.getCategory();

    res.send({
      status: true,
      message: "Success get data",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getProduct,
  getProductById,
  getCategory,
};
