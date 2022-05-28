const config = require('../config/config');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { NFTModal } = require('../models/NFTs')

const pinataApiKey = config.pinataApiKey;
const pinataSecretApiKey = config.pinataSecretApiKey;

const urlFile = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const urlJSON = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

const insertNFTImage = async (filename, name, keyvalues, lotteryid, nftid) => {
    try {
        const filepath = path.resolve(__dirname, "../upload/temp/" + filename)
        const res = await pinFileToIPFS(filepath, name, keyvalues, lotteryid, nftid)
        if (res.status == 200) {
            var imgHash = res.data.IpfsHash;
            return { err: 0, hash:imgHash}    
        }
        return { err: 1, hash:null}
    } catch (error) {
        console.log(error)
        return { err: 1, msg: error }
    }
}

const pinFileToIPFS = async (fileName, pinataName, keyvalues, lotteryid, nftid) => {
    let data = new FormData();
    data.append('file', fs.createReadStream(fileName));
    const metadata = JSON.stringify({
        name: pinataName,
        keyvalues: keyvalues
    });
    data.append('pinataMetadata', metadata);
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);
    var res = await axios
        .post(urlFile, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
    var nft = {
        lotteryid:lotteryid,
        nftid: nftid, 
        url: res.url
    }
	const instance = new NFTModal(nft);
	await instance.save()
    return Promise.resolve(res)
}
const uploadNFTs = async(lotteryid, nftimgs, name, description) => {
    for(var i=0; i<nftimgs.length; i++){
        var imgid = nftimgs[i];
        insertNFTImage(imgid, name, description, lotteryid, i+1)
    }
}
module.exports = { insertNFTImage, uploadNFTs}
