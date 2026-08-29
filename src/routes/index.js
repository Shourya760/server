import userRoutes from "./user.routes.js";

const registerRoutes = (app) => {
  app.use("/api", userRoutes );

};

export default registerRoutes;