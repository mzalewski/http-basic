'use strict';

var assert = require('assert');
var request = require('../');

request('GET', 'http://example.com', function (err, res) {
  if (err) throw err;

  console.log('response A');
  assert(res.statusCode === 200);
  res.body.resume();
});

request('GET', 'https://www.promisejs.org', function (err, res) {
  if (err) throw err;

  console.log('response B');
  assert(res.statusCode === 200);
  res.body.resume();
});

request('GET', 'https://promisejs.org', {followRedirects: true}, function (err, res) {
  if (err) throw err;

  console.log('response C');
  assert(res.statusCode === 200);
  res.body.resume();
});

var CACHED = 'https://www.promisejs.org/polyfills/promise-done-1.0.0.js';

request('GET', CACHED, {cache: 'memory'}, function (err, res) {
  if (err) throw err;

  console.log('response D (populate cache)');
  assert(res.statusCode === 200);
  res.body.on('data', function () {});
  res.body.on('end', function () {
    request('GET', CACHED, {cache: 'memory'}, function (err, res) {
      if (err) throw err;

      console.log('response E (from cache)');
      assert(res.fromCache === true);
      assert(res.fromNotModified === false);
      assert(res.statusCode === 200);
      res.body.resume();
    });
  });
});



request('GET', CACHED, {cache: 'file'}, function (err, res) {
  if (err) throw err;

  console.log('response G (populate file cache)');
  assert(res.statusCode === 200);
  res.body.on('data', function () {});
  res.body.on('end', function () {
    setTimeout(function () {
      request('GET', CACHED, {cache: 'file'}, function (err, res) {
        if (err) throw err;

        console.log('response H (from file cache)');
        assert(res.fromCache === true);
        assert(res.fromNotModified === false);
        assert(res.statusCode === 200);
        res.body.resume();
      });
    }, 1000);
  });
});