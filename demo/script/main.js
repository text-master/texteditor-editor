// Add your javascript here


const socket = io('http://localhost:3000');


var langTools = ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
var topic = ''
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
        // console.log(prefix)


        socket.emit('suggestion', {
            prefix: prefix,
            topic: topic
        })
        socket.on('suggestion', function(wordList) {
            // console.log(wordList);
            callback(null, wordList.map(function(ea) {
                return {
                    name: ea.Word,
                    value: ea.Word,
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

            // const myApi = axios.create({
            //     baseURL: 'http://localhost:8080/classifier',
            //     timeout: 10000,
            //     transformRequest: [(data) => JSON.stringify(data)],
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json',
            //     }
            // });

            // myApi.post('http://localhost:8080/classifier', {
            //         sentence: editor.getValue()
            //     })
            //     .then(function(response) {
            //         console.log(response);
            //     })
            //     .catch(function(error) {
            //         console.log(error);
            //     });


            // axios({
            //         method: 'post',
            //         url: 'http://localhost:8080/classifier',
            //         data: {
            //             sentence: editor.getValue()
            //         },
            //         timeout: 10000,
            //         transformRequest: [(data) => {
            //             return JSON.stringify(data)
            //         }],
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         }
            //     })
            //     .then(function(response) {
            //         console.log(response);
            //     })
            //     .catch(function(error) {
            //         console.log(error);
            //     });

            // var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
            // xmlhttp.open("POST", "http://localhost:8080/classifier");
            // // xmlhttp.setRequestHeader("Content-Type", "application/json");
            // // xmlhttp.send(JSON.stringify({
            // //     sentence: editor.getValue()
            // // }));
            // xmlhttp.send({setence: editor.getValue()});



        }
    })
    /*editor.on('changeSession', function(e) {
        // console.log('test');
        console.log(editor.getSelectedText());
    })

    document.getElementById('editor').addEventListener("dblclick", function(e) {

        console.log(editor.getSelectedText());
    });*/