/* eslint-disable no-useless-escape */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .pattern(/^[a-zA-Z\s]+$/, "lettersAndSpacesOnly")
      .required()
      .messages({
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty",
        "string.min": "Full name should have a minimum length of {#limit}",
        "string.max": "Full name should have a maximum length of {#limit}",
        "string.trim": "Full name cannot have leading or trailing spaces",
        "string.pattern.lettersAndSpacesOnly":
          "Full name can only contain letters and spaces",
        "string.strict": "Full name must be a string",
      }),
    email: Joi.string().trim().strict().email().required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "string.trim": "Email cannot have leading or trailing spaces",
      "string.strict": "Email must be a string",
    }),
    password: Joi.string()
      .min(8)
      .max(128)
      .trim()
      .strict()
      .pattern(/[a-z]/, "lowercase")
      .pattern(/[A-Z]/, "uppercase")
      .pattern(/\d/, "digit")
      .pattern(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?~\\]/, "specialCharacter")
      .required()
      .messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password should have a minimum length of {#limit}",
        "string.max": "Password should have a maximum length of {#limit}",
        "string.trim": "Password cannot have leading or trailing spaces",
        "string.pattern.lowercase":
          "Password must contain at least one lowercase letter",
        "string.pattern.uppercase":
          "Password must contain at least one uppercase letter",
        "string.pattern.digit": "Password must contain at least one digit",
        "string.pattern.specialCharacter":
          "Password must contain at least one special character",
        "string.strict": "Password must be a string",
      }),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
};

const address = async (req, res, next) => {
  const schema = Joi.object({
    recipientName: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .pattern(/^[a-zA-Z\s]+$/, "lettersAndSpacesOnly")
      .required()
      .messages({
        "any.required": "Recipient name is required",
        "string.empty": "Recipient name cannot be empty",
        "string.min": "Recipient name should have a minimum length of {#limit}",
        "string.max": "Recipient name should have a maximum length of {#limit}",
        "string.trim": "Recipient name cannot have leading or trailing spaces",
        "string.pattern.lettersAndSpacesOnly":
          "Recipient name can only contain letters and spaces",
        "string.strict": "Recipient name must be a string",
      }),
    phone: Joi.string()
      .trim()
      .strict()
      .pattern(/^0\d{9,10}$/, "validVietnamPhone")
      .required()
      .messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number cannot be empty",
        "string.trim": "Phone number cannot have leading or trailing spaces",
        "string.pattern.validVietnamPhone":
          "Phone number must be a valid Vietnamese phone number starting with 0 and followed by 9 or 10 digits",
        "string.strict": "Phone number must be a string",
      }),
    city: Joi.string().min(2).max(50).trim().strict().required().messages({
      "any.required": "City is required",
      "string.empty": "City cannot be empty",
      "string.min": "City should have a minimum length of {#limit}",
      "string.max": "City should have a maximum length of {#limit}",
      "string.trim": "City cannot have leading or trailing spaces",
      "string.strict": "City must be a string",
    }),
    district: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .optional()
      .allow("")
      .messages({
        "string.empty": "District cannot be empty",
        "string.min": "District should have a minimum length of {#limit}",
        "string.max": "District should have a maximum length of {#limit}",
        "string.trim": "District cannot have leading or trailing spaces",
        "string.strict": "District must be a string",
      }),
    ward: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .optional()
      .allow("")
      .messages({
        "string.empty": "Ward cannot be empty",
        "string.min": "Ward should have a minimum length of {#limit}",
        "string.max": "Ward should have a maximum length of {#limit}",
        "string.trim": "Ward cannot have leading or trailing spaces",
        "string.strict": "Ward must be a string",
      }),
    street: Joi.string().min(2).max(100).trim().strict().required().messages({
      "any.required": "Street is required",
      "string.empty": "Street cannot be empty",
      "string.min": "Street should have a minimum length of {#limit}",
      "string.max": "Street should have a maximum length of {#limit}",
      "string.trim": "Street cannot have leading or trailing spaces",
      "string.strict": "Street must be a string",
    }),
    isDefault: Joi.boolean().optional().messages({
      "boolean.base": "isDefault must be a boolean",
    }),
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
};

export const userValidation = {
  createNew,
  address,
};

/**
 * Usage example:
 * Router.route("/register").post(userValidation.createNew, userController.register);
 */
