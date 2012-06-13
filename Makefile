
# public js files
JS_SRC_DIR = public/js/

# CSS Directory
CSS_DIR = public/css/

# LESS Directory
LESS_DIR = public/less/

# list of js files to merge
js:
JS_FILES = \
	${JS_SRC_DIR}vendor/jquery-1.7.2.min.js\
	${JS_SRC_DIR}vendor/jquery.mustache.js\
	${JS_SRC_DIR}vendor/spine/spine.js\
	${JS_SRC_DIR}vendor/spine/route.js\
	${JS_SRC_DIR}vendor/spine/ajax.js\
	${JS_SRC_DIR}vendor/spine/list.js\
	${JS_SRC_DIR}vendor/spine/manager.js\
	${JS_SRC_DIR}vendor/spine/local.js\
	${JS_SRC_DIR}vendor/spine/relation.js\
	${JS_SRC_DIR}mongo-view.js
	
# merge js files & minify
js:
	cat ${JS_FILES} > ${JS_DIR}main.js
	uglifyjs -o ${JS_DIR}app.min.js --no-mangle --no-squeeze ${JS_DIR}main.js
	rm ${JS_DIR}main.js

# minify css
css:
	lessc ${LESS_DIR}main.less ${CSS_DIR}app.min.css -compress

# vows
test: vows test/*.test.js --spec
	
.PHONY: js css test