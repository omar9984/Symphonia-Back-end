const express = require('express');
const searchHistory = require('../utils/searchMiddleware');
const playlistController = require('../controllers/playlistController');
const authController = require('../controllers/authController');
const followController = require('../controllers/followController');

const router = express.Router();

router.get(
  '/rand',
  authController.protect(false),
  playlistController.getRandomPlaylist
);
router.get(
  '/:id',
  authController.protect(false),
  playlistController.getPlaylist
);
router.get(
  '/:id/images',
  authController.protect(false),
  playlistController.getPlaylistCoverImage
);
router.get(
  '/:id/tracks',
  authController.protect(false),
  searchHistory.saveSearchHistory,
  playlistController.getPlaylistTracks
);

router.use(authController.protect(true));

router.delete('/:id/tracks', playlistController.removePlaylistTracks);
router.post('/:id/tracks', playlistController.addTracksToPlaylist);
router.patch('/:id/', playlistController.changePlaylistDetails);
router.delete('/:id', playlistController.deletePlaylist);
router.patch('/:id/tracks', playlistController.maintainPlaylistTracks);
router.patch('/:id/images', playlistController.uploadCustomPlaylistCoverImage);

// section: follow routes

router.get('/:id/followers/contains', followController.checkIfPlaylistFollower);
router.put('/:id/followers', followController.followPlaylist);
router.delete('/:id/followers', followController.unfollowPlaylist);

module.exports = router;
