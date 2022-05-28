const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Lottery_Schema = new Schema({
    lotteryid: {type: Number, default: 0} ,
    name: {type: String, default: ''} ,
    description: { type: String, default: '' },
    headerimg: { type: Number, default: 0 },
    backimg:{ type: Number, default: 0 },
    image:{ type: Number, default: 0 },
    creator: { type: String, default: '' },
    start:{ type: Number, default: 0 },
    end:{ type: Number, default: 0 },
    totalsupply:{ type: Number, default: 0 },
    winrate:{ type: Number, default: 0 },
    registation: {type: Number, default:0}
})

const LotteryModal = mongoose.model('Lotterydata', Lottery_Schema)
module.exports = { LotteryModal }
