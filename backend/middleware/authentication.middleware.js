import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserTable from "../user/user.model.js";
dotenv.config();
export const isUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided" });
    }
    const payload = jwt.verify(token, process.env.SecretKey);
    const user = await UserTable.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).send({ message: "Unauthorized: User not found" });
    }
    req.loggedInUser = user._id;
    next();
  } catch (error) {
    return res.status(404).send({ message: "Unauthorized: Invalid token" });
  }
};
