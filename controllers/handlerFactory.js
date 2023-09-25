const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const deletedItem = await Model.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return next(res.status(404).json({ message: "Item not found" }));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return next(res.status(404).json({ message: "Item not found" }));
    }
    res.status(200).json({
      status: "success",
      data: {
        updatedItem,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    const newItem = await Model.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const item = await query;
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = (Model) => async (req, res) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const items = await features.query;

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
