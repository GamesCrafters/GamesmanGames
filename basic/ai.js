//JS file for interactions between frontend and backend servers
var request_url = 'http://0.0.0.0:8081/GAME_NAME/getAIMove';


function ComputerPlayer(ai_type, game, startBoard){
    this.current_board = startBoard;
    this.prev_boards = [];
    this.ai_type = ai_type;
    this.game = game;
    this.request_url = request_url.replace('GAME_NAME', this.game);

    this.makeMove = function(callback){
        var url_args = window.location.pathname;
        url_args = url_args.slice(url_args.indexOf('?'));
        var params = {
            'ai_type': this.ai_type,
            'board': '"' + this.current_board.replace(/ /g, '_') + '"',
            'previous_boards': this.prevBoardStringify(),
            'url_arg': url_args,
            'game': this.game
        };
        $.ajax(this.request_url, 
            {
                dataType: 'JSON',
                data: params,
                success: function(server_return){
                    callback(server_return);
                }
            }
        );

    }

    this.update = function(new_board){
        this.prev_boards.unshift(this.current_board);
        this.current_board = new_board;
    }

    this.prevBoardStringify = function(){
        if(!this.prev_boards)
            return '[]';
        var str = '[';
        for(var i = 0; i < this.prev_boards.length; i++){
            str = str + '"' + this.prev_boards[i] + '"' + ',';
        }
        str.slice(0, str.length - 1);
        return str + ']';
    }
}
