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
    }
    const resultUpdate = await db.collection(collectionName).updateOne({cardDetails : {cardNumber: cardDetails.cardNumber}},
        {$push: { transactions: transaction}});
    return resultUpdate;
}