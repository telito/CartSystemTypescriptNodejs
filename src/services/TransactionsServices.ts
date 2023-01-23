//1. criar transactions (registro)
//2. integrar com pagarme
//3. status
import Cart from '../models/Cart'
import {v4 as uuidV4} from 'uuid'
import Transaction from '../models/Transaction';
import PagarMeProvider from '../providers/PagarMeProvider';

class TransactionService {
    private paymentProvider;

    constructor(paymentProvider){
        this.paymentProvider = paymentProvider || new PagarMeProvider()
    }

    async process({
        cartCode,
        paymentType,
        installments,
        customer,
        billing,
        creditCard
    }) {
        const cart = await Cart.findOne({code: cartCode});
        
        if(!cart){
            throw `Cart ${cartCode} was not found.`
        }

        const transaction = await Transaction.create({
            transactionId:  '-',
            cartCode: cart.code,
            code: await uuidV4(),
            price: cart.price,
            total: cart.price,
            paymentType,
            installments,
            status: 'started',
            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            customerDocument: customer.document,
            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipCode: billing.zipCode,
            processorResponse: '-',
        });

        const response = await this.paymentProvider.process({
            transactionCode: transaction.code,
            total: transaction.total,
            paymentType,
            installments,
            creditCard,
            customer,
            billing,
        });
        
        await transaction.updateOne({
                transactionId: response.transactionId,
                status: response.status,
                processorResponse: response.processorResponse,
        });



        return response;
    }   

    async updateStatus({code, providerStatus}){
        const transaction = Transaction.findOne({code});

        if(!transaction){
            throw `Transaction ${code} not found.`
        }

        const status = this.paymentProvider.translateStatus(providerStatus)

        if(!status){
            throw `Status is empty`;
        }

        await transaction.updateOne({ status });
    }
}

export default TransactionService;