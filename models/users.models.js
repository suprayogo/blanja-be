const db = require("../connection");

const getAllUser = async (id) => {
  try {
    const query = db`SELECT * FROM users`;
    return query;
  } catch (error) {
    return error;
  }
};

const getProfileById = async (id) => {
  try {
    const query = await db`SELECT * FROM users WHERE id = ${id}`;
    return query;
  } catch (error) {
    return error;
  }
};

const getProfileByEmail = async (email) => {
  try {
    const query =
      await db`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
    console.log(query);
    return query;
  } catch (error) {
    return error;
  }
};

const insertProfile = async (payload) => {
  try {
    const query = await db`INSERT INTO users ${db(
      payload,
      "email",
      "full_name",
      "phone_number",
      "password"
    )} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const editProfile = async (payload, id) => {
  try {
    const query = await db`UPDATE users SET ${db(
      payload,
      "email",
      "full_name",
      "phone_number",
      "password"
    )} WHERE id = ${id} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const deleteProfile = async (id) => {
  try {
    const query = await db`DELETE FROM users WHERE id = ${id} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};
module.exports = {
  getAllUser,
  getProfileById,
  getProfileByEmail,
  insertProfile,
  editProfile,
  deleteProfile,
};
