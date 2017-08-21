// Add your javascript here


const socket = io('http://localhost:3000');


var langTools = ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
var topic = ''
    // editor.setTheme("ace/theme/twilight");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


editor.setOptions({
    enableBasicAutocompletion: true
});
document.getElementById('editor').style.fontSize = '16px';
// uses http://rhymebrain.com/api.html
var rhymeCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
            callback(null, []);
            return
        }
        // console.log(prefix)



        socket.emit('suggestion', {
            prefix: prefix.toLowerCase(),
            topic: topic
        })
        socket.on('suggestion', function(wordList) {
            // console.log(wordList);
            var isUpperCase = (prefix.charAt(0) == prefix.charAt(0).toUpperCase());

            callback(null, wordList.map(function(ea) {
                return {
                    name: ea.Word,
                    value: isUpperCase ? capitalizeFirstLetter(ea.Word) : ea.Word,
                    score: ea.Count,
                    meta: topic
                }
            }));
        })

    }
}
langTools.addCompleter(rhymeCompleter);


// editor.commands.addCommand({
//     name: 'myCommand',
//     bindKey: {win: 'space',  mac: 'space'},
//     exec: function(editor) {
//         console.log(editor.getValue());
//     },
//     readOnly: true // false if this command should not apply in readOnly mode
// });


document.body.addEventListener('keydown', function(e) {
        if (e.keyCode === 0 || e.keyCode === 32) {
            // e.preventDefault()

            axios.post('http://localhost:8080/classifier', editor.getValue())
                .then(function(response) {
                    console.log(response.data);
                    topic = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    })
    /*editor.on('changeSession', function(e) {
        // console.log('test');
        console.log(editor.getSelectedText());
    })

    document.getElementById('editor').addEventListener("dblclick", function(e) {

        console.log(editor.getSelectedText());
    });*/