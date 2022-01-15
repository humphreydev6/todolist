//jshint esversion:6

module.exports.getDate = function(){

  const today = new Date();

  const options = {
    weekday:"long",
    day: "numeric",
    month: "long",
  };

 return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function(){
  const today = new Date();

  const options = {
    month: "long",
  };

return today.toLocaleDateString("en-US", options);
}
