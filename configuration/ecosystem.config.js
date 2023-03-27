module.exports = {
    apps : [{
      name: 'wat-sourcing-backend',
      script: 'app.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      error_file : "./logs/err.log",
      // out_file : "./logs/out.log",
      env: {
        NODE_ENV: 'development',      //pm2 start ecosystem.config.js --env development
        instances: 1,
      },
      env_production: {
        NODE_ENV: 'production',       //pm2 start ecosystem.config.js --env production
        instances  : 4,
        exec_mode  : "cluster"
      }
    }],
  
    // deploy : {
    //   production : {
    //     user : 'node',
    //     host : '212.83.163.1',
    //     ref  : 'origin/master',
    //     repo : 'git@github.com:repo.git',
    //     path : '/var/www/production',
    //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    //   }
    // }
  };
  