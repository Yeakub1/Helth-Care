import cors from "cors";
import express, {
  Application,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandlear from "./app/middlewares/globalErrorHandlear";

const app: Application = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph helth care server...",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandlear);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "Your Request Path Not Found",
    },
  });
});
export default app;
