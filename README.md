# Diverse.media

[![Github |](https://img.shields.io/github/tag/passcod/diverse.media.svg?style=flat-square)](https://github.com/passcod/diverse.media)[![ Build Status |](https://img.shields.io/travis/passcod/diverse.media.svg?style=flat-square)](https://travis-ci.org/passcod/diverse.media)[![ Code Quality |](https://img.shields.io/codeclimate/github/passcod/diverse.media.svg?style=flat-square)](https://codeclimate.com/github/passcod/diverse.media)[![ Dependency Status |](https://img.shields.io/david/passcod/diverse.media.svg?style=flat-square)](https://david-dm.org/passcod/diverse.media)[![ MIT License |](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://passcod.mit-license.org)[![ Code of Conduct](https://img.shields.io/badge/contributor-covenant-123456.svg?style=flat-square)](http://contributor-covenant.org/version/1/1/0/)

_A curated library of diverse authors and artists._

## Dependencies

- [RethinkDB](http://rethinkdb.com)
- [iojs](http://iojs.org/)

## Develop

```bash
$ git clone git@github.com:passcod/diverse.media.git
$ cd diverse.media
$ atom .
$ npm run watch
```

## Deploy

Just once:

```bash
# Sends your SSH public key to a contributor on Slack so they can grant access
$ npm run deploy auth
Requesting deploy rights...
```

After that:

```bash
# Checks your access to remote deployment tools
$ npm run deploy check
You can deploy to alpha.diverse.media (internal testing)
You can deploy to beta.diverse.media (private beta)
You can deploy to diverse.media (production)
```

Whenever:

```bash
# To deploy
$ npm run deploy
All tests pass
Deployed to alpha.diverse.media (ad63nd)

# Or to production (if you have permission)
$ npm run deploy production
All tests pass
Deployed to diverse.media (v1.2.3)
```
