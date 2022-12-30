
const PagarmeAPI = async (transactionParams) => {

const response = await fetch('https://api.pagar.me/core/v5/orders', {
    method: 'POST', // or 'PUT'
    headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PAGARME_API_KEY}:` as string).toString('base64'),
        'Content-Type': 'application/json',
    },
    
    body: JSON.stringify(transactionParams),
  }).then(res => res.json())
  .catch(err => console.error('error:' + err));

  return response;
}

export default PagarmeAPI;