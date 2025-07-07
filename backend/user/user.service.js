import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserTable from "./user.model.js";
import jwt from "jsonwebtoken";
dotenv.config();
export const registerController = async (req, res) => {
  let newUser = req.body;
  const exists = await UserTable.findOne({ email: newUser.email });
  if (exists) {
    return res.status(404).send({ message: "User already Exists" });
  }
  const saltRounds = Number(process.env.ROUNDS);
  console.log(saltRounds);
  const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
  newUser = { ...newUser, password: hashedPassword };
  console.log(newUser);
  await UserTable.create(newUser);
  res.status(200).send({ message: "Register Successful" });
};
export const loginController = async (req, res) => {
  let loginCredentials = req.body;
  const user = await UserTable.findOne({ email: loginCredentials.email });
  if (!user) {
    res.status(400).send({ message: "Invalid Credentials" });
  }
  const match = await bcrypt.compare(loginCredentials.password, user.password);
  if (!match) {
    res.status(400).send({ message: "Invalid Credentials" });
  }
  const payload = { email: user.email };
  const secretKey = process.env.SECRETKEY;
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "7d",
  });
  user.password = undefined;
  res
    .status(200)
    .send({ message: "Login Successful", accessToken: token, details: user });
};
