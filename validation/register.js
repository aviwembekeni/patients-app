const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.userName = !isEmpty(data.userName) ? data.userName : '';
  data.fullName = !isEmpty(data.fullName) ? data.fullName : '';
  data.userType = !isEmpty(data.userType) ? data.userType : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.userName, {
      min: 2,
      max: 30
    })) {
    errors.userName = 'Username must be between 2 and 30 characters';
  }
  if (!Validator.isLength(data.fullName, {
      min: 2,
      max: 30
    })) {
    errors.userName = 'Fullname must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.userName)) {
    errors.userName = 'Username field is required';
  }

  if (Validator.isEmpty(data.fullName)) {
    errors.fullName = 'Fullname field is required';
  }

  if (!Validator.isLength(data.password, {
    min: 6,
    max: 30
  })) {
  errors.password = 'Password must be at least 6 characters';
}

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

 

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};