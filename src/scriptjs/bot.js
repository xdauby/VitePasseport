const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios').default;
const config = require('../config/configTwitter.js');
const client = new TwitterApi(config);
const Appointment = require('../models/appointment.js');

const tweet = async (toTweet) => {
    try {
        await client.v1.tweet(toTweet);
    } catch (e) {
        console.log(e);
    }
}



async function getAppointment() {

    const url = "https://pro.rendezvousonline.fr/api-web/search-structures/Carte%20Nationale%20d'" + 'Identit%C3%A9%20(CNI)%20et%20Passeport/Gironde,%20France/44.83333/-0.66667?reasons_number={"3":1}&sort=asap&radius=150&page=1&per_page=10';
    const res = await axios.get(url);
    var today = new Date();
    var date_today = today.getFullYear()+ '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    const townhall_infos = [];
    
    for (const cur_townhall of res.data.results) {
        try {
            cur_townhall.reason = cur_townhall.reasons.filter(action => action.name == "Dépôt passeport")[0].id;
            cur_townhall.available_link = "https://pro.rendezvousonline.fr/api-web/structures/" + cur_townhall.id + '/availabilities/week?session_id=zu2npsfDsiVSUJ8R8tznPZyjAqnl6QVyJKsmLoOH&reasons={"' + cur_townhall.reason + '":1}&date='+ date_today +'&direction=1';
            cur_townhall.appt_link = 'https://rendezvousonline.fr/alias/' + cur_townhall.alias + "/service/Carte%20Nationale%20d'Identit%C3%A9%20(CNI)%20et%20Passeport";
            townhall_infos.push((({ id, name, reason, available_link, appt_link }) => ({ id, name, reason, available_link, appt_link }))(cur_townhall));
        } catch { }
    }

    const availabilities_appointment = [];

    for (const cur_townhall of townhall_infos) {
        try {
            const dispo = await axios.get(cur_townhall.available_link);
            for (const [key, value] of Object.entries(dispo.data)) {
                if (value.availabilities.length !== 0) {
                    for (const availabilities of value.availabilities) {
                        if (availabilities.is_visible == true) {

                            var entire_date = availabilities.start_at.split(' ');
                            var date = entire_date[0];
                            var hours = entire_date[1];

                            availabilities.appt_link = cur_townhall.appt_link;
                            availabilities.townhall = cur_townhall.name;
                            availabilities.date = date;
                            availabilities.hours = hours;

                            availabilities_appointment.push((({ date, hours, townhall, appt_link }) => ({ date, hours, townhall, appt_link }))(availabilities));

                            break;
                        }
                    }
                    break;
                }
            }
        } catch { }
    }
    return await availabilities_appointment;
}


const deleteDatabase = async () => {
    try {
        await Appointment.deleteMany({});
        console.log('All Data successfully deleted');
    } catch (err) {
        console.log(err);
    }
};

const actualyzeDatabase = async () => {
    try {

        const appt = await getAppointment();
        await deleteDatabase();
        for (curr_maire of appt) {
            const thing = new Appointment({
                townhall: curr_maire.townhall,
                date: curr_maire.date,
                hours: curr_maire.hours,
                appt_link: curr_maire.appt_link
            });
            thing
                .save()
                .then(() => { console.log({ message: 'Appointment saved' }); })
                .catch(error => console.log(error));
        }
        console.log('Database actualized');

    } catch (err) {
        console.log(err);
    }
}

module.exports = {actualyzeDatabase};


