build: artificial-clippy.zip
artificial-clippy.zip: manifest.json content.js
	zip -r -FS artificial-clippy.zip * --exclude '*.git*' --exclude '*.zip*'

.PHONY: clean
clean:
	rm -f artificial-clippy.zip
