import { Router } from "express"
import CartsController from "./controllers/CartsController";
import TransactionsController from "./controllers/TransactionsController";
const routes = Router();

//routes.get("/transactions", ...)
routes.get("/carts", CartsController.index)
routes.post("/carts", CartsController.create)
routes.put("/carts/:id", CartsController.update)
routes.delete("/carts/:id", CartsController.destroy)

routes.post("/transaction", TransactionsController.create)

export default routes;