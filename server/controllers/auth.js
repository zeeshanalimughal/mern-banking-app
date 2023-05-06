import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import Account from "../models/Account.js";


async function checkAccountNumberExistence(accountNumber) {
  const account = await Account.findOne({ accountNumber })
  if (account) {
    return true
  } else {
    return false
  }
}


async function generateAccountNumber() {
  const length = 10;
  let result = '';
  const digits = '0123456789';
  const digitsLength = digits.length;
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digitsLength));
  }
  // Check if the generated account number already exists in the database
  // If it does, generate a new account number until a unique one is found
  while (await checkAccountNumberExistence(result)) {
    result = generateAccountNumber();
  }
  return result;
}


export const signup = async (req, res, next) => {
  try {
    const { name, email, password, accountType, type } = req.body
    if (!name || !email || !password || !accountType || !type) {
      return res.status(400).json({ message: "all fields are required", status: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "account already exists", status: false });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name, email, type,
      password: hash
    });

    await newUser.save();

    if (type === "user") {
      const accountNumber = await generateAccountNumber()
      const account = new Account({
        accountNumber,
        accountType,
        user: newUser._id,
        checkDeposits: []
      });
      await account.save();
      return res.status(200).json({ message: "Account created successfully", accountNumber, accountBalance: 0, status: true });
    }
    return res.status(200).json({ message: "Account created successfully", status: true });

  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "all fields are required", status: false });
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "Account not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id, type: user.type, fromGoogle: user.fromGoogle }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...others, access_token: token });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id, type: user.type, fromGoogle: user.fromGoogle }, process.env.JWT);
      const { password, ...others } = user._doc;
      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ ...others, access_token: token });
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id, type: savedUser.type, fromGoogle: savedUser.fromGoogle }, process.env.JWT);

      const accountNumber = await generateAccountNumber()
      const account = new Account({
        accountNumber,
        accountType:"saving",
        user: savedUser._id,
        checkDeposits: []
      });
      await account.save();

      const { password, ...others } = savedUser._doc;

      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ ...others, access_token: token });
    }
  } catch (err) {
    next(err);
  }
};
