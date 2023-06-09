const db = require("../connection");

const getAllUser = async (id) => {
  try {
    const query = db`SELECT * FROM users`;
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllUser,
};
