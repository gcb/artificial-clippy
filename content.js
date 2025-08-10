// project licensed AGPL-3.0 or newer.

function log(msg){
	console.info('📎💬', msg);
}
log('loading');

// perf throttling code mostly from https://raw.githubusercontent.com/qua3k/B-tch-to-Boss
// which is MPL-2.0 originally.

const CLIPPY_ID = 'widget-3f7a1e0c-8dea-4e96-912d-1ef07a9a9c2b'; // vibe coded. prompt: generate the most unique html id.

// throttling global variables
const replaceWaitTime = 115; // ms

// language configuration
let useLang = 'en';
let supportedLangs = ['en']; //, 'pt', 'fr', 'it'];
const htmlLang = document.documentElement.lang
	? document.documentElement.lang.slice(0,2).toLowerCase() : 'en';
log('htmlLang = '+htmlLang);
let firstLang = '';

// /* Matches whole words, with one group for First letter, another for rest.
//  * abc -> /\b(a)(bc)\b/
//  * */
// const caseSensitiveRegex = (input) => {
// 	let firstLetter = input[0];
// 	let rest = input.slice(1);
// 	return new RegExp(`\\b(${firstLetter})(${rest})\\b`, 'gi');
// };
// const caseSensitiveReplaceTuple = (input) => {
// 	let firstLetter = input[0];
// 	let firstLetterUpper = firstLetter.toUpperCase(); // we use ASCII because all first letters are ASCII.
// 	let rest = input.slice(1);
// 	return [`${firstLetter}${rest}`, `${firstLetterUpper}${rest}`];
// };

/*
 * model is n-obj for lang, with arrays of [ 0:regex, 1:replacement ]
 * If you need plurals, add `(s)?` ONLY ONCE! and use `$2` on replacement.
 * TODO: since most terms are proper names, wondering if we should just
 *       use lang on the replacement side?
 */
const data = {
	'en': [
		//[ /\bxxx\b/gi, 'xxx' ],

		[ /\bGoogle Assistant\b/gi, 'Evil Assistant' ],
		[ /\bAlexa\b/gi, 'Amazon Snitch' ],
		[ /\b(ai|a\.i\.) Assistant\b/gi, 'Clippy' ],

		[ /\b(BTC|Bit[- ]?coin)(s)?\b/gi, 'laundered drug money' ], // can we say that in a way that spell BTC? TODO:
		[ /\bblock[- ]?chain(s)?\b/gi, 'unoptimized public data-base$1' ],
		[ /\bstable[- ]?coin(s)?\b/gi, 'fiat-pegged-token$1' ],
		[ /\b(crypto[- ]?currency|stable[- ]?coin|crypto|stable) token(s)?\b/gi, 'carnival token$2' ],
		[ /\bcrypto[- ]?coin(s)?\b/gi, 'klepto-coin$1' ],
		[ /\b[ck]rypto[- ]?currenc(y|ies)\b/gi, 'klepto-currenc$1' ],
		[ /\bcrypto-friendly\b/gi, 'moraly bankrupt and corrupt' ],
		[ /\bcrypto trading\b/gi, 'gambling' ],
		[ /\bcrypto industry\b/gi, 'wellconnected scammers' ],
		[ /\b(the )?crypto space\b/gi, 'money laundering' ],
		[ /\b(Crypto and AI|crypto|ai) Czar\b/gi, 'hocuspocus misdirection clow' ],
		[ /\bworld[- ]?blockchain\b/gi, 'Retinal-scan-police-state™ database' ],
		[ /\b(world[- ]?coin|WLD)\b/gi, 'Retinal-scan-police-state™' ],
		[ /\bweb3(\.0)?\b/gi, 'fading investment scam' ],

		[ /\bartificial brain\b/gi, 'computer' ],
		[ /\b(ai|a\.i\.) boom\b/gi, 'latest investment scam' ],
		[ /\b(ai|a\.i\.) art\b/gi, 'AI art (heh)' ],
		[ /\babliterated\b/gi, 'Pornslop’ed' ],
		[ /\bgenerative (ai|a\.i\.|artificial intelligence) tools\b/gi, 'dopamine adiction enablers' ],
		[ /\bgenerative (ai|a\.i\.|artificial intelligence)\b/gi, 'Just one more prompt syndrome' ],
		[ /\bgenerative model(s)?\b/gi, 'wasteful bruteforce algorithm$1' ],
		[ /\bArtificial general intelligence\b/gi, 'shut-ins pipe-dream' ], // TODO: spell AGI
		[ /\bArtificial super[- ]?intelligence(s)?\b/gi, 'Artificial superincompetence$1' ], // TODO: spell AGI
		[ /\bartificial intelligence(s)?\b/gi, 'Artificial Incompetence$1' ],
		[ /\bprompt[- ]engineering\b/gi, 'semi-literate person' ],
		[ /\bGPT-(3|3.5|4|4o|4.1|4.1 mini|o3|o4-mini|2.5|2)\b/gi, 'Freemium Web-search Summarizer-$1' ],
		[ /\bchatbot(s)?\b/gi, 'ELIZA$1' ],
		[ /\b(chat[- ]?gpt|gpt)\b/gi, 'plagiarizer' ],
		[ /\b(claude ai|claude)\b/gi, 'dollar-store Borg' ],
		[ /\b(gemini|bard)\b/gi, 'Google-Surveillance' ], //this is though, because there's also a klepto scam called gemini. maybe we need an LLM to infer context?
    // TODO: avoid mistranslating when grok is used as a verb somehow...
		[ /\bgrok\b/gi, 'trans-man grok, formely Tay' ],
		[ /\bsiri\b/gi, 'Siri-v0.1' ], // must be before other siri jokes
		[ /\bapple intelligence\b/gi, 'Siri-v0.2' ],
		[ /\bvisual intelligence\b/gi, 'apple reverse image-search' ],
		[ /\bApple games\b/gi, 'iBigfoot' ],
		[ /\bcopilot\b/gi, 'Notepad with Clippy' ],
		[ /\bdeepseek\b/gi, 'made-in-china plagiarizer' ],
		[ /\b(large language model|llm)(s)?\b/gi, 'parrot$2 as a service' ],
		[ /\b(Generative pre[- ]?trained transformer)(s)?\b/gi, 'most resource-wasteful bidirectional encoder representation$2 from transformer$2' ],
		[ /\b(dall·e|dall-e|whisper|midjourney)\b/gi, 'Paintshop Pro Plugins' ],
		[ /\b(stable[- ]?diffusion)\b/gi, 'Pretrained-paintbrush.exe' ],
		[ /\b(sora)\b/gi, 'Youtube on Acid' ],
		[ /\b(ai|a\.i\.) token(s)?\b/gi, 'Slop Ration$2' ],
		[ /\b(ai|a\.i\.) generated?\b/gi, 'Slop' ],
		// vibe code. I think this is already dumb and depreciating enough.

		[ /\bGit[- ]?[Hh]ub\b/g, 'Microsoft SourceForge' ], // remember, it too can disapear.
		[ /\btesla fsd\b/gi, 'remote controlled killdozer' ],
		[ /\bbuilder ?ai\b/gi, 'Actually Indians' ],
		[ /\bmeta (ai|a\.i\.)\b/gi, 'Metabook AI' ],
		[ /\bwhatsapp\b/gi, 'Whatsbook' ],
		[ /\binstagram\b/gi, 'Instabook' ],
		[ /\bgoogle (ai|a\.i\.)\b/gi, 'Evil AI' ],
		[ /\bgoogle analytics\b/gi, 'Evil Spyware' ],
		[ /\bopenai\b/gi, 'forProfitAI Global, LLC' ],
		[ /\bpalantir\b/gi, 'Obvious CIA Plant Inc.' ],
		[ /\bParagon\b/g, 'Obvious Mossad Plant Inc.' ],
		[ /\bIn-Q-Tel\b/gi, 'emblezzement of taxpayer money' ],
		[ /\bpost[- ]9[-\/\.]11\b/gi, 'full on fascism' ],
		[ /\bOffice 365\b/gi, 'MS Office Online' ],
		[ /\bWindows ME\b/gi, 'Beta for Windows XP' ],
		[ /\bWindows Vista\b/gi, 'Beta for Windows 7' ],
		[ /\bWindows 8\b/gi, 'Beta for Windows 10' ],
		[ /\bWindows 8\.1\b/gi, 'Beta2 for Windows 10' ],
		[ /\bWindows 11\b/gi, 'Beta for Next Good Windows Version' ],
		[ /\b(twitter|twitter.com|x\.com)\b/gi, 'xitter' ],

		[ /\bbill gates\b/gi, 'William Henry Gates III' ],

	],
}

function replaceText(v) {
	const terms = data['en']; // hail the empire. /s TODO: i18n
	const len = terms.length;
	let i = 0;
	while( i < len ){
		const term = terms[i++];
		v = v.replace(term[0], term[1]);
	}
	return v;
}

function processQueue() {
	// clone queue
	let queue = replaceQueue.slice(0);
	// empty queue
	replaceQueue = [];
	// loop through clone
	queue.forEach( (mutations) => {
		replaceNodes(mutations);
	});
}

let replaceWait = false;
function setWait() {
	replaceWait = true;
	setTimeout(function () {
		replaceWait = false;
		timerCallback();
	}, replaceWaitTime);
}

function timerCallback() {
	if(replaceQueue.length > 0) {
		// if there are queued items, process them
		processQueue();
		// then set wait to do next batch
		setWait();
	} else {
		// if the queue has been empty for a full timer cycle
		// remove the wait time to process the next action
		replaceWait = false;
	}
}

let replaceQueue = [];
// The callback used for the document body and title observers
function observerCallback(mutations) {
	// add to queue
	replaceQueue.push(mutations);
	if(!replaceWait) {
		processQueue();
		setWait();
	} // else the queue will be processed when the timer finishes
}

function walk(rootNode) {
	//log(rootNode);
	// Find all the text nodes in rootNode
	let walker = document.createTreeWalker(
		rootNode,
		NodeFilter.SHOW_TEXT,
		{
			// acceptNode: function(node) {
			//     return /^(STYLE|SCRIPT)$/.test(node.parentElement.tagName)
			//             || /^\s*$/.test(node.data) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
			// }
			acceptNode: isForbiddenNode,
		},
		false
	),
	node;

	// Modify each text node's value
	while (node = walker.nextNode()) {
		handleText(node);
	}
}

let didChange = false;
function handleText(textNode) {
	//textNode.nodeValue = replaceText(textNode.nodeValue);
	const newText = replaceText(textNode.nodeValue);
	if( newText !== textNode.nodeValue ){
		textNode.nodeValue = newText;
		if( !didChange ){
			didChange = true;
			log('delusional double-speak detected.');
			log(textNode.nodeValue);
			log(newText);
		}
	}
}

// Returns true if a node should *not* be altered in any way
// TODO: return NodeFilter.FILTER_ACCEPT/FILTER_REJECT?
const forbiddenTagNames = ['textarea', 'input', 'script', 'noscript', 'template', 'style'];
function isForbiddenNode(node) {
	//log(node);
	if (node.isContentEditable) {
		return true;
	} else if (node.parentNode && node.parentNode.isContentEditable) {
		return true;
	} else if (node.tagName === undefined) {
		return true;
	} else {
		return forbiddenTagNames.includes(node.tagName.toLowerCase());
	}
}

// The callback used for the document body and head observers
function replaceNodes(mutations) {
	let i, node;
	mutations.forEach(function(mutation) {
		for (i = 0; i < mutation.addedNodes.length; i++) {
			node = mutation.addedNodes[i];
			if (isForbiddenNode(node)) {
				// Should never operate on user-editable content
				continue;
			} else if (node.nodeType === 3) {
				// Replace the text for text nodes
				handleText(node);
			} else {
				// Otherwise, find text nodes within the given node and replace text
				walk(node);
			}
		}
	});
}

// Walk the doc (document) body, replace the title, and observe the body and head
function walkAndObserve(doc) {
	let docHead = doc.getElementsByTagName('head')[0],
	observerConfig = {
		characterData: true,
		childList: true,
		subtree: true
	},
	bodyObserver, headObserver;

	// Do the initial text replacements in the document body and title
	walk(doc.body);
	doc.title = replaceText(doc.title);

	// Observe the body so that we replace text in any added/modified nodes
	bodyObserver = new MutationObserver(observerCallback);
	bodyObserver.observe(doc.body, observerConfig);

	// Observe the title so we can handle any modifications there
	if (docHead) {
		headObserver = new MutationObserver(observerCallback);
		headObserver.observe(docHead, observerConfig);
	}
}

// Runtime
// only if the lanuage is supported
if (supportedLangs.includes(htmlLang) === true) {
	log('I speak '+htmlLang);
	chrome.i18n.getAcceptLanguages(function(languages) {
		let firstLang = languages.length > 0 ? languages[0] : '';

		//if (htmlLang.startsWith('de')) {
		//	useLang = 'de';
		//} else if (htmlLang.startsWith('fr')) {
		//	useLang = 'fr';
		//} else if (htmlLang.startsWith('en')) {
		//	useLang = 'en';
		//} else if (firstLang.startsWith('de')) {
		//	useLang = 'de';
		//} else if (firstLang.startsWith('fr')) {
		//	useLang = 'fr';
		//}

		addClippy(document.body);
		setTimeout(function () {
			log(didChange ? 'get clippy-ed!' : 'no clippy for you!');
			if( didChange ) showClippy();
		}, replaceWaitTime);

		walkAndObserve(document);
	});
}else{
	log('dont speak '+htmlLang);
}

function showClippy(){
	document.getElementById(CLIPPY_ID).style.visibility = 'visible';
}

function addClippy(body){
	const img = document.createElement('div');
	img.appendChild(document.createTextNode('📎'));
	img.id = CLIPPY_ID;
	img.title = 'It looks like you’re deluding yourself. Would you like help? (this is a browser extension changing AI related text on your pages)'; // TODO: i18n
	img.style.position = 'fixed';
	img.style.right = '0';
	img.style.bottom = '0';
	img.style.fontSize = '3.5em'; // TODO: make this more resolution independent
	img.style.visibility = 'hidden';
	body.appendChild(img);
}
// TODO: use a clippy transparent gif. need to check licenses and all that.
//function addClippy(body){
//	const img = document.createElement('img');
//	img.id = CLIPPY_ID;
//	img.src = 'data:image/gif;base64...';
//	// nothing to see here
//	// this comment is just to unfuck your syntax highlight thx to the base64 above. u r welcome.
//	img.style.position = 'fixed';
//	img.style.right = '0';
//	img.style.bottom = '0';
//	img.style.maxWidth = '10em'; // make this more resolution independent
//	img.style.visibility = 'hidden';
//	body.appendChild(img);
//}
