install:
	npm ci

brain-games:
	npm run make-bin
	node bin/brain-games.js

brain-even:
	npm run make-bin
	node bin/brain-even.js

brain-calc:
	npm run make-bin
	node bin/brain-calc.js

brain-gcd:
	npm run make-bin
	node bin/brain-gcd.js

brain-progression:
	npm run make-bin
	node bin/brain-progression.js

brain-prime:
	npm run make-bin
	node bin/brain-prime.js

publish:
	npm publish --dry-run

lint:
	npx eslint .
