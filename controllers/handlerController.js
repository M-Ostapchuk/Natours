const { Model } = require('mongoose');
const AppError = require('./../utiles/appError');
const catchAsync = require('./../utiles/catchAsync');
const APIFeatures = require('./../utiles/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) {
      query.populate(populateOpt);
    }
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour(hack)
    let filter;
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    // Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const document = await features.query.explain();
    const document = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        document,
      },
    });
  });
