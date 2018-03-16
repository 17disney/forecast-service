module.exports = app => {
  const mongoose = app.mongoose
  const FtParkSchema = new mongoose.Schema({
    date: { type: String },
    local: { type: String },
    id: { type: String },

    markFt: { type: Number },
    markMath: { type: Array },

    flowFt: { type: Number },
    flowMath: { type: Array },

    utime: { type: Number }
  })

  return mongoose.model('FtPark', DsParkSchema, 'Ft_parks')
}
