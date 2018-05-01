module.exports = app => {
  const mongoose = app.mongoose
  const FtReportSchema = new mongoose.Schema(
    {
      date: { type: Array },
      local: { type: String },
      data: { type: Array },
      utime: { type: Number }
    },
    { versionKey: false }
  )

  return mongoose.model('FtReport', FtReportSchema, 'ft_reports')
}
