import userRoutes from "./user.routes.js";
import articleRoutes from "./articles.routes.js"


const registerRoutes = (app) => {
  app.use("/api", userRoutes);
  app.use("/api", articleRoutes);


};

export default registerRoutes;