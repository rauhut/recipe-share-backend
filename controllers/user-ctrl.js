const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

handleSignin = async (req, res, bcrypt) => {
  const { authorization } = req.headers;
  const body = req.body;

  if (authorization) {
    await User.findOne(
      {
        "tokens.token": authorization,
      },
      (err, user) => {
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "Unauthorized" });
        } else {
          return res.json({ user: user._id });
        }
      }
    ).catch(console.log);
  } else {
    if (!body.email || !body.password) {
      return res
        .status(400)
        .json({ success: false, error: "incorrect form submission" });
    }

    await User.findOne({ email: body.email }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      const isValid = bcrypt.compareSync(body.password, user.password);
      if (isValid) {
        const token = jwt.sign({ _id: user._id }, "JWT_KEY");
        user.tokens = user.tokens.concat({ token });
        user.save();
        return res.status(200).json({ user: user._id, token });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "wrong credentials" });
      }
    }).catch((err) => console.log(err));
  }
};

handleRegister = async (req, res, bcrypt) => {
  const body = req.body;
  if (!body.name || !body.email || !body.password) {
    return res.status(400).json("incorrect form submission");
  }

  await User.find({ email: body.email }, (err, account) => {
    if (account.length) {
      return res.status(400).json({
        success: false,
        error: "User already exists with that email address",
      });
    }
  });

  const hash = bcrypt.hashSync(body.password);

  const user = new User({
    name: body.name,
    email: body.email,
    password: hash,
    recipes: body.recipes,
  });

  const token = jwt.sign({ _id: user._id }, "JWT_KEY");
  user.tokens = user.tokens.concat({ token });

  user
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: user._id,
        token,
        message: "User Created!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        err,
        message: "User not created!",
      });
    });
};

getProfile = async (req, res) => {
  res.send(req.user);
};

handleSignout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  handleRegister,
  handleSignin,
  getProfile,
  handleSignout,
};
