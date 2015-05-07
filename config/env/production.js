'use strict';

module.exports = {
    db: "mongodb://localhost/meanstack",
    app: {
      name: "concordchurch.me - Development",
			instance_no: 0
    },
    mysql: {
      env: "production",
      dbUsername: "id",
      dbPassword: "pswd",
      dbHost: "localhost",
      port: 3306,
			poolUseYn: true        
    },
    redis: {
      host: "52.0.156.206",
      port: 6379      
    },
    logging: {
			client: true,      
			sql: true,      
			debug: true,      
			input: true,      
			output: true      
    },
    nodetime: {
        useYn: true
    }
}

// local, staging, production
process.env['NODE_ENV'] = 'production';

