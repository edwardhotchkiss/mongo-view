
0.4.2 / 2012-06-24 
==================

  * [docs] updated app screenshot in markdown
  * [design, cache]
  * [cleanup]

0.4.1 / 2012-06-23 
==================

  * [node] no dice on 0.4.x, require >= 0.6.x

0.4.0 / 2012-06-23 
==================

  * [design] stylized nicely
  * [design/integration] wrapped up @kevbook's new UI
  * [breadcrumbs] display counts
  * [breadcrumbs] refresh
  * [merge] @kevbook thanks
  * [node] dont be a dictator, just require 0.4.0
  * added github fork me
  * new UI + Index.html cleanup (less in new dir)
  * [docs] info for production and redis session store
  * [fix] self.db = db || self.db :P

0.3.3 / 2012-06-18 
==================

  * [minor] fix breadcrumb js build
  * [minor] fix for breadcrumb track backs

0.3.2 / 2012-06-18 
==================

  * [node] make compatible with 0.6.x

0.3.1 / 2012-06-18 
==================

  * [mongodb] breadcrumbs in header
  * [controllers] assets
  * [screens] added 0.3.0 screen

0.3.0 / 2012-06-16 
==================

  * [dist] version for initial release
  * [mongodb] use /test
  * [major] prep for release
  * [minor] fixed disconnect bug, designc changes
  * [mongodb] disconnect method
  * [style] most new UI implemented
  * [partials] minor styling changes
  * [spine] use navTo fn to maintain state
  * [ui, style] begin implementing new
  * [NODE_ENV] assets
  * [Makefile] for asset bundling
  * [css] placeholder .gitignore
  * [docs] improved info
  * [REST] updated for mongodb vs. mongoose
  * Merge branch 'develop'
  * [major] final before new skin
  * [sessions] redis
  * [connection] bullet proof routing with connection checking
  * [Makefile] added for production deployments
  * [debug] dont log items
  * [mongodb] simply use mongodb-native, vs piggybacking overhead on mongoose
  * [major] connect, list collections, view collection, view individual item
  * [spine] .clear
  * [rewrite] use spine, mustache, and dev asset builder
  * [templating] remove jq.tmpl, use handlebars
  * [legacy] remove old controllers
  * [spine] init
  * [assets] rm
  * [assets] package .js

0.2.1 / 2012-06-10 
==================

  * [lets enhance that] middleware
  * [mongodb] display individual item
  * [mongodb] add count
  * [collection] individual working
  * [middleware] checkConnected

0.2.0 / 2012-06-10 
==================

  * [dist] version bump
  * [major] working
  * [minor=] cleanup
  * [views] use ejs
  * [github] use github fork me image
  * [syntax] on tests
  * [error, syntax] better error tracking, syntax
  * [docs] keep on gh-pages
  * [bin] nicer args
  * [main] removed
  * [package] update all module deps to latest stable
  * [package] remove main
  * [license] update
  * [node] bump engine dep to 0.6.19
  * [travis] only test 0.6.x+

0.1.5 / 2012-03-22 
==================

  * [engine] req 0.6.13
  * [package] added homepage and bugs
  * [deps] bump request to 2.9.153
  * [deps] bump jade to 021.0
  * [deps] bump express to 2.5.8
  * [deps] bump mongoose to 2.5.12

0.1.4 / 2012-03-11 
==================

  * [bin] commander fix!
  * need to rework mongoose-paginate, engine 0.4.x isnt supported
  * add jade, fix travis
  * [dist] bump to 0.1.3
  * rebuild `Paige`
  * remove ejs
  * fix conflict
  * [design] finish stylizing for `less-boilerplate`
  * [design] use jade
  * [design] use gray github banner

0.1.3 / 2012-01-20 
==================

  * [design] use less-boilerplate
  * [docs] `paige`
  * [REST] DELETE /database/:database/collections/:collection/delete
  * [REST] POST /database/:database/collections/:collection/update
  * [REST] PUT /database/:database/collections/:collection/create
  * [REST] GET /database/:database/collections/:collection/find/:params
  * [REST] GET /database/:database/collections/:collection/all

0.1.2 / 2012-01-16 
==================

  * [design] stylize count
  * [core] display document item .count()
  * dont log the collection
  * [design] vertical-scroll forced
  * [README] formating
  * [tests] check http server with request
  * expose httpServer
  * [package] add max presman to contributors
  * [tests] add `request` for devDependencies
  * use process.env.MONGO_DB vs. assuming localhost
  * added license to README
  * remove extranneous js
  * format locals for readability
  * session.secret is process.env.SECRET OR _ `change_me!`

0.1.1 / 2011-12-30 
==================

  * version bump
  * add closing tags to meta info in head
 

0.1.0 / 2011-12-30 
==================

  * version bump
  * removed comma from package
  * Merge pull request #1 from MaxPresman/master
  * quick test
  * forgot to remove a testing function
  * made the ribbon less noticible
  * a bit more stylish URL convention

0.0.3 / 2011-12-27 
==================

  * email

0.0.2 / 2011-12-27 
==================

  * version bump
  * __dirname, /views
  * resize screenshot
  * better sized image
  * screenshot on readme
  * add screenshot to /public/images/screens for readme
  * changelog for 0.0.1

0.0.1 / 2011-12-27 
==================

  * fix changelog, version bump to a basic release for a viewer
  * display object ids within a collection
  * checkConnected() express middleware
  * readme formating
  * stylized links to collections
  * format collections object
  * use ejs, views. list collections. sessions.
  * list collections
  * changelog

0.0.0 / 2011-12-26 
==================

  * util.inspect mongoose object
  * design changes, added app.post(/
  * design
  * config.json
  * nicely styled
  * CoreJS added, bg image, github fork, css, creative-commons from mongodb.org
  * added .travis.yml [0.4.x - 0.8.0, only test `master` branch]
  * added /public/index.html, added run for bin/ and app.js
  * added express to deps, added app.js to run the mongodb-viewer
  * added colors and /bin
  * skeleton with tests, travis, changelog
