const mongoose = require('mongoose');
const slugify = require('slugify');

const albumSchema = new mongoose.Schema(
  {
    album_type: {
      type: String,
      enum: {
        values: ['album', 'single', 'compilation'],
        message:
          'The type of the album: one of "album" , "single" , or "compilation".'
      }
    },
    collaborative: {
      type: Boolean
    },
    artists: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    available_markets: [String],
    copyright: new mongoose.Schema({
      text: String,
      type: {
        type: String,
        enum: {
          values: ['P', 'C'],
          message:
            'copy right type must be one of the following C = the copyright, P = the sound recording (performance) copyright.'
        }
      }
    }),
    release_date: {
      type: Date
    },
    release_date_precesion: {
      type: String,
      enum: {
        values: ['year', 'month', 'day'],
        message:
          'The precision with which release_date value is known: "year" , "month" , or "day".'
      }
    },
    tracks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track'
    },
    generes: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// Note:
// i didn't implemnent the uri field mostly itisn't needed

// the type field is required
albumSchema.virtual('type').get(function() {
  return 'album';
});
albumSchema.virtual('href').get(function() {
  const href = `url/${slugify(this.name, { lower: true })}`;
  return href;
});

const album = mongoose.model('Album', albumSchema);
exports.album = album;

//TODO: some fields not implemented yet because the need
// some not yet definded objects like
//1. imageObjectSche
//2. copyright object
//3. external id objects
//4. external url object
