const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");

// Import routes
const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const storeRouter = require("./routes/store.route");

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
app.use(helmet()); //To secure Express app by setting various HTTP headers

app.use("/uploads", express.static("uploads"));
app.use(
  fileUpload({
    limits: { fileSize: 5000000 }, //5mb
    safeFileNames: /\\/g,
    abortOnLimit: true,
    responseOnLimit: "Image must be less than 5MB",
  })
);

// Router for Api docs
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Routes Middlewares
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/books", bookRouter);

app.listen(process.env.PORT);
