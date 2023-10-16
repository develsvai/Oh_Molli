import { MongoClient } from 'mongodb'
const url = 'mongodb+srv://developsvai5096:6fmScJWm6NhIfu33@cluster0.pgo8iui.mongodb.net/'

const options = { useNewUrlParser: true }
let connectDB

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {

    global._mongo = new MongoClient(url, {
      useUnifiedTopology: true, // 이 옵션을 활성화합니다.
      
    }).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url,{
    useUnifiedTopology: true, // 이 옵션을 활성화합니다.
  }).connect()
}
export { connectDB }
