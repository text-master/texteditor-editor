// Add your javascript here


const socket = io('http://localhost:3000');


var langTools = ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
// editor.setTheme("ace/theme/twilight");



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
        console.log(prefix)


        socket.emit('suggestion', {prefix: prefix, topic: 'business'})
        socket.on('suggestion', function(wordList) {
            console.log(wordList);
            callback(null, wordList.map(function(ea) {
                return {
                    name: ea.Word,
                    value: ea.Word,
                    score: ea.Count,
                    meta: "tech"
                }
            }));
        })

    }
}
langTools.addCompleter(rhymeCompleter);

editor.on('changeSession', function(e) {
    // console.log('test');
    console.log(editor.getSelectedText());
})

document.getElementById('editor').addEventListener("dblclick", function(e) {

    console.log(editor.getSelectedText());
});