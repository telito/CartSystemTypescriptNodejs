import { cpf } from 'cpf-cnpj-validator'
import PagarmeAPI from './PagarmeAPI'

import { addDays } from 'date-fns';


class PagarMeProvider{
    async process({
        transactionCode,
        total,
        paymentType,
        installments,
        creditCard,
        customer,
        billing,
        itemsP,
    }){

        const billetParams = {
            payments: [{
                boleto: {
                instructions: 'Pagar em até 3 dias',
                due_at: addDays(Date.now(), 3 ),
                document_number: customer.document.replace(/[^?0-9]/g, ""),
                type: 'DM'
                },
                payment_method: 'boleto'
            }]
        }

        const billingParams = billing?.zipCode ? {
            address: {
                line_1: `${billing.number}, ${billing.address}, ${billing.neighborhood}`,
                line_2: '',
                zip_code: billing.zipCode,
                city: billing.city,
                state: billing.state,
                country: 'BR'
            },
    } : {}

        const billingCreditParams = {
            billing_address:{
                line_1: `${billing.number}, ${billing.address}, ${billing.neighborhood}`,
                zip_code: billing.zipCode,
                city: billing.city,
                state: billing.state,
                country: 'BR'
            }
        }

        let creditCardParams; 

        if(paymentType === "credit_card"){
            creditCardParams =  {
                payments: [{ credit_card: {
                    card:{
                        ...billingCreditParams,
                        number: creditCard.number.replace(/[^?0-9]/g, ""),
                        holder_name: creditCard.holderName,
                        exp_month: creditCard.expiration.replace(/[^?0-9]/g, "").substring(0,2),
                        exp_year:  creditCard.expiration.replace(/[^?0-9]/g, "").substring(2,4),
                        cvv: creditCard.cvv,
                    },
                    recurrence: false,
                    installments: 1,
                    statement_descriptor: 'AVENGERS'
                },
                payment_method: 'credit_card' }]
            }
        }

        let paymentParams;

        switch (paymentType){
            case "credit_card":
                paymentParams = creditCardParams
            break

            case "billet":
                paymentParams = billetParams;
            break

            default:
                throw `paymentType ${paymentType} not allow`
            break
        }
        
     

        const customerParams = {
            customer: {
                  ...billingParams,
                  phones: {
                    home_phone: {country_code: '55', area_code: customer.mobile.substring(3, 5), number: customer.mobile.substring(5)},
                    mobile_phone: {country_code: '55', area_code: customer.mobile.substring(3, 5), number: customer.mobile.substring(5)}
                  },
                  name: customer.name,
                  email: customer.email,
                  document:  customer.document.replace(/[^?0-9]/g, ""),
                  type: cpf.isValid(customer.document) ? "individual" : "corporation",
            }
        }

        const itemsParams = itemsP && itemsP.length > 0 ? { 
            items: itemsP.map( (item) => ({
                mount: item?.amout * 100,
                description: item?.title,
                code: item?.id.toString(),
                quantity: item?.quantity || 1,
                
            })),
        } : { 
            items: [{
                amount: total * 100,
                code: "1",
                description:`t-${transactionCode}`,
                quantity: 1,
            }]
        }

        const metadataParams = {
            metadata:{
                transaction_code: transactionCode
            }
        }

        const transactionParams = {
            ...customerParams,
            ...itemsParams,
            ...paymentParams
        }

        PagarmeAPI(transactionParams)
       
    }
}

export default PagarMeProvider;