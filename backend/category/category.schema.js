import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    icon: {
      type: String, // e.g., "ShoppingCart"
      required: true,
    },
  },
  { timestamps: true }
);

export const CategoryTable = mongoose.model("Category", categorySchema);
