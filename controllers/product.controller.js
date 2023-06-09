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

    if (req?.query?.keyword) {
      query = await model.getProductByKeyword(keyword, sort);
    } else if (req?.query?.category) {
      query = await model.getProductByCategory(category, sort);
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

module.exports = {
  getProduct,
};
