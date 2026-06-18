const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists)
      return res
        .status(400)
        .json({ message: "User Exists" });

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registered Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User Not Found" });

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match)
      return res
        .status(400)
        .json({ message: "Wrong Password" });

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};