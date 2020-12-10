if (process.env.NODE_ENV === 'production') {
   module.exports = { mongoURI: 'mongodb+srv://siero:cCFzVgKMi3Vz4pS@cluster0.p4ti9.mongodb.net/vidjot-prod?retryWrites=true&w=majority' } 
} else {
   module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
}