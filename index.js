require('dotenv').config();
const express = require('express')
const cors = require('cors');
const mongoose = require("mongoose");
const app = express()
const config = require("./config/config");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', require('./routes/api'))
app.use(express.static('public'));

const mongourl = config.mongoURI;
mongoose.connect(mongourl, {useUnifiedTopology: true,useNewUrlParser: true,}).then(() => {
	console.log("MongoDB Connected")
	const PORT = config.port || 80;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.log(err));

process.on('uncaughtException', function (err) {
	
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
	console.log(err)	
});


