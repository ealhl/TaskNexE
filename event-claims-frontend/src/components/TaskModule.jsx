import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  MenuItem,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getTaskTypeText } from "../helper/getTaskTypeText";

import "./TaskModule.css";

const TaskModule = ({
  task,
  open,
  onClose,
  userRole,
  onInProgress,
  onApprove,
  onReject,
  onDelete,
  onTaskUpdated,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getTask = `/api/tasks/${task.id}`;

  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: name === "task_type" ? (value === "Event Idea" ? 1 : 2) : value,
    }));
  };

  const handleDateChange = (date) => {
    setEditedTask((prevTask) => ({
      ...prevTask,
      due_date: date.toISOString(),
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(getTask, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      });

      if (response.ok) {
        setIsEditMode(false);
        onTaskUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        console.error("Failed to update task:", errorText);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        Task Details
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box p={isMobile ? 1 : 2} m={isMobile ? 1 : 2}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task"
                select
                variant="outlined"
                name="task_type"
                value={getTaskTypeText(editedTask.task_type)}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              >
                <MenuItem value="Event Idea">Event Idea</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                name="title"
                value={editedTask.title || "-"}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                select
                variant="outlined"
                name="priority"
                value={editedTask.priority || ""}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                variant="outlined"
                type="number"
                value={editedTask.amount || "-"}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datepicker"
                  label="Due Date"
                  name="due_date"
                  value={dayjs(editedTask.due_date)}
                  onChange={handleDateChange}
                  disabled={!isEditMode}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: "lightGreyDefaultValue",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                name="short_desc"
                variant="outlined"
                value={editedTask.short_desc || "-"}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="details"
                variant="outlined"
                multiline
                rows={4}
                value={editedTask.details || "-"}
                onChange={handleChange}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid
              item
              xs={12}
              container
              spacing={2}
              justifyContent="space-between"
            >
              {isEditMode ? (
                <>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="inherit"
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={onDelete}
                    >
                      Delete
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
            {userRole === "Admin" && !isEditMode && (
              <Grid
                item
                xs={12}
                container
                spacing={2}
                justifyContent="space-between"
              >
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    onClick={onInProgress}
                  >
                    In Progress
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onApprove}
                  >
                    Approve
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={onReject}
                  >
                    Reject
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModule;
