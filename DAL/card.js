import db from './mongoConnectios.js';
import config from '../config.js'
import generateNewCard from '../utilities/generateCardDetails.js';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config()

const collectionName = config.db.collections.card;

export const createNewVirtualCard = async (cardHolderName, cardHolderEmail) => {
    const newVirtualCardDocument =  {
        _id: uuidv4(),
        cardHolderEmail: cardHolderEmail,
        cardDetails: generateNewCard(cardHolderName),
        amount: 0,
        transactions: []
    }
    await db.collection(collectionName).insertOne(newVirtualCardDocument);
    sendCreditCardDetails(newVirtualCardDocument._id);

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

export const sendCreditCardDetails = async (id) => {
    const cardDetails =  await db.collection(collectionName).findOne({_id:id});
    const cardHolderEmail = cardDetails.cardHolderEmail;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_PASSWORD,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken:  process.env.REFRESH_TOKEN
        },
    });
    let info = await transporter.sendMail({
        from: '<virtualccservice@gmail.com>  virtual credit card service',
        to: cardHolderEmail,
        subject: "your virtual credit card details",
        text: `hi ${cardDetails.cardDetails.cardHolderName}, your credit card details are:
        credit card number: ${cardDetails.cardDetails.cardNumber},
        expired at: ${cardDetails.cardDetails.expirationMonth}/${cardDetails.cardDetails.expirationYear},
        security number: ${cardDetails.cardDetails.cvv}`,
    });
    return "Message sent: " + info.messageId;
}