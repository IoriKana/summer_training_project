const express = require("express");
const {
  getAllCategory,
  createCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/createCategory", createCategory);

module.exports = categoryRouter;
