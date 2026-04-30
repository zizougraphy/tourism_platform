const jwt = require('./utils/jwt');
const token = jwt.generateToken({ id: 5, email: 'tours@adventure.dz', role: 'service_provider' });
console.log(token);
