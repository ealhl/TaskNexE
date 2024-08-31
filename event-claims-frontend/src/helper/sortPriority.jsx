const priorityValue = {
  "High": 3,
  "Medium": 2,
  "Low": 1,
  "default": 0
};

const sortTasksByPriority = (a, b) => {
  return (priorityValue[b.priority] || priorityValue.default) - (priorityValue[a.priority] || priorityValue.default);
};

export default sortTasksByPriority;