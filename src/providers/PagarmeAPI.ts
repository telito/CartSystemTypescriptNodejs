
const PagarmeAPI = (transactionParams) => {
    console.log(transactionParams)
fetch('https://api.pagar.me/core/v5/orders', {
    method: 'POST', // or 'PUT'
    headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PAGARME_API_KEY}:` as string).toString('base64'),
        'Content-Type': 'application/json',
    },
    
    body: JSON.stringify(transactionParams),
  }).then((res) => {
    console.log('resposta aqui:  ',res, res.status)
  }).catch((err) => {
    console.log(err)
  })
}

export default PagarmeAPI;