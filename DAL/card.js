import db from './mongoConnectios.js';
import config from '../config.js'
import generateNewCard from '../utilities/generateCardDetails.js';
import { v4 as uuidv4 } from 'uuid';

const collectionName = config.db.collections.card;

export const createNewVirtualCard = async (cardHolderName) => {
    const newVirtualCardDocument =  {
        _id: uuidv4(),
        cardDetails: generateNewCard(cardHolderName),
        amount: 0,
        transactions: []
    }
    await db.collection(collectionName).insertOne(newVirtualCardDocument);
    return ({
            "id": newVirtualCardDocument._id,
            "cardDetails": newVirtualCardDocument.cardDetails
    });
}

export const getCardDetaileById = async (cardId) => {
    const cardDetails =  await db.collection(collectionName).findOne({_id:cardId});
    return {
            amount : cardDetails.amount,
            transactions: cardDetails.transactions
            }
}

export const loadMoneyToCard = async (cardId, amount) => {
    const resultUpdate = await db.collection(collectionName).updateOne(
        {"_id": cardId} ,  { $inc: {"amount" : amount}}
    )
    return resultUpdate;
}

export const makeTransaction = async (cardDetails, amount, type, description) => {

    const transaction = {
        transactionId: uuidv4(),
        timestamp: Date.now(),
        amount: amount,
        description: description,
        type: type
    };

    const cardDetailsFindQuery = {
            "cardDetails.cardNumber" : cardDetails.cardNumber,
            "cardDetails.cvv" : cardDetails.cvv,
            "cardDetails.cardHolderName" : cardDetails.cardHolderName,
            "cardDetails.expirationYear" : cardDetails.expirationYear,
            "cardDetails.expirationMonth" : cardDetails.expirationMonth
    }
    const currCardDetails = await db.collection(collectionName).findOne(cardDetailsFindQuery);
    if(currCardDetails.amount - amount >= 0) {
        const resultUpdate = await db.collection(collectionName).updateOne(
            cardDetailsFindQuery,
            {$push: { transactions: transaction}, $inc: {amount: (amount*-1)}});
        return resultUpdate;
    } else {
        return "no money";
    }
}