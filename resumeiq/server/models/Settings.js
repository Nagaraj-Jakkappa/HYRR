const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  freePlanScans: { type: Number, default: 3 },
  proPlanScans: { type: Number, default: 50 },
  careerPlusPlanScans: { type: Number, default: 9999 },
  allowNewRegistrations: { type: Boolean, default: true }
}, { timestamps: true });

// Helper to get or create the single settings document
settingsSchema.statics.getGlobalSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
