import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import TaskCards from "./TaskCards";
import Header from "./Header";
import NewTaskModule from "./NewTaskModule";
import TaskModule from "./TaskModule";
import { useNavigate } from "react-router-dom";
import TaskPieChart from "../helper/pieChart";
import { getTaskTypeText } from "../helper/getTaskTypeText";
import sortTasksByPriority from "../helper/sortPriority";

const Dashboard = () => {
  const [isTaskModuleOpen, setTaskModuleOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState();
  const [userFname, setUserFname] = useState(null);
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage.clear();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
      setUserId(user.userid);
      setUserFname(user.fname);
      setDepartment(user.department);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const filterTasks = (allTasks) => {
    if (userRole !== "Admin") return allTasks;

    const taskTypeMap = { HR: 1, Account: 2 };
    const taskType = taskTypeMap[department];
    return taskType
      ? allTasks.filter((task) => task.task_type === taskType)
      : [];
  };

  const fetchTasks = async () => {
    const url = userRole === "Admin" ? "api/tasks" : `api/tasks/user/${userId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks(filterTasks(data));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (userId && userRole) {
      fetchTasks();
    }
  }, [userId, userRole, department]);

  const statuses = ["Submitted", "In Progress", "Approved", "Rejected"];

  const handleOpenTask = (task) => {
    setTask(task);
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => {
    setIsTaskOpen(false);
    fetchTasks();
  };

  const handleOpenNewTask = () => {
    setTaskModuleOpen(true);
  };

  const handleCloseNewTask = () => {
    setTaskModuleOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const updateData = {
        ...task,
        status: newStatus,
      };

      const updateResponse = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        alert(`Failed to update task status: ${errorText}`);
        throw new Error(errorText);
      }

      fetchTasks();
      handleCloseTask();
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert(`Failed to update task status: ${error.message}`);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.deletedCount > 0) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );
        } else {
          console.warn("No tasks deleted, check if taskId is correct");
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to delete task:", errorText);
        alert(`Failed to delete task: ${errorText}`);
      }
      handleCloseTask();
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(`Failed to delete task: ${error.message}`);
    }
  };

  // Calculate the number of approved tasks and the total number of tasks
  const totalTasks = tasks.length | 0;
  const approvedTasks =
    tasks.filter((task) => task.status === "Approved").length | 0;

  return (
    <Container maxWidth={false} sx={{ px: 5 }}>
      <Header
        userFname={userFname}
        userRole={userRole}
        onCreateTask={handleOpenNewTask}
        onLogout={handleLogout}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Poppins, sans-serif",
          mb: 4,
          mt: 5,
        }}
      >
        <Box sx={{ marginLeft: 10 }}>
          <Typography variant="h5">Total Progress</Typography>
          <Typography variant="h3">
            {((approvedTasks / totalTasks) * 100).toFixed(0) | 0}%
          </Typography>
          <Typography variant="h6">Tasks completed: {approvedTasks}</Typography>
          <Typography variant="h6">Total tasks: {totalTasks}</Typography>
        </Box>
        <Box sx={{ marginRight: 30 }}>
          <TaskPieChart tasks={tasks} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {statuses.map((status) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={status}>
            <Box
              sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3 }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
              >
                {status}
              </Typography>
              <Grid container spacing={3}>
                {tasks
                  .filter((task) => task.status === status)
                  .sort(sortTasksByPriority)
                  .map((task, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        onClick={() => handleOpenTask(task)}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          transition: "box-shadow 0.3s ease-in-out",
                          "&:hover": {
                            boxShadow: 6, // You can adjust the value for a stronger or softer shadow
                          },
                        }}
                      >
                        <CardContent>
                          <TaskCards
                            title={task.title}
                            description={task.short_desc}
                            dueDate={task.due_date || task.dueDate}
                            priority={task.priority}
                            taskType={getTaskTypeText(task.task_type)}
                            userRole={userRole}
                            onInProgress={() =>
                              updateTaskStatus(task.id, "In Progress")
                            }
                            onApprove={() =>
                              updateTaskStatus(task.id, "Approved")
                            }
                            onReject={() =>
                              updateTaskStatus(task.id, "Rejected")
                            }
                            onDelete={() => deleteTask(task.id)}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>

      <NewTaskModule
        task={{}}
        open={isTaskModuleOpen}
        onClose={handleCloseNewTask}
        id={userId}
      />
      <TaskModule
        task={task}
        open={isTaskOpen}
        onClose={handleCloseTask}
        userRole={userRole}
        onInProgress={() => updateTaskStatus(task.id, "In Progress")}
        onApprove={() => updateTaskStatus(task.id, "Approved")}
        onReject={() => updateTaskStatus(task.id, "Rejected")}
        onDelete={() => deleteTask(task.id)}
        onTaskUpdated={fetchTasks}
      />
    </Container>
  );
};

export default Dashboard;
