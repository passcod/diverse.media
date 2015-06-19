# Orim

_Prototype._

## Dependencies

- [RethinkDB](http://rethinkdb.com)
- [iojs](http://iojs.org/)

## Develop

```bash
$ git clone git@github.com:passcod/orim.git
$ cd orim
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
You can deploy to alpha.orim.io (internal testing)
You can deploy to beta.orim.io (private beta)
You can deploy to orim.io (production)
```

Whenever:

```bash
# To deploy
$ npm run deploy
All tests pass
Deployed to alpha.orim.io (ad63nd)

# Or to production (if you have permission)
$ npm run deploy production
All tests pass
Deployed to orim.io (v1.2.3)
```
