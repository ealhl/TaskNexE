const getTaskTypeText = (type) => {
  switch (type) {
    case 1:
      return "Event Idea";
    case 2:
      return "Expense";
    default:
      return "Event Idea";
  }
};

const getTaskTypeId = (type) => {
  switch (type) {
    case "Event Idea":
      return 1;
    case "Expense":
      return 2;
    default:
      return 1;
  }
};

export { getTaskTypeText, getTaskTypeId };