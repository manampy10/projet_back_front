const bcrypt = require("bcrypt");
const db = require("./models");

const createUser = async () => {
  //permet de chiffrer le mot de passe avec un salage de 10
  const hashedPassword = await bcrypt.hash("motdepasseUser123", 10);

  await db.users.create({
    email: "user.new@example.com",
    password: hashedPassword,
  });

  console.log("Utilisateur ajouté !");
};

//garantit que la table existe dans la bd
db.sequelize.sync().then(() => {
  createUser().then(() => process.exit());
});
