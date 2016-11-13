var express = require('express');
var router = express.Router();

const Datastore = require('nedb');
const db = {
  word: new Datastore({ 
    filename: 'data/word.db',
    autoload: true
  }),
  category: new Datastore({ 
    filename: 'data/category.db',
    autoload: true
  }),
  tag: new Datastore({ 
    filename: 'data/tag.db',
    autoload: true
  })
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { pretty: true });
});

// 最新の1件を取得
router.get('/word/', function(req, res, next) {
  var wordList;
  db.word.find({}, function (err, docs) {
    wordList = docs;
    res.render('index', { pretty: true, word:wordList[0].word });
  });
});

// 追加および更新
router.post('/word/', function(req, res, next) {
  var msg = "";
  if(req.params != null) {
    var doc = {
      word: req.body.word,
      english: req.body.english,
      hiragana: req.body.hiragana,
      memo: req.body.memo,
      id_category: req.body.id_category,
      id_tag: req.body.id_tag,
      id_innyou: req.body.id_innyou
    };
    if(req.body._id != null && req.body._id != "") {
      // _idがある場合は、更新処理
      db.word.update({_id: req.body._id}, {$set:doc}, {}, function (err, numReplaced) {});
      msg = "更新しました。";
    } else {
      // _idがない場合は、追加処理
      db.word.insert(doc, function (err, newDoc) {});
      msg = "追加しました。";
    }

    // カテゴリが新規追加されている場合
    if(req.body.add_category != null) {
      db.category.find({_id: req.body.id_category}, function(err, docs){
        if(docs != null) {
          var category = {
            title: req.body.title_category,
            memo: req.body.memo_category
          };
          db.category.insert(category, function(err, docs){});
        }
      });
    }

    // タグが新規追加されている場合
    if(req.body.add_tag != null) {
      db.tag.find({_id: req.body.id_tag}, function(err, docs){
        if(docs != null) {
          var tag = {
            title: req.body.title_tag,
            memo: req.body.memo_tag
          };
          db.tag.insert(tag, function(err, docs){});
        }
      });
    }
  }

  res.render('index', { pretty: true, msg:msg });
});

router.get('/word/:word', function(req, res, next) {
  // 入力データを追加する。
  if(req.params != null) {
    var doc = {
       word: req.params.word
    };

    var wordList;
    db.word.find(doc, function (err, docs) {
      wordList = docs;
    });
  }

  res.render('index', { pretty: true, data:wordList[0] });
});

module.exports = router;
