const db = require("../connection");
const jwt = require("jsonwebtoken");

async function getProductReview(req, res) {
  try {
    let query;
    let review = `${req?.query?.review}`;
    let sort = db`DESC`;
    let isPaginate =
      req?.query?.page &&
      !isNaN(req?.query?.page) &&
      parseInt(req?.query?.page) >= 1;

    console.log(review);

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

    if (req?.query?.review) {
      query =
        await db`SELECT product.product_name, product.category, product.price, product.color,
      product.size, product.condition, product.date_created, review.score
      FROM product JOIN review ON product.id = review.product_id
      WHERE review.score = ${review} ORDER BY "date_created" ${sort}`;
    } else {
      query =
        await db`SELECT product.product_name, product.category, product.price, product.color,
        product.size, product.condition, product.date_created, review.score
        FROM product JOIN review ON product.id = review.product_id ORDER BY "date_created" ${sort}`;
    }

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
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

module.exports = {
  getProductReview,
};
