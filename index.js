const axios = require('axios');
const _ = require('lodash');
const transporter = require('./mail');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const data = await getData();
    res.render('pages/index', {data});
});

const getData = async () => {
    try {
        const response = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=296&date=31-03-2021', {headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        }});
        if(response.data.centers.length > 0) {
            const formattedDate = response.data.centers.map(d => _.pick(d, ["name", "address", "fee_type", "sessions"]));
            transporter.sendMail({
                from: 'prathidhwanijp@gmail.com',
                to: 'ks4uofficial@gmail.com',
                subject: 'Vaccine center found',
                html: `Booking slot available`
            })
            return formattedDate;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        console.log("N/A")
    }
}

app.listen(8080);
console.log('Server is listening on port 8080');
