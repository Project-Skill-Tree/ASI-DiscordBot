const axios = require("axios");
const Skill = require("../objects/skill");
const User = require("../objects/user");
const Task = require("../objects/task");
const {authErrMsg} = require("./AuthHelper");

/** @module APIHelper */

function getKey() {
  return process.env.API_KEY;
}

/**
 * Get JSON object containing skills from database
 * @param {String} discordid - discordid of the user
 * @return UserID
 * @exports getSkills
 */
exports.createAccount = function(discordid) {
  return axios
    .post(process.env.API_URL + "users/registerDiscord/", {
      discordid: discordid,
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Authorise the user as existing in the database
 * @param discordid
 * @param {?Channel=} channel - Channel to send error message in, if undefined, don't send
 * @param callback - Callback with param true/false for user found/not
 */
exports.auth = function(discordid, channel=null, callback) {
  axios
    .get(process.env.API_URL + "users/loginDiscord/", {
      headers: {
        api_key: getKey(),
        discordid: discordid,
      }
    }).then(res => {
      authErrMsg(res.data._id, channel, callback);
    });
};
  


/**
 * Authorise the user as existing in the database
 * @param discordid
 * @param gender
 * @param difficulty
 * @param dms_enabled
 * @param callback - Callback with param true/false for user found/not
 */
exports.createUser = function(discordid,gender,difficulty,dms_enabled,callback) {
  axios
    .post(process.env.API_URL + "users/registerDiscord/",{
      discordid: discordid,
      gender: gender,
      difficulty: difficulty,
      dms_enabled:dms_enabled}, {
      headers: {
        api_key: getKey(),
      }
    }).then(res => {
      if (res.data.userFound) {
        callback();
      }
    });
};

/**
 * Updating a user in the database
 * @param discordid
 * @param gender
 * @param difficulty 
 * @param dms_enabled
 **/
exports.updateUser =function(discordid, gender, difficulty, dms_enabled) {
  return axios
    .post(process.env.API_URL + "users/updateUser/", {
      discordid: discordid,
      gender:gender,
      difficulty:difficulty,
      dms_enabled:dms_enabled
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Get JSON object for user given discord ID
 * @param user - discord user object
 * @param callback - method to pass user object to
 * @param onError - method to call after user not found or method error
 * @exports getSkills
 */
exports.profile = function(user, callback) {
  axios
    .get(process.env.API_URL + "users/profile/", {
      headers: {
        api_key: getKey(),
        discordid: user.id
      }
    }).then(res => {
      res.data.user["username"] = user.username;
      callback(User.create(res.data));
    }).catch(err => {
      console.log(err);
    });
};

/**
 * Get JSON object containing skills from database
 * @return {Promise<AxiosResponse<any>>}
 * @exports getSkills
 */
exports.getSkills = function(callback) {
  axios.get(process.env.API_URL + "skills", {
    headers: {
      api_key: getKey()
    }
  }).then(res => {
    const skills = res.data.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(`Error fetching skills: ${res.status}`);
  });
};

/**
 * Get JSON object containing tasks that the user has accepted from the database
 * @return {Promise<AxiosResponse<any>>}
 * @exports getTasksInProgress
 */
exports.getTasksInProgress = function(userID,callback) {
  axios.get(process.env.API_URL + "tasks/currentTasks", {
    headers: {
      userID: userID,
      api_key: getKey()
    }
  }).then((res)=>{
    const tasks = res.data.map(data => Task.create(data)); 
    console.log(tasks);
    callback(tasks);
  }).catch(res => {
    console.log(res);
  });
};

/**
 * Get JSON object containing skills that the user has accepted from the database
 * @return {Promise<AxiosResponse<any>>}
 * @exports getSkillsInProgress
 */
exports.getSkillsInProgress = function(userID,callback) {
  axios.get(process.env.API_URL + "skills/skillsInProgress", {
    headers: {
      userID: userID,
      api_key: getKey()
    }
  }).then((res)=>{
    const skills = res.data;
    callback(skills);
  }).catch(res => {
    console.log(res);
  });
};

/**
 * Get JSON object containing skills available to a given user from database
 * @param UserID
 * @param callback - function to run, passes list of skills
 * @exports getSkills
 */
exports.getAvailableSkills = function(userID, callback) {
  axios.get(process.env.API_URL + "skills/available", {
    headers: {
      userID: userID,
      api_key: getKey()
    }
  }).then(res => {
    const skills = res.data.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(`Error fetching skills: ${res.status}`);
  });
};

/**
 * Get the JSON object for a skill with a given id from the database
 * @param {string} id - The ObjectID of the skill to be requested
 * @param callback
 * @returns Skill or Null
 */
exports.getSkill = function(id, callback) {
  axios
    .get(process.env.API_URL + "skills/?id="+id, {
      headers: {
        api_key: getKey()
      }
    }).then(res => {
      console.log(`statusCode: ${res.status}`);
      callback(Skill.create(res.data));
    }).catch(() => {
      callback(null);
    });
};

/**
 * Adds the skill to the users active skills
 * @param id - discord id of the user
 * @param title - title of the skill to start
 * @param level - level of the skill to start
 */
exports.startSkill = function(id, title, level) {
  axios
    .post(process.env.API_URL + "skills/startSkill", {
      discordid: id,
      title: title,
      level: level,
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Sets the completed state of a user's skill task for a given date
 * @param id - discord username
 * @param task - task object to update
 * @param date - "today" or "yesterday"
 * @return {Promise<AxiosResponse<any>>}
 */
exports.updateTask = function(userid, skill, date) {
  return axios
    .post(process.env.API_URL + "tasks/updateTask", {
      userid: userid,
      skillid: skill.id,
      completed: skill.completed,
      date: date
    },{
      headers: {
        api_key: getKey()
      }
    });
};
/**
 * 
 * @param xp - amount of xp to add 
 * @param discordid - the discord ID of the user 
 * @returns {Promise<AxiosResponse<any>>}
 */
exports.addXP = function(xp, discordid) {
  return axios
    .post(process.env.API_URL + "users/addXP", {
      xp: parseInt(xp),
      discordid: discordid
    },{
      headers: {
        api_key: getKey()
      }
    });
}

/**
 * Gets a users skills and returns them as task objects with "completed" field
 * @param id - discordID of the user
 * @param date - date of the tasks to get
 * @return {Promise<AxiosResponse<any>>}
 */
exports.getTasks = function(id, date) {
  return axios
    .get(process.env.API_URL + "currentTasks", {
      headers: {
        api_key: getKey(),
        discordid: id,
        date: date,
      }
    });
};