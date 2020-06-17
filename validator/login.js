const validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
