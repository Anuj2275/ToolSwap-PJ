import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Good', 'Fair'], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  availability: { type: Boolean, default: true },
  location: {
    // This is a special GeoJSON object for storing geospatial data.
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, { timestamps: true });


toolSchema.index({ location: '2dsphere' });

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;