const responseGenerate = (
  data,
  message = null,
  error = false,
  token = null
) => {
  return {
    error,
    data,
    message,
    token,
  };
};

module.exports = responseGenerate;
