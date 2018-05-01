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

  FtReportSchema.index({ local: 1, utime: -1 })
  FtReportSchema.index({ local: 1, date: -1 })

  return mongoose.model('FtReport', FtReportSchema, 'ft_reports')
}
