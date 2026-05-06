const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action:   { type: String, required: true }, // e.g. "RESUME_UPLOAD", "SCAN_COMPLETE"
    metadata: { type: mongoose.Schema.Types.Mixed },
    ip:       { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
