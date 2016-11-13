var WordModel = Backbone.Model.extend({
	urlRoot: '/word'
});
	
$(function() {
  // Handler for .ready() called.
  //$(document).foundation();
  
  //addWord("word","english","hiragana","memo",0,0,0);
});

function addWord(word, english, hiragana, memo, id_category, id_tag, id_innyou) {
	var wordModel = new WordModel({
    word: word,
    english: english,
    hiragana: hiragana,
    memo: memo,
    id_category: id_category,
    id_tag: id_tag,
    id_innyou: id_innyou
	});
	wordModel.save();
}

function updateWord(id, word, english, hiragana, memo, id_category, id_tag, id_innyou) {
	var wordModel = new WordModel({
    _id: id,
    word: word,
    english: english,
    hiragana: hiragana,
    memo: memo,
    id_category: id_category,
    id_tag: id_tag,
    id_innyou: id_innyou
	});
	wordModel.save();
}

$(function(){
  // using default options
  $("#tree").fancytree({
    checkbox: true,
    titlesTabbable: true,        // Add all node titles to TAB chain
    extensions: ["table", "gridnav"],
    table: {
        checkboxColumnIdx: 0,    // render the checkboxes into the this column index (default: nodeColumnIdx)
        indentation: 16,         // indent every node level by 16px
        nodeColumnIdx: 2         // render node expander, icon, and title to this column (default: #0)
    },
    gridnav: {
        autofocusInput:   false, // Focus first embedded input if node gets activated
        handleCursorKeys: true   // Allow UP/DOWN in inputs to move to prev/next node
    },

//  renderStatusColumns: false,  // false: default renderer
                                 // true: generate renderColumns events, even for status nodes
                                 // function: specific callback for status nodes

    renderColumns: function(event, data) {
        var node = data.node,
            $tdList = $(node.tr).find(">td");

        // Make the title cell span the remaining columns, if it's a folder:
        if( node.isFolder() ) {
            $tdList.eq(2)
                .prop("colspan", 3)
                .nextAll().remove();
            return;
        }
        // (Column #0 is rendered by fancytree by adding the checkbox)

        // Column #1 should contain the index as plain text, e.g. '2.7.1'
        $tdList.eq(1)
            .text(node.getIndexHier())
            .addClass("alignRight");

        // (Column #2 is rendered by fancytree)

        // ...otherwise render remaining columns

        $tdList.eq(3).text(node.data.myCustomData);
        $tdList.eq(4).html("<input name='important' type='checkbox' value='" + node.key + "'>");
    }
  });
});