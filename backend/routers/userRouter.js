import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import pool from "../conexion.js";
import { generateToken, isAdmin, isAuth } from "../util.js";

const userRouter = express.Router();

// Para registrar
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { nombre, email, ci, ruc } = req.body;
    const password = bcrypt.hashSync(req.body.password, 8);

    const response = await pool.query(`SELECT email, ci, ruc, nombre from bs_usuario`);
    const emailArray = response.rows;

    emailArray.forEach((element) => {
      if (email === (element.email)) {
        res.status(404).send({ message: 'ya existe este correo' })
      } else
        if (ci === (element.ci)) {
          res.status(404).send({ message: 'ya existe este nro de cédula' })
        } else
          if (ruc === (element.ruc)) {
            res.status(404).send({ message: 'ya existe nro ruc' })
          }
    });

    const newUser = await pool.query(
      `INSERT INTO bs_usuario ( nombre, email, password, ruc, ci)
            VALUES ($1, $2, $3, $4, $5)`,
      [nombre, email, password, ruc, ci]
    );
    res.send({
      newUser: newUser.rows[0],
      nombre: nombre,
      email: email,
      ruc: ruc,
      ci: ci,
      token: generateToken(newUser),
    });
  })
);


// Iniciar Sesión
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const response = await pool.query(
      `SELECT * FROM bs_usuario WHERE email = '${email}' `
    );
    const user = response.rows;
    const { cod_usuario, is_admin, nombre } = user[0];
    if (user.length > 0) {
      if (bcrypt.compareSync(req.body.password, user[0].password)) {
        res.send({
          cod_usuario: cod_usuario,
          is_admin: is_admin,
          nombre: nombre,
          email: email,
          token: generateToken(user[0]),
        });
        return;
      }
    }
    res.status(401).send({ message: "Correo o contraseña incorrecta" });
  })
);

// Para listar usuarios
userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const usuarios = await pool.query("SELECT * FROM bs_usuario ");
      res.send(usuarios.rows);
    } catch (err) {
      console.error(err.message);
    }
  })
);

// Para traer un usuario por id
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await pool.query(
      "SELECT * FROM bs_usuario WHERE cod_usuario = $1",
      [id]
    );
    if (response) {
      const user = response.rows[0];
      res.send(user);
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  })
);

// Para actualizar
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, nombre, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, 8);
    const response = await pool.query(
      "SELECT * FROM bs_usuario WHERE cod_usuario = $1",
      [userId]
    );
    const user = response.rows[0];
    if (user) {
      if (req.body.password) {
        user.nombre = req.body.nombre || user.nombre;
        user.email = req.body.email || user.email;
        const usuarioActualizado = await pool.query(
          "UPDATE bs_usuario SET nombre = $1, email = $2, password = $3 WHERE cod_usuario = $4",
          [nombre, email, password, userId]
        );
        res.send({
          cod_usuario: userId,
          is_admin: user.is_admin,
          nombre: nombre,
          password: password,
          email: email,
          token: generateToken(usuarioActualizado),
        });
      } else {
        const usuarioActualizado = await pool.query(
          "UPDATE bs_usuario SET nombre = $1, email = $2, password = $3 WHERE cod_usuario = $4",
          [nombre, email, user.password, userId]
        );
        res.send({
          cod_usuario: userId,
          is_admin: user.is_admin,
          nombre: nombre,
          password: user.password,
          email: email,
          token: generateToken(usuarioActualizado),
        });
      }
    }
  })
);

// Eliminar un registro
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await pool.query(
      `SELECT * FROM bs_usuario WHERE cod_usuario = $1`,
      [id]
    );
    const user = response.rows[0];
    if (user) {
      if (user.email === "marceloalarcon29@gmail.com") {
        res
          .status(400)
          .send({ message: "No se puede Eliminar a este Administrador" });
        return;
      }
      const response2 = await pool.query(
        `DELETE FROM bs_usuario WHERE cod_usuario =$1`,
        [id]
      );
      const deleteUser = response2.rows[0];
      res.send({ message: "usuario Eliminado", user: deleteUser });
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  })
);

//API para actualizar usuario como administrador
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { cod_usuario, nombre, email, isAdmin } = req.body;
    const response = await pool.query(
      `SELECT * FROM bs_usuario WHERE cod_usuario = $1`,
      [cod_usuario]
    );
    const user = response.rows[0];
    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.email = req.body.email || user.email;
      user.is_admin = Boolean(req.body.is_admin);
      const response2 = await pool.query(
        `UPDATE bs_usuario
            SET is_admin=$1, nombre=$2, email=$3
            WHERE cod_usuario =$4`,
        [isAdmin, nombre, email, cod_usuario]
      );
      const usuarioActualizado = response2.rows[0];
      res.send({ message: "Usuario actualizado", user: usuarioActualizado });
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  })
);

export default userRouter;
