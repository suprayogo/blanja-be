const db = require("../connection");

const checkEmailRoles = async (user_email, role_id) => {
  try {
    const query = db`SELECT * FROM users WHERE LOWER(user_email) = LOWER(${user_email}) AND roles_id = ${role_id}`;
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  checkEmailRoles,
};
