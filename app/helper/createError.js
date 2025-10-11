const createError = (statusCode, message,err) => {
  console.log(statusCode, message);

  // if (typeof message === "object") {
  //   // Stringify and remove slashes and newlines
  //   message = JSON.stringify(message, null, 2).replace(/[\/\n]/g, ""); // Remove / and newlines
  // }  

  const error = new Error(message);
  console.log(error);
  error.statusCode = statusCode;
  if (err) {
    error.errors = err;
  }
  return error;
};

export default createError;
