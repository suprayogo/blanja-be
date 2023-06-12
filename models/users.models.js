const db = require("../connection");

const getAllUser = async (id) => {
  try {
    const query = db`SELECT * FROM users`;
    return query;
  } catch (error) {
    return error;
  }
};

const getProfileById = async (user_id) => {
  try {
    const query = await db`SELECT * FROM users WHERE user_id = ${user_id}`;
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
      "user_name",
      "user_password",
      "user_email",
      "user_phonenumber",
      "roles_id"
    )} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const editProfile = async (payload, user_id) => {
  try {
    const query = await db`UPDATE users SET ${db(
      payload,
      "user_name",
      "user_password",
      "user_email",
      "user_phonenumber",
      "gender",
      "date_of_birth"
    )} WHERE user_id = ${user_id} returning *`;
    return query;
  } catch (error) {
    return error;
  }
};

const deleteProfile = async (user_id) => {
  try {
    const query = await db`DELETE FROM users WHERE user_id = ${user_id}`;
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
