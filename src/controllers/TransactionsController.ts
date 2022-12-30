import transaction from "../models/Transaction";
import * as Yup from 'yup'
import { parsePhoneNumber } from "libphonenumber-js";
import { cpf,cnpj } from 'cpf-cnpj-validator'
import Cart from '../models/Cart'
import TransactionService from "../services/TransactionsServices";
class TransactionController{
    async create(req, res){
        try{
            const{
                cartCode,
                paymentType,
                installments,
                customerName,
                customerEmail,
                customerMobile,
                customerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingState,
                billingZipCode,
                billingCity,
                creditCardNumber,
                creditCardExpiration,
                creditCardHolderName,
                creditCardCvv,
            } = req.body;

            const schema = Yup.object({
                cartCode: Yup.string().required(),
                paymentType: Yup.mixed().oneOf(["credit_card", "billet"]).required(),
                installments: Yup.number().min(1).when("paymentType", (paymentType, schema) => {
                    paymentType === "credit_card" ? schema.max(12) : schema.max(1)
                }),
                customerName: Yup.string().required().min(3),
                customerEmail: Yup.string().required().email(),
                customerMobile: Yup.string().required().test("is-valid-mobile", "${path} is not a mobile number", (value) => parsePhoneNumber(value as string, "BR").isValid()),
                customerDocument: Yup.string().required().test("is-valid-document", "${path} is not a valid CPF / CNPJ", (value) => cpf.isValid(value as string) || cnpj.isValid(value as string)),
                billingAddress: Yup.string().required(),
                billingNumber: Yup.string().required(),
                billingNeighborhood: Yup.string().required(),
                billingCity: Yup.string().required(),
                billingState: Yup.string().required(),
                billingZipCode: Yup.string().required(),
                creditCardNumber: Yup.string().when("paymentType",
                (paymentType, schema) => {
                    return paymentType === "credit_card" ? schema.required() : schema
                }),
                creditCardExpiration: Yup.string().when("paymentType",
                (paymentType, schema) => {
                    return paymentType === "credit_card" ? schema.required() : schema
                }),
                creditCardHolderName: Yup.string().when("paymentType",
                (paymentType, schema) => {
                    return paymentType === "credit_card" ? schema.required() : schema
                }),
                creditCardCvv: Yup.string().when("paymentType",
                (paymentType, schema) => {
                    return paymentType === "credit_card" ? schema.required() : schema
                }),
            })

            if(!(await schema.isValid(req.body))){
              
                return res.status(400).json({error: "internallll server error"})
            }

            const cart = Cart.findOne({
                code: cartCode
            })

            if(!cart){
                return res.status(404).json({error: "Cart not found"})
            }

            let creditCardParams; 

            if(creditCardNumber){
                creditCardParams = {
                    number: creditCardNumber,
                    expiration: creditCardExpiration,
                    holderName: creditCardHolderName,
                    cvv: creditCardCvv,
                }
            }

            const service = new TransactionService();
            const response = await service.process({
                    cartCode,
                    paymentType,
                    installments,
                    customer: {
                        name: customerName,
                        email: customerEmail,
                        mobile: parsePhoneNumber(customerMobile, "BR").format("E.164"),
                        document: customerDocument
                    },
                    billing: {
                        address: billingAddress ,
                        number: billingNumber ,
                        neighborhood: billingNeighborhood,
                        city: billingCity,
                        state: billingState,
                        zipCode: billingZipCode,
                    },
                    creditCard: {
                        ...creditCardParams
                    }
                });


            return res.status(201).json(response)
        }catch(err){0
            return res.status(500).json({error: err})
        }
    }
}

export default new TransactionController
