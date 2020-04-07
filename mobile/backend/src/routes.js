const {Router} = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

//HTTP Methods: GET, POST, PUT, DELETE

//Parameter types:

//Query Params: request.query (Filters, ordination, pagination)
//Route Params: request.params (Identify a resource when editing and/or deleting)
//Body: request.body (Data to create or edit a register)

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;