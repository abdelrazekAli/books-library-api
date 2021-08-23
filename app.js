const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const storeRouter = require("./routes/store.route");
const bookRouter = require("./routes/book.route");
const userRouter = require("./routes/user.route");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(cors());

// if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

app.use("/uploads", express.static("uploads"));
app.use(
  fileUpload({
    limits: { fileSize: 5000000 }, //5mb
    safeFileNames: /\\/g,
    abortOnLimit: true,
    responseOnLimit: "Image must be less than 5MB",
  })
);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1", userRouter);
app.use("/api/v1", storeRouter);
app.use("/api/v1", bookRouter);

app.listen(process.env.PORT);
