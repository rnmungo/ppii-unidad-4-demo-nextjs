import "server-only";
import pool from "./db.js";

export async function getTasks() {
  const result = await pool.query(
    `SELECT id, title, completed, created_at
     FROM tasks ORDER BY created_at DESC, id DESC`
  );
  return result.rows;
}

export async function createTask(title) {
  const result = await pool.query(
    `INSERT INTO tasks (title) VALUES ($1)
     RETURNING id, title, completed, created_at`,
    [title]
  );
  return result.rows[0];
}

export async function updateTask(id, title, completed) {
  const result = await pool.query(
    `UPDATE tasks SET title = $1, completed = $2
     WHERE id = $3
     RETURNING id, title, completed, created_at`,
    [title, completed, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteTask(id) {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rowCount === 1;
}
