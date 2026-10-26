"use server";

import { revalidatePath } from "next/cache";
import {
  createTask as insertTask,
  updateTask as saveTask,
  deleteTask as removeTask,
} from "../lib/tasks.js";

function readTitle(formData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > 200) {
    throw new Error("El título debe tener entre 1 y 200 caracteres.");
  }
  return title;
}

function readId(formData) {
  const id = String(formData.get("id") ?? "");
  if (!/^\d+$/.test(id)) throw new Error("Identificador inválido.");
  return id;
}

export async function createTaskAction(formData) {
  const title = readTitle(formData);
  await insertTask(title);
  revalidatePath("/");
}

export async function updateTaskAction(formData) {
  const id = readId(formData);
  const title = readTitle(formData);
  const completed = formData.get("completed") === "on";
  const row = await saveTask(id, title, completed);
  if (!row) throw new Error("La tarea no existe.");
  revalidatePath("/");
}

export async function toggleTaskAction(formData) {
  const id = readId(formData);
  const title = readTitle(formData);
  const completed = formData.get("completed") === "true";
  const row = await saveTask(id, title, completed);
  if (!row) throw new Error("La tarea no existe.");
  revalidatePath("/");
}

export async function deleteTaskAction(formData) {
  const id = readId(formData);
  await removeTask(id);
  revalidatePath("/");
}
