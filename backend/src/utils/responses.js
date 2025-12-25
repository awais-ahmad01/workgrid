export function successResponse(res, data = {}, code = 200) {
  return res.status(code).json({
    status: "success",
    data,
  });
}

export function errorResponse(res, statusCode, code, message) {
  return res.status(statusCode).json({
    status: "error",
    code,
    message,
  });
}
