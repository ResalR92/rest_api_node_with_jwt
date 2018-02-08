const env = process.env.NODE_ENV || "development";
// console.log("env *****", env);

// ============================
// Improving App Configuration
// ============================
if(env === "development" || env === "test") {
  const config = require('./config.json');
  const envConfig = config[env];
  // console.log(Object.keys(envConfig)); // [ 'PORT', 'MONGODB_URI' ]
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; // assigning process ENV
  });

}
// if (env === "development") {
//   process.env.PORT = 3000; // port default for default
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
// } else if (env === "test") {
//   process.env.PORT = 3000; // port default for default
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
// }
