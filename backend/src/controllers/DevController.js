const axios = require('axios');

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//index, show, store, update, destroy

module.exports = {
    //INDEX
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    //STORE
    async store(request, response) {
        const {github_username, techs, latitude, longitude} = request.body;

        let dev = await Dev.findOne({github_username});

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            let {name, avatar_url, bio} = apiResponse.data;
        
            if (!name){
                name = apiResponse.data.login;
            }
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtrar as conexões que estão a no máximo 10km de distância
            // e que o novo dev tenha pelo menos uma das techs filtradas

            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }               
        return response.json(dev);        
    }

}