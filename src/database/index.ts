import mongoose from "mongoose"

import config from '../config/database'

class Database {
    connection: any
  
    constructor() {
        this.connection = mongoose.connect(config.url as string)
    }
}


export default new Database();