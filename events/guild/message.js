module.exports = (client, Discord, message) => {
    try{
        // command.execute(client, message, Discord);
    } catch(err){
        message.reply("There was an error trying to execute this command!");
        console.log(err);
    }
}
