import userRoutes from "./user.routes.js";
import articleRoutes from "./articles.routes.js"
import commentRoutes from "./comment.routes.js"


const registerRoutes = (app) => {
  app.use("/api", userRoutes);
  app.use("/api", articleRoutes);
  app.use("/api", commentRoutes);


};

export default registerRoutes;