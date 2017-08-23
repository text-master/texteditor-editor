const socket = io('http://localhost:3000');

$(document).ready(function() {
	$('#summernote').summernote({
		height: 300, // set editor height
		// minHeight: null, // set minimum height of editor
		maxHeight: null, // set maximum height of editor
		focus: true,
		hint: {
			words: ['apple', 'orange', 'watermelon', 'lemon', 'arnold'],
			match: /\b(\w{1,})$/,
			search: function(keyword, callback) {

				socket.emit('suggestion', {
					prefix: keyword.toLowerCase(),
					topic: 'society'
				})

				var self = this;
				socket.on('suggestion', function(wordList) {
					console.log(wordList);
					var words = wordList.map(function(ea) {
					
						return ea.Word
					})
					console.log(words);
					callback($.grep(words, function(item) {
						return item.startsWith(keyword);
					}));
				})

				// console.log(this.words);

				// callback($.grep(this.words, function(item) {
				// 	return item.startsWith(keyword);
				// }));
			}
		}
	});
});