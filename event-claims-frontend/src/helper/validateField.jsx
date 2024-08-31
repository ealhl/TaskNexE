const validateField = (value, setError) => {
  if (!value) {
    setError(true);
    return false;
  } else {
    setError(false);
    return true;
  }
};

export default validateField;