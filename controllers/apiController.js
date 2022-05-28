require('dotenv').config()
const { LotteryModal } = require('../models/Lottery')
const { NFTModal } = require('../models/NFTs')
const {ipfsController} = require('./ipfsController');

const getLotteries = async (type) => {
	try {
		var rows;
		var now = new Date().getTime()
		switch(type){ 
			case 0: rows = await LotteryModal.find().sort({registation: 1}); break; //all
			case 1: rows = await LotteryModal.find({start: { $gt: now } }).sort({registation: 1}); break; //upcoming
			case 2: rows = await LotteryModal.find({start: { $gt: now }, end: {$lt: now}}).sort({registation: 1}); break; //active
			case 3: rows = await LotteryModal.find({end: { $lt: now } }).sort({registation: 1}); break; //ended
		}
		return { error: 0, result: rows }
	} catch (ex) {
		console.log(ex) 
		return { error: 1, msg: "error" }
	}
}

const getNFTUrls = async (lotteryId) => {
	try {
		var rows = await NFTModal.find({lotteryid:lotteryId}).sort({registation: 1}); 
		return { error: 0, result: rows }
	} catch (ex) {
		console.log(ex) 
		return { error: 1, msg: "error" }
	}
}

const createLottery = async (name, description, backImg, imgId, headerImgId, creator, startTime, endTime, totalSupply, nftImgs, rate) => {
	try {
		var id = await LotteryModal.findOne().sort({lotteryid: 1});
		const lottery = {
			lotteryid: id,
			name,
			description,
			headerimg: headerImgId,
			backimg: backImg,
			image:imgId,
			creator, 
			start: startTime,
			end: endTime,
			totalsupply: totalSupply, 
			winrate: rate,
			registation: new Date().getTime()
		}
		var backpath1 =  path.resolve(__dirname, "../upload/temp/" + backImg);
		var backpath2 =  path.resolve(__dirname, "../upload/lottery/back/" + backImg);
		var headerpath1 =  path.resolve(__dirname, "../upload/temp/" + headerimg);
		var headerpath2 =  path.resolve(__dirname, "../upload/lottery/header/" + headerImgId);
		var imagepath1 =  path.resolve(__dirname, "../upload/temp/" + imgId);
		var imagepath2 =  path.resolve(__dirname, "../upload/lottery/images/" + imgId);
		await fs.renameSync(backpath1, backpath2);
		await fs.renameSync(headerpath1, headerpath2);
		await fs.renameSync(imagepath1, imagepath2);
		const instance = new LotteryModal(lottery);
		await instance.save()
		await ipfsController.uploadNFTs(id, nftImgs, name, description)
		return { error: 0, result: id}
	} catch (ex) {
		console.log(ex) 
		return { error: 1, msg: "error" }
	}
}

const changeLottery = async (id,  name, description, backImg, imgId, headerImgId, startTime, endTime, rate) => {
	try {
		await LotteryModal.updateOne({lotteryid:id}, {$set : {name, description, backimg: backImg, image: imgId, headerimg: headerImgId, start: startTime, end: endTime, winrate: rate}});
		return { error: 0, result: {}}
	} catch (ex) {
		console.log(ex) 
		return { error: 1, msg: "error" }
	}
}

const endLottery = async (id) => {
	try {
		await LotteryModal.updateOne({lotteryid:id}, {$set : {end: 0}});
		return { error: 0, result: {}}
	} catch (ex) {
		console.log(ex) 
		return { error: 1, msg: "error" }
	}
}

const getLotteryInfo = async(id) => {
	try {
		var rows = await LotteryModal.find({ lotteryid: id})
		return { error: 0, result: rows }
	} catch(ex){
		return { error: 1, msg: "error" }
	}
}


module.exports = {
	getLotteries,
	getNFTUrls,
	createLottery,
	changeLottery,
	endLottery,
	getLotteryInfo
}
