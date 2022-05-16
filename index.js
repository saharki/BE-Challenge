const fs = require('fs');
const express = require('express')
const app = express()
const port = +process.argv[2] || 3000

const client = require('redis').createClient()
client.on('error', (err) => console.log('Redis Client Error', err));

client.on('ready', () => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Example app listening at http://0.0.0.0:${port}`)
    })
})

const cardsData = fs.readFileSync('./cards.json');
const cards = JSON.parse(cardsData);
//const cards = cardsParsedData.reduce((obj, card) => ({ ...obj, [card.id]: card }))

function getMissingCard(index) {
    return cards[index - 1]
}

app.get('/card_add', async (req, res) => {
    const  key = 'user_id:' + req.query.id
    let missingCard = ''
    const index = await client.INCR(key)

    missingCard = getMissingCard(index);
    if(missingCard === undefined){
        res.send({id: "ALL CARDS"})
        return
    }

    res.send(missingCard)
})

app.get('/ready', async (req, res) => {
    res.send({ready: true})
})

client.connect();
