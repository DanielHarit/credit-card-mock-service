const cards = 
[
    {
        id: "uuid",
        cardDetails: {
            cardId: uuidv4(),
            cardHolderName: cardHolderName,
            cvv: generateRandomCVV(),
            expirationYear: 2025,
            expirationMonth: 01,
            cardNumber: generateCard()
        },
        amount: "",
        transactions: [
            {
                transactionId: "",
                timestamp:"",
                amount:"",
                description:"",
                type: ""
            },
            {}
        ]
    }
];