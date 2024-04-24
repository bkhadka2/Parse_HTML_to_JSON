import express from "express";
import indexRouter from "./routes/index.js";

const app = express();
const port = 3000;

// Index route
app.use(indexRouter);

// Error Handler Middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server Error. Something went wrong!";
  res.status(status).json({
    message: message,
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
