'use strict';

module.exports = {
    db: "mongodb://topzone.dyndns.org:28017",
    app: {
      name: "concordchurch.me - Staging",
			instance_no: 0
    },
    mysql: {
			env: "staging",
      dbUsername: "id",
      dbPassword: "pswd",
      dbHost: "localhost",
			port: 3306,
			poolUseYn: true        
    },
    logging: {
			client: true,      
			sql: true,      
			debug: true,      
			input: true,      
			output: true      
    },
    redis: {
      host: "52.0.156.206",
      port: 6379      
    },
    nodetime: {
        useYn: false
    }
}

// local, staging, production
process.env['NODE_ENV'] = 'staging';

