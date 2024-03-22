import cors from "cors";
import express, { Application, Request, Response, urlencoded } from "express";
import { userRoutes } from "./app/modules/user/user.route";

const app: Application = express();
app.use(cors());
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

app.use("/api/v1/user", userRoutes);

export default app;
