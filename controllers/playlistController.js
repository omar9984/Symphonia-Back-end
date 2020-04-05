const Playlist = require('./../models/playlistModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync').threeArg;
const User = require('./../models/userModel');
const Track = require('./../models/trackModel');

exports.getPlaylist = catchAsync(async (req, res, next) => {
  const check = await Playlist.findById(req.params.id);
  if (!check) {
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');
  }
  const features = new APIFeatures(Playlist.findById(req.params.id), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const playlist = await features.query;

  res.send(playlist);
});

exports.createPlaylist = catchAsync(async (req, res, next) => {
  let check = await User.User.findById(req.params.id);

  if (!check) return res.status(400).send('Invalid User ID');

  let playlist = new Playlist({
    collaborative: req.body.collaborative,
    name: req.body.name,
    description: req.body.description,
    images: req.body.images,
    owner: req.params.id,
    public: req.body.public,
    followers: req.body.followers,
    category: req.body.category
  });

  playlist = await playlist.save();

  let user = await User.User.findByIdAndUpdate(
    req.params.id,
    {
      $push: { ownedPlaylists: playlist._id }
    },
    { new: true }
  );
  await user.save();

  res.send(playlist);
});

exports.getUserPlaylists = catchAsync(async (req, res, next) => {
  const user = await User.User.findById(req.params.id);
  if (!user) return res.status(400).send('Invalid User ID');

  const features = new APIFeatures(
    Playlist.find().where({ owner: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const playlists = await features.query;

  //const playlists = await Playlist.find().where({ owner: req.params.id });
  res.send(playlists);
});

exports.getCurrentUserPlaylists = catchAsync(async (req, res, next) => {
  const playlist = await User.User.findById(req.user._id).select(
    'ownedPlaylists'
  );
  res.send(playlist);
});

exports.getPlaylistCoverImage = catchAsync(async (req, res, next) => {
  const images = await Playlist.findById(req.params.id).select('images');
  if (!images) {
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');
  }
  res.send(images);
});

exports.getPlaylistTracks = catchAsync(async (req, res, next) => {
  const check = await Playlist.findById(req.params.id);

  if (!check)
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');

  const features = new APIFeatures(
    Playlist.findById(req.params.id).select('tracks'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const tracks = await features.query;

  res.send(tracks);
});

exports.removePlaylistTracks = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.update(
    { _id: req.params.id },
    { $unset: { tracks: '' } },
    { multi: true }
  );

  res.send(playlist);
});

exports.addTracksToPlaylist = catchAsync(async (req, res, next) => {
  let check = await Playlist.findById(req.params.id);
  if (!check) {
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');
  }
  check = await Track.Track.findById(req.body.tracks);
  if (!check) {
    return res.status(400).send('The Track is not found.');
  }
  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    {
      $push: { tracks: req.body.tracks }
    },
    { new: true }
  );

  await playlist.save();

  res.send(playlist);
});

exports.changePlaylistDetails = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      collaborative: req.body.collaborative,
      public: req.body.public,
      description: req.body.description
    },
    { new: true }
  );
  if (!playlist) return res.status(404).send('This Playlist is not found!');
  await playlist.save();
  res.send(playlist);
});
exports.replacePlaylistTracks = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    {
      tracks: req.body.tracks
    },
    { new: true }
  );

  if (!playlist) {
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');
  }
  await playlist.save();
  res.send(playlist);
});

exports.uploadCustomPlaylistCoverImage = catchAsync(async (req, res, next) => {
  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    {
      images: req.body.images
    },
    { new: true }
  );

  if (!playlist) {
    return res
      .status(404)
      .send('The playlist with the given ID was not found.');
  }
  await playlist.save();
  res.send(playlist);
});
