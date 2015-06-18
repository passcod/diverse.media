# Miro

_Prototype._

## Dependencies

- [RethinkDB](http://rethinkdb.com)
- [iojs](http://iojs.org/)

## Develop

```bash
$ git clone git@bitbucket.org/mckaysoftware/miro.git
$ cd miro
$ atom .
$ npm run watch
```

## Deploy

Just once:

```bash
# Sends your SSH public key to a coworker on Slack so they can grant access
$ npm run deploy auth
Requesting deploy rights...
```

After that:

```bash
# Checks your access to remote deployment tools
$ npm run deploy check
You can deploy to alpha.withmiro.com (internal testing)
You can deploy to beta.withmiro.com (private beta)
You can deploy to withmiro.com (production)
```

Whenever:

```bash
# To deploy
$ npm run deploy
All tests pass
Deployed to alpha.withmiro.com (ad63nd)

# Or to production (if you have permission)
$ npm run deploy production
All tests pass
Deployed to withmiro.com (v1.2.3)
```
