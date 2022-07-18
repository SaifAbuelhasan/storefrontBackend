import client from "../database";
import bcrypt from "bcrypt";
// dotenv
import dotenv from "dotenv";
dotenv.config();

// get salt rounds and pepper from .env
const saltRounds = Number(process.env.SALT_ROUNDS);
const pepper = process.env.PEPPER;

// user type
export type User = {
  id?: number; // id is optional because it will be set by the database (return value contains id but parameter doesn't)
  firstName: string;
  lastName: string;
  password: string;
};

// user model
export class UserModel {
  /**
   * Get all users from database
   * @returns {Promise<User[]>} array of all users
   */
  static async index(): Promise<User[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM users";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get users from database ${error}`);
    }
  }

  /**
   * Get user by id from database
   * @param id user id
   * @returns {Promise<User>} user object
   */
  static async get(id: number): Promise<User> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM users WHERE id = $1";
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get user from database ${error}`);
    }
  }

  /**
   * add new user to database
   * @param user User object
   * @returns created user object
   */
  static async create(user: User): Promise<User> {
    try {
      const connection = await client.connect();
      const sql =
        "INSERT INTO users (firstName, lastName, password) VALUES ($1, $2, $3) RETURNING *";

      // hash password
      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);

      const result = await connection.query(sql, [
        user.firstName,
        user.lastName,
        hash,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create user in database ${error}`);
    }
  }

  /**
   * login user with firstName and password
   * @param firstName first name of user
   * @param password
   * @returns {Promise<User | null>} user object if login was successful, null otherwise
   */
  static async authenticate(
    firstName: string,
    password: string
  ): Promise<User | null> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM users WHERE firstName = $1";
      const result = await connection.query(sql, [firstName]);
      connection.release();
      if (result.rows.length !== 0) {
        // compare password
        const isValid = bcrypt.compareSync(
          password + pepper,
          result.rows[0].password
        );
        if (isValid) {
          return result.rows[0];
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to authenticate user in database ${error}`);
    }
  }
}
