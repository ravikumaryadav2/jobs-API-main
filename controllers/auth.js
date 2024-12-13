const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // we can use the below lines of code in the schema present in user.js

  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // const tempUser = { name, email, password: hashedPassword };

  // if (!name && !email && !password) {
  //   throw new BadRequestError(
  //     "Please Provide a valid name, an e-mail and a password !"
  //   );
  // } else if (!name) {
  //   throw new BadRequestError("Please Provide a name !");
  // } else if (!email) {
  //   throw new BadRequestError("Please Provide an E-mail !");
  // } else if (!password) {
  //   throw new BadRequestError("Please Provide a Password !");
  // }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name , id: user.id }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide E-mail and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
