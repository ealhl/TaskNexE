const db = require("./../datasbase");

//Get all tasks
const getAllTasks = () => {
  return db
    .query("SELECT * FROM tasks;")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log("err", err.message);
      throw err;
    });
};

//Get tasks by user id
const getTasksByUserId = (userId) => {
  return db
    .query("SELECT * FROM tasks WHERE userId = $1;", [userId])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log("err", err.message);
      throw err;
    });
};

//Get task by id
const getTaskById = (id) => {
  return db
    .query("SELECT * FROM tasks WHERE id = $1;", [id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

//Create a new task
const createTask = (task) => {
  return db
    .query(
      "INSERT INTO tasks(title, short_desc, details, submitted_by, submitted_at, status, due_date, priority, last_updated, task_type, amount, userid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;",
      [
        task.title,
        task.short_desc,
        task.details,
        task.submitted_by,
        task.submitted_at || new Date(), // Use current date if not provided
        task.status,
        task.due_date,
        task.priority,
        task.last_updated || new Date(), // Use current date if not provided
        task.task_type,
        task.amount,
        task.userid,
      ]
    )
    .then((data) => {
      return data.rows[0].id;
    })
    .catch((err) => {
      console.error("Database error:", err);
      throw err;
    });
};

//Update a task
const updateTask = (id, task) => {
  return db
    .query(
      "UPDATE tasks SET title = $1, short_desc = $2, details = $3, submitted_by = $4, submitted_at = $5, status = $6, due_date = $7, priority = $8, last_updated = $9, userid = $10, task_type = $11,amount = $12 WHERE id = $13 RETURNING id;",
      [
        task.title,
        task.short_desc,
        task.details,
        task.submitted_by,
        task.submitted_at,
        task.status,
        task.due_date,
        task.priority,
        task.last_updated,
        task.userid,
        task.task_type,
        task.amount,
        id,
      ]
    )
    .then((data) => {
      return data.rows[0].id;
    })
    .catch((err) => {
      console.log("err", err.message);
      throw err;
    });
};

//Delete a task
const deleteTask = (id) => {
  return db.query("DELETE FROM tasks WHERE id = $1;", [id]).catch((err) => {
    console.log("err", err.message);
  });
};

module.exports = {
  getAllTasks,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
  createTask,
};
