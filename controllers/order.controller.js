const db = require("../connection");

const jwt = require("jsonwebtoken");

function getToken(req) {
  const token = req?.headers?.authorization?.slice(
    7,
    req?.headers?.authorization?.length
  );
  return token;
}

async function createOrder(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.user_id;

    let product_id = `${req?.query?.product_id}`;
    let product_size = `${req?.query?.product_size}`;
    let product_color = `${req?.query?.product_color}`;
    let total_product = `${req?.query?.total_product}`;

    const checkData =
      await db`SELECT product.product_size FROM product WHERE product_id = ${product_id}`;
    console.log(checkData);
    // Check if the inputted product_size is available in the product data
    const productSize =
      await db`SELECT * FROM product WHERE product_id = ${product_id} AND product_size LIKE ${`%${product_size}%`}`;
    if (!productSize.length) {
      return res.status(400).json({
        status: false,
        message: "Product size not found",
      });
    }

    const productColor =
      await db`SELECT * FROM product WHERE product_id = ${product_id} AND product_size LIKE ${`%${product_color}%`}`;
    if (!productColor.length) {
      return res.status(400).json({
        status: false,
        message: "Product color not found",
      });
    }

    get_product =
      await db`SELECT * FROM product WHERE product_id = ${product_id}`;

    get_address =
      await db`SELECT address.address_id FROM address WHERE user_id = ${id}`;

    seller_id = get_product[0].seller_id;
    address_id = get_address[0].address_id;

    const payload = {
      product_id,
      product_size,
      product_color,
      user_id: id,
      total_product,
      seller_id: seller_id,
      address_id: address_id,
    };

    data = await db`INSERT INTO product_order ${db(
      payload,
      "product_id",
      "total_product",
      "user_id",
      "seller_id",
      "product_size",
      "product_color",
      "address_id"
    )} returning *`;

    res.json({
      status: true,
      message: "Get data success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Error not found",
    });
  }
}

module.exports = {
  createOrder,
};
