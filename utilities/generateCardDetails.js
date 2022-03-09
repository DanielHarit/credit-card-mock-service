import {generateCard} from '@simeon979/card-gen';

const generateNewCard = (cardHolderName) => {
    const cardDetails = {
        cardHolderName: cardHolderName,
        cvv: generateRandomCVV(),
        expirationYear: '2025',
        expirationMonth: '01',
        cardNumber: generateCard()
    }
    return cardDetails;
}

const generateRandomCVV = () => {
    const cvv = Math.floor(Math.random()*999);
    if (cvv < 10) {
        return ('00' + cvv); 
    } else if (cvv < 100) {
        return ('0' + cvv)
    }
    return cvv;
}

export default generateNewCard;
