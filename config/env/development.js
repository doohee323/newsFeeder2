'use strict';

module.exports = {
    db: "mongodb://topzone.dyndns.org:28017",
    app: {
      name: "concordchurch.me - Development",
			instance_no: 0
    },
    mysql: {
      env: "local",
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
        useYn: false
    }
}

