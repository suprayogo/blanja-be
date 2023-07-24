const db = require("../connection");

const insertAddress = async (payload) => {
  try {
    const query = db`INSERT INTO address ${db(
      payload,
      "address_name",
      "recipient_name",
      "recipient_phone_number",
      "address_data",
      "postal_code",
      "city",
      "user_id"
    )} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const getAddress = async (user_id) => {
  try {
    const query = db`SELECT * FROM address WHERE address.user_id = ${user_id}`;
    return query;
  } catch (error) {
    return error;
  }
};

const editAddress = async (payload, adds_id, user_id) => {
  try {
    const query = db`UPDATE address SET ${db(
      payload,
      "address_name",
      "recipient_name",
      "recipient_phone_number",
      "address_data",
      "postal_code",
      "city"
    )} WHERE address_id = ${adds_id} AND user_id =  ${user_id}  returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const deleteAddress = async (adds_id, user_id) => {
  try {
    const query =
      await db`DELETE FROM address WHERE address_id = ${adds_id} AND user_id = ${user_id} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const getAddressById = async (adds_id) => {
  try {
    const query = db`SELECT * FROM address WHERE address_id = ${adds_id}`;
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  insertAddress,
  getAddress,
  editAddress,
  deleteAddress,
  getAddressById,
};
