import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import dayjs from "dayjs";
import { PiMoneyWavy, PiLightbulb } from "react-icons/pi";


const TaskCard = ({ title, description, dueDate, priority, taskType}) => {
  const formattedDueDate = dayjs(dueDate).format("YYYY-MM-DD");

  const getIcon = () => {
    if (taskType === "Expense") {
      return <PiMoneyWavy size={24} />;
    } else if (taskType === "Event Idea") {
      return <PiLightbulb size={24} />;
    }
    return null;
  };

  
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}> {/* Increased margin-right */}
            {getIcon()}
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="body1">{description}</Typography>
        <Typography variant="subtitle2">Due Date: {formattedDueDate}</Typography>
        <Chip label={priority} color={priority === 'High' ? 'error' : 'primary'} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
};

export default TaskCard;