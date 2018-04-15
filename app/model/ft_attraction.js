module.exports = app => {
  const mongoose = app.mongoose
  const FtAttractionSchema = new mongoose.Schema(
    {
      local: { type: String },
      id: { type: String },

      mathMax: { type: Array },
      mathAvg: { type: Array },

      utime: { type: Number }
    },
    { versionKey: false }
  )

  return mongoose.model('FtAttractoin', FtAttractionSchema, 'ft_attractions')
}
