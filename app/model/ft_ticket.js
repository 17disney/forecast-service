module.exports = app => {
  const mongoose = app.mongoose
  const FtTicketSchema = new mongoose.Schema(
    {
      date: { type: String },
      local: { type: String },
      dayList: { type: Array },
      teamNum: { type: Number },
      ticketNum: { type: Number },
      utime: Number
    },
    { versionKey: false }
  )

  return mongoose.model('FtTicket', FtTicketSchema, 'ft_tickets')
}
