
# public js files
JS_SRC_DIR = public/js/

# CSS Directory
CSS_DIR = public/css/

# LESS Directory
LESS_DIR = public/less/

# list of js files to merge
JS_FILES = \
	${JS_SRC_DIR}vendor/jquery-1.7.2.min.js\
	${JS_SRC_DIR}vendor/handlebars-1.0.0.beta.6.js\
	${JS_SRC_DIR}vendor/spine/spine.js\
	${JS_SRC_DIR}vendor/spine/route.js\
	${JS_SRC_DIR}vendor/spine/ajax.js\
	${JS_SRC_DIR}vendor/spine/list.js\
	${JS_SRC_DIR}vendor/spine/manager.js\
	${JS_SRC_DIR}vendor/spine/local.js\
	${JS_SRC_DIR}vendor/spine/relation.js\
	${JS_SRC_DIR}launchunit/jquery.notify.js\
	${JS_SRC_DIR}launchunit/mongo-view.js
	
# merge js files & minify
js:
	cat ${JS_FILES} > ${JS_SRC_DIR}app.js
	uglifyjs -o ${JS_SRC_DIR}app.min.js --no-mangle --no-squeeze ${JS_SRC_DIR}app.js
	rm ${JS_SRC_DIR}app.js

# minify css
css:
	lessc ${LESS_DIR}index.less ${CSS_DIR}app.min.css -compress

assets: js css

all: js css

# vows
test: vows test/*.test.js --spec

# run
run:
	node ./bin/mongo-view.js

.PHONY: js css assets test run
