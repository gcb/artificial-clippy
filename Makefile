build:
	zip -r -FS artificial-clippy.zip * --exclude '*.git*' --exclude '*.zip*'

clean:
	rm artificial-clippy.zip
