const db = require("../connection");
const axios = require("axios");

const jwt = require("jsonwebtoken");
const midtransClient = require("midtrans-client");

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
    if (!checkData.length) {
      return res.status(400).json({
        status: false,
        message: "Product not availabe",
      });
    }
    // const productSize =
    //   await db`SELECT * FROM product WHERE product_id = ${product_id} AND product_size LIKE ${`%${product_size}%`}`;
    // if (!productSize.length) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Product size not found",
    //   });
    // }

    // const productColor =
    //   await db`SELECT * FROM product WHERE product_id = ${product_id} AND product_color LIKE ${`%${product_color}%`}`;
    // if (!productColor.length) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Product color not found",
    //   });
    // }

    get_product =
      await db`SELECT * FROM product WHERE product_id = ${product_id}`;

    get_address =
      await db`SELECT address.address_id FROM address WHERE user_id = ${id}`;

    const seller_id = get_product[0]?.seller_id;
    const address_id = get_address[0]?.address_id;
    const productPrice = get_product[0]?.product_price;

    const shipping_price = 20000;

    const totalPrice = productPrice * total_product + shipping_price;

    const payload = {
      product_id,
      product_size,
      product_color,
      user_id: id,
      total_product,
      shipping_price: shipping_price,
      seller_id: seller_id,
      address_id: address_id? address_id: null,
      total_price: totalPrice,
    };

    data = await db`INSERT INTO product_order ${db(
      payload,
      "product_id",
      "total_product",
      "user_id",
      "seller_id",
      "product_size",
      "product_color",
      "total_price",
      "address_id",
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
      message: error.message,
    });
  }
}

async function createPayment(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.user_id;

    get_customer = await db`SELECT * FROM users WHERE user_id = ${id}`;

    get_order = await db`SELECT * FROM product_order WHERE user_id = ${id}`;

    get_price =
      await db`SELECT SUM(CAST(product_order.total_price AS NUMERIC)) as total_price_sum 
      FROM product_order WHERE user_id = ${id}`;

    totalPayment = get_price[0].total_price_sum;

    const payload = {
      user_id: id,
      total_payment: totalPayment,
    };

    data = await db`INSERT INTO payment ${db(
      payload,
      "user_id",
      "total_payment"
    )} returning *`;

    get_payment_id =
      await db`SELECT payment.payment_id FROM payment WHERE user_id= ${id}`;
    getPaymentId = get_payment_id[0].payment_id;

    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.SERVER_KEY,
    });
    let parameter = {
      transaction_details: {
        order_id: getPaymentId,
        gross_amount: totalPayment,
      },
      customer_details: {
        first_name: get_customer[0].user_name,
        email: get_customer[0].user_email,
        phone: get_customer[0].user_phonenumber,
      },
    };

    snap.createTransaction(parameter).then(async (transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      // console.log("transactionToken:", transactionToken);
      const payload = {
        transaction_token: transactionToken,
      };

      data = await db`UPDATE payment SET ${db(
        payload,
        "transaction_token"
      )} returning *`;

      res.send({
        status: true,
        message: "Success Create payment",
        token: transactionToken,
      });
      
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function checkStatus(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.user_id;
    paymentId =
      await db`SELECT payment.payment_id FROM payment WHERE user_id = ${id}`;
    payment_id = paymentId[0].payment_id;
    const url = `https://api.sandbox.midtrans.com/v2/${payment_id}/status`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.SERVER_KEY + ":"
        ).toString("base64")}`,
      },
    });

    payment_status = response.data.status_message;

    const payload = {
      status: payment_status,
    };

    data = await db`UPDATE payment SET ${db(payload, "status")} returning *`;

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order status" });
  }
}

module.exports = {
  createOrder,
  createPayment,
  checkStatus,
};
