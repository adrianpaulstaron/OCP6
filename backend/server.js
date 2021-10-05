const app = require('./app');

try {
    app.listen(3000, () => {
      console.log("Serveur à l'écoute")
    })
  } catch (error) {
    console.error(error);
  }