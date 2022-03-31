const Profile = require("../objects/profile");
const Skill = require("../objects/skill");

const skills = [new Skill("reading.png","READING", 3, "READ 30m", "DAILY", "x1 MONTH", 800),
  new Skill("meditation.png","MEDITATION", 5, "Meditate for 30m", "DAILY", "x1 MONTH", 2000)];


exports.run = async (client, message, args, level) => {
  const profile = new Profile(message.author.name, level, 350, skills);
  profile.send(message.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "profile",
  category: "Skill Tree",
  description: "Displays your character profile, XP, level, badges and more",
  usage: "profile"
};
