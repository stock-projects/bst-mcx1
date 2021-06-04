const mongoose = require('mongoose')
mongoose.connect(process.env.db_connectivity,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
})
