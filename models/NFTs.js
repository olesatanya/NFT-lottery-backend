const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NFT_Schema = new Schema({
	lotteryid: {type: Number, default: 0},
	nftid:  {type: Number, default: 0},
	url: {type: String, default: ''}
})

const NFTModal = mongoose.model('NFTdata', NFT_Schema)
module.exports = { NFTModal }
