import Transaction from "../models/Transaction";
import TransactionService from "../services/TransactionsServices";

class PostbackController {
    async pagarme(req, res) {
        const {id, object, current_status} = req.body;

        try{
            if(object === 'transaction'){
                const transaction = await Transaction.findOne({transactionId: id})
                
                if(!transaction){
                    return res.status(404).json()
                }

                const service = new TransactionService();
                service.updateStatus({code: transaction.code, providerStatus: current_status,})

                return res.status(200).json()

            }

        }   catch(err) {
            return res.status(500).json({err})
        }
    }
}

export default new PostbackController;