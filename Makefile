FILE := build/index.html
SRC := $(shell find src/ public/ -type f)

deploy: $(FILE)
	firebase deploy -P quiklyrics-go

$(FILE): $(SRC)
	npm run build