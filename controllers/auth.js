const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // //create token
  // const token = user.getSignedJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
  sendTokenResponse(user, 200, res);
});

//@desc Login
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // //create token
  // const token = user.getSignedJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
  sendTokenResponse(user, 200, res);
});

//@desc Get current logged in user
//@route POST /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(req.user);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Forgot Password
//@route POST /api/v1/auth/forgotpassword
//@access Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // console.log(req.user);

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken();

  // console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
