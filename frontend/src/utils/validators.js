/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} Object containing isValid status and validation message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

/**
 * Validates that two passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Second password
 * @returns {Object} Object containing isValid status and validation message
 */
export const passwordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Passwords do not match",
    };
  }

  return {
    isValid: true,
    message: "Passwords match",
  };
};

/**
 * Validates a required field
 * @param {string} value - Value to check
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Object containing isValid status and validation message
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      message: `${fieldName} is required`,
    };
  }

  return {
    isValid: true,
    message: `${fieldName} is valid`,
  };
};

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a number is within a range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Object} Object containing isValid status and validation message
 */
export const validateNumberRange = (value, min, max) => {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    return {
      isValid: false,
      message: "Value must be a number",
    };
  }

  if (numValue < min) {
    return {
      isValid: false,
      message: `Value must be at least ${min}`,
    };
  }

  if (numValue > max) {
    return {
      isValid: false,
      message: `Value must be at most ${max}`,
    };
  }

  return {
    isValid: true,
    message: "Value is valid",
  };
};

/**
 * Validates text length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Object containing isValid status and validation message
 */
export const validateTextLength = (text, minLength, maxLength) => {
  if (!text) {
    return {
      isValid: false,
      message: "Text is required",
    };
  }

  if (text.length < minLength) {
    return {
      isValid: false,
      message: `Text must be at least ${minLength} characters long`,
    };
  }

  if (text.length > maxLength) {
    return {
      isValid: false,
      message: `Text must be at most ${maxLength} characters long`,
    };
  }

  return {
    isValid: true,
    message: "Text is valid",
  };
};
