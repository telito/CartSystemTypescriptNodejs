import { Router } from "express"
import CartsController from "./controllers/CartsController";
import TransactionsController from "./controllers/TransactionsController";
import PostbackController from "./controllers/PostbackController";
const routes = Router();

//routes.get("/transactions", ...)
routes.get("/carts", CartsController.index)
routes.post("/carts", CartsController.create)
routes.put("/carts/:id", CartsController.update)
routes.delete("/carts/:id", CartsController.destroy)

routes.post("/postbacks/pagarme", PostbackController.pagarme)

routes.post("/transaction", TransactionsController.create)

export default routes;