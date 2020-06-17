const validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = function validateProfileInput(data) {
  let errors = {};
  data.handle = isEmpty(data.handle) ? "" : data.handle;
  data.skills = isEmpty(data.skills) ? "" : data.skills;
  data.status = isEmpty(data.status) ? "" : data.status;

  if (validator.isEmpty(data.handle)) {
    errors.handle = "User handle required";
  }
  if (validator.isEmpty(data.status)) {
    errors.status = "Status required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills required";
  }
  /*
  if (!validator.isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!validator.isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }
  if (!validator.isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }
  if (!validator.isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }
  if (!validator.isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }
  if (!validator.isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }*/

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
