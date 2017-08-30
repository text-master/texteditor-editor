const socket = io('http://localhost:3000');
var topic = 'society';

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


$(document).ready(function() {
	var HelloButton = function(context) {
		var ui = $.summernote.ui;

		// create button
		var button = ui.button({
			contents: '<i class="fa fa-child"/> Summarize',
			tooltip: 'Summarize',
			click: function() {
				// invoke insertText method with 'hello' on editor module.
				var html = $('#summernote').summernote('code');
				socket.emit('summarize', html);
				// console.log($(".note-editable").text());	



				$('#myModal').modal('show');
				// context.invoke('editor.insertText', 'hello');
			}
		});

		return button.render(); // return button as jquery object
	}



	$('#summernote').summernote({
		height: 300, // set editor height
		// minHeight: null, // set minimum height of editor
		maxHeight: null, // set maximum height of editor
		focus: true,
		hint: {
			words: ['apple', 'orange', 'watermelon', 'lemon', 'arnold'],
			match: /\b(\w{1,})$/,
			search: function(keyword, callback) {

				var isUpperCase = (keyword.charAt(0) == keyword.charAt(0).toUpperCase());

				socket.emit('suggestion', {
					prefix: keyword.toLowerCase(),
					topic: topic
				})

				var self = this;
				socket.on('suggestion', function(wordList) {
					// console.log(wordList);
					var words = wordList.map(function(ea) {

							return isUpperCase ? capitalizeFirstLetter(ea.Word) : ea.Word
						})
						// console.log(words);
					callback($.grep(words, function(item) {
						return item.startsWith(keyword);
					}));
				})

			},

		},
		toolbar: [
			['style', ['style']],
			['font', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['table', ['table']],
			['insert', ['media', 'link', 'hr']],
			['view', ['fullscreen', 'codeview']],
			['mybutton', ['hello']],
			['help', ['help']],

		],

		buttons: {
			hello: HelloButton
		}
	});

	$("#summernote").summernote("fullscreen.toggle");

	document.body.addEventListener('keydown', function(e) {
		var text = $(".note-editable").text();
		if (e.keyCode === 32 || e.keyCode === 13) {
			// e.preventDefault()

			// console.log($("#summernote").code());



			// console.log(lastWord);

			axios.post('http://localhost:8080/classifier', text)
				.then(function(response) {
					// console.log(response.data);
					topic = response.data;
				})
				.catch(function(error) {
					console.log(error);
				});
		}

		if ((event.ctrlKey || event.metaKey) && event.which == 32) {

			var regex = /\w+/g;
			var words = text.match(regex)
			var lastWord = words[words.length - 1];

			// console.log(lastWord);

			socket.emit('follower', {
				preword: lastWord.toLowerCase(),
				topic: topic
			})



		}
	})
});


// Putting the socket receive function outside of the document event works!!!
socket.on('follower', function(word) {
	if (word) {
		$('#summernote').summernote('insertText', word[0].Follower);
	}
})

socket.on('summarize', function(summary) {
	console.log(summary);
	$("#summary").append(summary);
})