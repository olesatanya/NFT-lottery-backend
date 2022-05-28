const router = require('express').Router();
const multer = require('multer');
const apiController = require('../controllers/apiController.js')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'upload/temp/')
	},
	filename: (req, file, cb) => {
		const filename = Math.floor(Math.random()*1000000000)+".png";
		cb(null, filename)
	},
})
const upload = multer({ storage: storage })

router.post('/get-lotteries', async (req, res) => {
	try {
		const {type} = req.body;
		const response = await apiController.getLotteries(type)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})


router.post('/create-lottery', async (req, res) => {
	try {
		const {name, description, backImg, imgId, headerImgId,  creator, startTime,  endTime, totalSupply, nftImgs, rate } = req.body;
		const response = await apiController.createLottery(name, description, backImg,  imgId, headerImgId,  creator, startTime, endTime, totalSupply, nftImgs, rate)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})

router.post('/get-nft-urls', async (req, res) => {
	try {
		const {lotteryId } = req.body;
		const response = await apiController.getNFTUrls(lotteryId)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})

router.post('/change-lottery', async (req, res) => {
	try {
		const {id, name, description, backImg, imgId, headerImgId, startTime, endTime, rate} = req.body;
		const response = await apiController.changeLottery(id, name, description, backImg, imgId, headerImgId, startTime, endTime, rate)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})	
router.post('/end-lottery', async (req, res) => {
	try {
		const {lotteryId} = req.body;
		const response = await apiController.endLottery(lotteryId)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})	
router.post('/get-lottery-info', async (req, res) => {
	try {
		const {lotteryId} = req.body;
		const response = await apiController.getLotteryInfo(lotteryId)
		res.send(response)
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})	
router.post('/upload-image', upload.array('file'),	async (req, res) => {
	try {
		if(!req.file){
			return res.send({id:'0.png'})
		}
		else {
			return res.send({id:req.file.filename})
		}
	} catch (error){
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})
	
router.all('/*', async (req, res) => {
	try {
		res.send({ error: 404, result: { msg: '404' } })	
	} catch (error) {
		console.log(error)
		res.status(404).send({msg:'error'});
	}
})

module.exports = router
