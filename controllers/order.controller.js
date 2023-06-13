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
    // product yang diklik
    let product_id = `${req?.query?.product_id}`;

    //yang yang dipilih
    let product_size = `${req?.query?.product_size}`.toLowerCase(); // convert to lowercase
    //color yang dipilih
    let product_color = `${req?.query?.product_color}`.toLowerCase(); // convert to lowercase
    let total_product = `${req?.query?.total_product}`;

    // ngecek size yang dipilih ada apa engga
    const productSize =
      await db`SELECT * FROM product WHERE product_id = ${product_id} AND LOWER(product_size) LIKE ${`%${product_size}%`}`; // convert to lowercase
    if (!productSize.length) {
      return res.status(400).json({
        status: false,
        message: "Product size not found",
      });
    }
    // ngecek warna yang dipilih ada engga
    const productColor =
      await db`SELECT * FROM product WHERE product_id = ${product_id} AND LOWER(product_color) LIKE ${`%${product_color}%`}`; // convert to lowercase
    if (!productColor.length) {
      return res.status(400).json({
        status: false,
        message: "Product color not found",
      });
    }

    get_product =
      await db`SELECT * FROM product WHERE product_id = ${product_id}`;

    console.log(get_product);

    get_address =
      await db`SELECT address.address_id FROM address WHERE user_id = ${id}`;

    get_address =
      await db`SELECT address.address_id FROM address WHERE user_id = ${id}`;

    const address_ids = get_address.map((address) => address.address_id);

    const seller_id = get_product[0].seller_id;
    const shipping_price = 50000;
    const product_price = get_product[0].product_price;
    const total_price = product_price * total_product + shipping_price;

    const payload = {
      product_id,
      product_size,
      product_color,
      user_id: id,
      total_product,
      seller_id: seller_id,
      address_id: address_ids.join(", "),
      total_price: total_price,
      shipping_price: shipping_price,
    };

    data = await db`INSERT INTO product_order ${db(
      payload,
      "product_id",
      "total_product",
      "user_id",
      "seller_id",
      "product_size",
      "product_color",
      "address_id",
      "total_price",
      "shipping_price"
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
