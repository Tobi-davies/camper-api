const path = require("path");
const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //Second commented section
  // let query;

  // //copy req.query
  // const reqQuery = { ...req.query };

  // //Fields to exclude
  // const removeFields = ["select", "sort", "page", "limit"];

  // //Looop over removeFields and delete them from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);

  // //Create query string
  // let queryStr = JSON.stringify(reqQuery);

  // //Create operators ($gt, $gte, etc)
  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );

  // //Findind resource
  // query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // //Select fields
  // if (req.query.select) {
  //   const fields = req.query.select.split(",").join(" ");
  //   query = query.select(fields);
  //   console.log(fields);
  // }

  // //sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }

  // //Pagination
  // //Note, the second parameter(10) take by parseInt is the base i.e base10?
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 25;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const total = await Bootcamp.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  // //Executing query
  // const bootcamps = await query;

  // //pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  // res.status(200).json({
  //   success: true,
  //   count: bootcamps.length,
  //   pagination,
  //   data: bootcamps,
  // });

  //First commented section
  // res.status(200).json({ success: true, msg: "Show all bootcamps" });
  // try {
  //   const bootcamps = await Bootcamp.find();

  //   res.status(200).json({
  //     success: true,
  //     count: bootcamps.length,
  //     data: bootcamps,
  //   });
  // } catch (err) {
  //   // res.status(400).json({
  //   //   success: false,
  //   // });
  //   next(err);
  // }

  res.status(200).json(res.advancedResults);
});

//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Display bootcamp ${req.params.id}` });
  // try {
  //   const bootcamp = await Bootcamp.findById(req.params.id);

  //   if (!bootcamp) {
  //     // return res.status(400).json({
  //     //   success: false,
  //     // });
  //     return next(
  //       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //     );
  //   }

  //   res.status(200).json({
  //     success: true,
  //     data: bootcamp,
  //   });
  // } catch (err) {
  //   // res.status(400).json({
  //   //   success: false,
  //   // });
  //   next(err);
  //   // next(
  //   //   new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //   // );
  // }
});

//@desc Create new bootcamp
//@route POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
  // console.log(req.body);
  // try {
  //   const bootcamp = await Bootcamp.create(req.body);

  //   res.status(201).json({
  //     success: true,
  //     data: bootcamp,
  //   });
  // } catch (err) {
  //   // res.status(400).json({ success: false });
  //   next(err);
  // }

  // res.status(200).json({ success: true, msg: "Create new bootcamps" });
});

//@desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  return res.status(200).json({ success: true, data: bootcamp });
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Update bootcamp ${req.params.id}` });

  // try {
  //   const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });

  //   if (!bootcamp) {
  //     // return res.status(400).json({ success: false });
  //     return next(
  //       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //     );
  //   }

  //   return res.status(200).json({ success: true, data: bootcamp });
  // } catch (err) {
  //   // res.status(400).json({ success: false });
  //   next(err);
  // }
});

//@desc Delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
  // res
  //   .status(200)
  //   .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
  // try {
  //   const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  //   if (!bootcamp) {
  //     // return res.status(400).json({ success: false });
  //     return next(
  //       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //     );
  //   }

  //   res.status(200).json({ success: true, data: {} });
  // } catch (err) {
  //   // res.status(400).json({ success: false });
  //   next(err);
  // }
});

//@desc Get bootcamps within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide dist by radius of Earth
  //Earth Radius = 3,663 miles / 6,378km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc Upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 404));
  }

  // console.log(req.files.file);
  const file = req.files.file;

  //Make sure the image is a photot
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  //Create custome filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
