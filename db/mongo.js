const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const clientOption = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOption);
        console.log("MongoDB connecté avec succès");
    } catch (e) {
        console.error("Erreur de connexion MongoDB:", e);
        throw e; 
    }
};
