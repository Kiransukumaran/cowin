const axios = require('axios');
const _ = require('lodash');
const transporter = require('./mail');
var express = require('express');
const morgan = require('morgan');
const cron = require('node-cron')
var app = express();
app.use(morgan('tiny'))
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const data = await getData(false);
    res.render('pages/index', {data});
});

const sendEmail = (value ="") => {
    transporter.sendMail({
        from: 'prathidhwanijp@gmail.com',
        to: 'ks4uofficial@gmail.com, arun7arunodayam7@gmail.com',
        subject: 'Vaccine center found',
        html: `Booking slot available`
    })
}

const getData = async (sendMail) => {
    try {
        const date = new Date().toISOString();
        const formattedDate = date.split('T')[0].split("-").reverse().join('-');
        const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=296&date=${formattedDate}`, {headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        }});
        if(response.data.centers.length > 0) {
            const formattedDate = response.data.centers.map(d =>{
                d.sessions = d.sessions.filter(c => c.available_capacity > 0)
                d.show = d.sessions.length > 0 ? true : false;
                return _.pick(d, ["name", "address", "fee_type", "sessions", "show"])
            });
            if(formattedDate.filter(c => c.show).length > 0 && sendMail) {
                sendEmail(JSON.stringify(formattedDate));
            }
            
            return formattedDate;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        console.log("N/A")
    }
}

getData(true);

cron.schedule('* * * * *', () => {
    console.log("Running scheduled job every 1 min")
    getData(true);
});

app.listen(process.env.PORT || 5000);
console.log('Server is listening on port ' + process.env.PORT || 5000);
