import { errorHandler, successHandler } from '#utils/api-handler.js';
import {
  loginUserValidation,
  signupValidation,
} from '#validations/user.validation.js';
import { formatValidationError } from '#utils/format.js';
import db from '#config/db.js';
import { comparePassword, hashPassword } from '#utils/hash-password.js';
import { jwtToken } from '#utils/jwt.js';

export const signUp = async (req, res) => {
  try {
    const validationResult = signupValidation.safeParse(req.body);

    if (!validationResult.success) {
      return errorHandler({
        req,
        res,
        statusCode: 400,
        message: 'Validation failed',
        error: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return errorHandler({
        req,
        res,
        message: 'User already exists',
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    return successHandler({
      res,
      message: 'User created successfully',
      data: {
        user,
      },
    });
  } catch (e) {
    errorHandler({ req, res });
  }
};

export const login = async (req, res) => {
  try {
    const validationResult = loginUserValidation.safeParse(req.body);

    if (!validationResult.success) {
      return errorHandler({
        req,
        res,
        statusCode: 400,
        message: 'Validation failed',
        error: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return errorHandler({
        req,
        res,
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return errorHandler({
        req,
        res,
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const token = jwtToken.sign({ id: user.id, email: user.email });

    return successHandler({
      res,
      message: 'Signed in successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (e) {
    errorHandler({ req, res });
  }
};
