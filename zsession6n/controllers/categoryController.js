const Category = require("../model/categoryModel");
exports.getAllCategory = async (req, res) => {
  try {
    const newCatgeory = await Category.find();
    res.status(200).json({
      message: "success",
      length: newCatgeory.length,
      data: newCatgeory,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      message: "success",
      length: newCategory.length,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};
