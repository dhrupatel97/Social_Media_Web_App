if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://Admin:firstproduct2018@ds125851.mlab.com:25851/my_vidjot_prod'}
}
else {
  module.exports = {mongoURI:'mongodb://localhost:27017/Vidjot'}
}
