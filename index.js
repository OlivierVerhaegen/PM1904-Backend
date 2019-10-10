const express = require('express');
const app = express();


app.get('/', (req, res) => {
    console.warn('Someone is trying to access the root route:' + req.connection);
});


app.listen(9000, () => {
    console.log("Server is up an listening on port 9000 ...");
});