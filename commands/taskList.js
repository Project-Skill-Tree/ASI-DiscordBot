const Skill = require("../objects/skill.js");
const Task = require("../objects/task.js");
const {MessageActionRow, MessageSelectMenu,MessageEmbed} = require("discord.js");
const romanise = require("../modules/romanNumeralHelper");

// Initialize task objects from skill objects.
// The Math.random() > 0.5 part just decides a random value for whether the task has been completed or not,
// as it's just a template for now.
const tasks = [ //eslint-disable-line no-unused-vars
  new Skill("reading.png","Reading", 4, "READ 30m", "day", "x1 MONTH",1, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", "day", "x1 MONTH",3 ,2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", "week", "x1 MONTH",5,100)
].map(skill => new Task(skill, Math.random() > 0.5));

/**
 * Test method to send a template task list
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // sends an embed containing all the tasks under two catagories, DAILY and NO DEADLINE
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" }); 
  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;
  const dailyTasks = tasks.filter(task => task.skill.time == "day");
  const otherTasks = tasks.filter(task => task.skill.time != "day");

  const dailyTaskStrings = dailyTasks.map((task, idx) => formatTask(task, idx));
  const otherTaskStrings = otherTasks.map((task, idx) => formatTask(task, idx + dailyTaskStrings.length));

  const embed = new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5")
    .addField("Daily Tasks", dailyTaskStrings.join("\n"))
    .addField("No Deadline", otherTaskStrings.join("\n"));
  const dropDownBox = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId("tasks-selection-box").setPlaceholder("Select a task").addOptions(
      tasks.map(
        tasks => {
          return {
            label: tasks.skill.title,
            description: tasks.skill.goal,
            value: tasks.skill.title
          };
        }
      )
    )
  );
  message.channel.send({ embeds: [embed], components: [dropDownBox] });
};

function formatTask(task, idx) {
  const completedEmoji = task.completed ? ":white_check_mark:": ":x:";
  const levelRoman = romanise(task.skill.level);
  const frequencyFormat = `${task.skill.frequency} ${task.skill.frequency === 1 ? "time" : "times"}/${task.skill.time}`;

  return `${completedEmoji} | **${idx + 1}. ${task.skill.title} ${levelRoman} (${frequencyFormat})**: ${task.skill.goal}`;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tasks",
  category: "Skill Tree",
  description: "daily task list [BETA]",
  usage: "tasks"
};
