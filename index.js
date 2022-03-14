import express from 'express'
import config from './config.js'
import {initializeDbConnection} from './DAL/mongoConnectios.js'
import {createNewVirtualCard, getCardDetaileById, loadMoneyToCard, makeTransaction} from './DAL/card.js'
const app = express();
app.use(express.json());

var port = process.env.PORT || config.app.port;

initializeDbConnection().then(() => {
    app.listen(port, function() {
        console.log('Server started on port: ' + config.app.port);
    });
});

// cards
app.get('/card/:id', async (req, res) => {
    const cardDetails = await getCardDetaileById(req.params.id);
    res.send(cardDetails);
});

app.post('/card', async (req, res) => {
    const cardHolderName = req.body.cardHolderName;
    const cardDetails = await createNewVirtualCard(cardHolderName);
    res.send(cardDetails);
});

app.put('/card/loadMoney', async (req,res) => {
    const amount = req.body.amount;
    const cardId = req.body.id;
    const resp = await loadMoneyToCard(cardId, amount);
    res.send(resp);
});

app.post('/transaction', async (req,res) => {
    const cardDetails = req.body.cardDetails;
    const type = req.body.type;
    const amount = req.body.amount;
    const description = req.body.description;
    const resp = await makeTransaction(cardDetails, amount, type, description);
    res.send(resp);
});
  
