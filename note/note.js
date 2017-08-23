const socket = io('http://localhost:3000');
var topic = 'society';
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
					topic: topic
				})

				var self = this;
				socket.on('suggestion', function(wordList) {
					// console.log(wordList);
					var words = wordList.map(function(ea) {

						return ea.Word
					})
					// console.log(words);
					callback($.grep(words, function(item) {
						return item.startsWith(keyword);
					}));
				})

				// console.log(this.words);

				// callback($.grep(this.words, function(item) {
				// 	return item.startsWith(keyword);
				// }));
			},
			template: function(item) {
			
				return "<p>" + item + " " + "<i>" + topic + "</i>" + "</p>";
			},
		}
	});

	document.body.addEventListener('keydown', function(e) {
        if (e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) {
            // e.preventDefault()

            // console.log($("#summernote").code());

            axios.post('http://localhost:8080/classifier', $(".note-editable").text())
                .then(function(response) {
                    console.log(response.data);
                    topic = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    })
});

