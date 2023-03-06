import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json({ error: null, data: users });
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password tidak sama.", data: null });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({ error: null, data: email });
  } catch (error) {
    console.error(error);
  }
};

export const login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
      return res.status(400).json({ error: "Wrong password", data: null });
    }
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ error: null, data: accessToken });
  } catch (error) {
    res.status(404).json({ error: "Email tidak ditemukan.", data: null });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) {
      return res.sendStatus(204);
    }
    await Users.update(
      {
        refresh_token: null,
      },
      { where: { id: user.id } }
    );
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
};
