// models/Student.js
import { pool } from "../config/postgres.js";

export default class Student {
  constructor({ id, name, age, studentClass }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.studentClass = studentClass;
  }

  static async findAll() {
    const result = await pool.query("SELECT * FROM students");
    return result.rows.map(row => new Student({
      id: row.id,
      name: row.name,
      age: row.age,
      studentClass: row.class
    }));
  }

  static async create({ name, age, studentClass }) {
    const result = await pool.query(
      "INSERT INTO students(name,age,class) VALUES ($1,$2,$3) RETURNING *",
      [name, age, studentClass]
    );
    return new Student(result.rows[0]);
  }

  async update() {
    await pool.query(
      "UPDATE students SET name=$1, age=$2, class=$3 WHERE id=$4",
      [this.name, this.age, this.studentClass, this.id]
    );
    return this;
  }

  async delete() {
    await pool.query("DELETE FROM students WHERE id=$1", [this.id]);
  }
}
