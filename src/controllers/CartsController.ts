import Cart from "../models/Cart";
class CartsController{
    async index(req, res) {
        try{
            const carts = await Cart.find();
            return res.status(200).json(carts)
        } catch(err){
            console.error(err)
            return res.status(500).json({error: "Internal server error"})
        }
        
    }

    async create(req, res){
        try{
            const {code, price} = req.body
            const cart = await Cart.create({code, price});
            return res.status(201).json(cart)
        }catch(err){
            console.error(err)
            return res.status(500).json({error: "Internal server error"})
        }
    }

    async update(req, res){
        try{
            const { id } = req.params
            const { code, price } = req.body
            const cart = await Cart.findById(id)
            if(!cart){
                return res.status(404).json({success:"not found id"})
            }
            await cart.updateOne({ code, price })
            return res.status(200)

        }catch(err){
            return res.status(500).json({error: "internal server error"})
        }
    }

    async destroy(req, res){
        try{
            const {id} = req.params
            const cart = await Cart.findById(id)
            if(!cart){
                return res.status(404).json({error: "not found id"})
            }
            await cart.deleteOne();
            return res.status(200).json({success:'Deleted'})

        }catch(err){
            return res.status(500).json({error: "internal server error"})
        }
    }
}
export default new CartsController();