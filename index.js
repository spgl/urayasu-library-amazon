(function (window, $) {
  if (window != top) return;
  // このサイトはjQueryを読み込んでいるページとそうでないページがある
  if (!$) return;
  if (location.hostname !== 'opac.city.urayasu.chiba.jp') return;

  // console.log("main script");
  $('body').css('background-color', '#eceee4');

  var amazonIconUrl =
    '<img src="https://www.amazon.com/favicon.ico" style="width:18px;height:18px;" />';

  // Ｍｙページ(利用状況確認)
  if (location.pathname == '/opw/OPW/OPWUSERINFO.CSP') {
    myPage();
  }

  // 書誌詳細
  if (location.pathname == '/opw/OPW/OPWSRCHTYPE.CSP') {
    bookDetail();
  }
  // 予約上位リスト
  if (location.pathname == '/opw/OPW/OPWBESTORDER.CSP') {
    bestOrder();
  }

  // 新着案内
  if (location.pathname == '/opw/OPW/OPWNEWBOOK.CSP') {
    newBook();
  }

  // ベストリーダー
  if (location.pathname == '/opw/OPW/OPWBESTREAD.CSP') {
    bestRead();
  }

  // 検索結果一覧
  if (location.pathname == '/opw/OPW/OPWSRCHLIST.CSP') {
    srchList();
  }

  function addColumn($headerColumn, $lineColumn, aRoot) {
    var authorIndex;
    console.log($headerColumn.parent().find('th').length);
    $headerColumn
      .parent()
      .find('th')
      .each(function () {
        // 見出しにソートリンクの説明文が入るようになったため完全一致では拾えない
        if (/^著者名/.test($(this).find('span.smallfont').text().trim())) {
          authorIndex = $(this).index();
          console.log('index=' + authorIndex);
        }
      });
    $headerColumn.before(
      '<th  style="text-align:center;"><span class="smallfont">amzn</span></th>',
    );

    $lineColumn.each(function () {
      var authorStr;
      // $(this).find('a').attr('target', '_blank');

      if (authorIndex != null) {
        authorStr = $(this)
          .siblings()
          .eq(authorIndex - 1)
          .text()
          // 役割表記の区切りは全角/半角が混在する(洋書は半角が多い)
          .replace(/[／\/].*$/, '')
          .trim();
        // 書名の末尾空白に頼らず、明示的に区切る
        if (authorStr) authorStr = ' ' + authorStr;
      } else {
        authorStr = '';
      }
      // console.log('authorStr = ' + authorStr);
      $(this).before(
        '<td align="center"><a href="' +
          aRoot +
          $(this).text() +
          authorStr +
          '" target="_blank" >' +
          amazonIconUrl +
          '</a></td>',
      );
    });
  }

  function myPage() {
    var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

    contentLend();
    contentRsv();
    contentKeep();
    contentRsvd();

    //貸出
    function contentLend() {
      console.log('Myページ-貸出');

      var $headerColumn = $(
        '#ContentLend > form > div.row > table > tbody > tr.basemark > th:nth-child(3)',
      );
      var $lineColumn = $(
        '#ContentLend > form > div.row > table > tbody > tr > td:nth-child(3)',
      );

      $('td[colspan=6]').attr('colspan', 7);
      addColumn($headerColumn, $lineColumn, aRoot);
    }

    //予約
    function contentRsv() {
      console.log('Myページ-予約');

      var $headerColumn = $(
        '#ContentRsv > form > div.row > table > tbody > tr.basemark > th:nth-child(5)',
      );
      var $lineColumn = $(
        '#ContentRsv > form > div.row > table > tbody > tr > td:nth-child(5)',
      );

      addColumn($headerColumn, $lineColumn, aRoot);
    }

    //Ｍｙリスト一覧
    function contentKeep() {
      console.log('Myページ-Myリスト一覧');

      var $headerColumn = $(
        '#ContentKeep > form > div > div > div.col-xs-10 > table.table > tbody > tr.basemark > th:nth-child(4)',
      );
      var $lineColumn = $(
        '#ContentKeep > form > div > div > div.col-xs-10 > table.table > tbody > tr > td:nth-child(4)',
      );

      addColumn($headerColumn, $lineColumn, aRoot);
    }

    //予約取消
    function contentRsvd() {
      console.log('Myページ-予約取り消し');

      var $headerColumn = $(
        '#ContentRsvd > form > div.row > table > tbody > tr.basemark > th:nth-child(3)',
      );
      var $lineColumn = $(
        '#ContentRsvd > form > div.row > table > tbody > tr > td:nth-child(3)',
      );

      addColumn($headerColumn, $lineColumn, aRoot);
    }
  }

  function bookDetail() {
    console.log('書誌詳細');

    var aRoot = 'https://www.amazon.co.jp/o/ASIN/';
    var COVER_WIDTH = 150;
    var COVER_HEIGHT = 200;

    // var $linkSetPoint = $('#content > div:nth-child(1) > div.row > div.col-xs-2 > div');
    var $linkSetPoint = $('ul.ul-list-group');

    injectCoverStyle();

    var isbn = getIsbn();

    // 雑誌・視聴覚資料などISBNを持たない書誌がある。Amazon側の商品を特定できないので
    // リンクは張らず、書影が「無い」ことだけを示す
    if (!isbn) {
      console.log('ISBNなし');
      showNoImage(appendCoverBox(null));
      return;
    }

    var asin = isbn2asin(isbn);

    // 979始まりのISBNなどASINを導出できない場合がある。
    // 誤ったASINでリンクを張ると存在しない商品ページに飛ぶので、リンクは張らない
    if (!asin) {
      console.log('ASINを導出できないISBN: ' + isbn);
      showNoImage(appendCoverBox(null));
      return;
    }

    console.log('asin = ' + asin);

    var ancHtml =
      '<li><div style="padding: 5px;"><a href="' +
      aRoot +
      asin +
      '" class="btn btn-success linkbtn" >' +
      amazonIconUrl +
      '</a></div></li>';
    $linkSetPoint.append(ancHtml);

    // 国会図書館の書影APIは2026-03-31で提供終了したのでAmazonの書影を使う。
    // .09.はロケール(日本)、LZZZZZZZは大サイズを指す。公式に文書化された仕様ではないので
    // 予告なく壊れうるが、その場合も書影が出なくなるだけで上のAmazonリンクは残る。
    var picUrl = `https://m.media-amazon.com/images/P/${asin}.09.LZZZZZZZ.jpg`;
    console.log(`picUrl=${picUrl}`);

    // 書影が無いASINには1x1の透過GIFが返る。先に枠を置いてスピナーを見せ、
    // 読み込み結果に応じて書影かNO IMAGEに差し替える。何も出ないと
    // 「待ち」なのか「無い」のか区別がつかないため
    var $coverBox = appendCoverBox(asin);

    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth <= 1) {
        console.log('書影なし');
        showNoImage($coverBox);
        return;
      }
      $coverBox.replaceWith(`<img src="${picUrl}" width="${COVER_WIDTH}" />`);
    };
    probe.onerror = function () {
      console.log('書影の取得に失敗');
      showNoImage($coverBox);
    };
    probe.src = picUrl;

    // 書影の枠を置く。linkAsinがnullのときは飛び先が無いのでリンクにしない
    function appendCoverBox(linkAsin) {
      var box = '<div class="u2a-cover-box"><div class="u2a-spinner"></div></div>';
      $linkSetPoint.append(
        linkAsin
          ? `<li><div style="padding: 5px;"><a href="${aRoot}${linkAsin}">${box}</a></div></li>`
          : `<li><div style="padding: 5px;">${box}</div></li>`,
      );
      return $linkSetPoint.find('.u2a-cover-box').last();
    }

    function showNoImage($box) {
      $box.html('<span class="u2a-noimage">NO IMAGE</span>');
    }

    function injectCoverStyle() {
      $('head').append(
        `<style>
        .u2a-cover-box {
          width: ${COVER_WIDTH}px;
          height: ${COVER_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background: #e8e8e4;
          border: 1px solid #ccc;
        }
        .u2a-noimage {
          color: #999;
          font: bold 14px/1 sans-serif;
          letter-spacing: 1px;
        }
        .u2a-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #ccc;
          border-top-color: #888;
          border-radius: 50%;
          animation: u2a-spin 0.8s linear infinite;
        }
        @keyframes u2a-spin {
          to {
            transform: rotate(360deg);
          }
        }
      </style>`,
      );
    }

    // 書誌情報の見出しからISBN行を探す。長い階層指定は壊れやすいのでth全体を走査する
    // (このページでISBNを含むthは1つだけ)
    function getIsbn() {
      var isbn = null;
      $('th').each(function () {
        if (!/ISBN/.test($(this).text())) return;
        // セルに注記などが混ざることがあるのでISBNらしき部分だけを取り出す。
        // ハイフンは全角・ダッシュ類も除く。13桁を先に見るのは、資料バーコードのような
        // 数字列を10桁側で拾わないため
        var norm = $(this)
          .parent()
          .find('td')
          .text()
          .replace(/[-‐-―−－]/g, '');
        var m = norm.match(/97[89]\d{10}/) || norm.match(/\d{9}[\dX]/i);
        if (m) {
          isbn = m[0];
          return false;
        }
      });
      return isbn;
    }
  }

  function newBook() {
    console.log('新着案内');

    var aRoot = 'https://www.amazon.co.jp/s/?keywords=';
    var $headerColumn = $(
      '#contents > form > div > div > div > table > tbody > tr.basemark > th:nth-child(3)',
    );
    var $lineColumn = $(
      '#contents > form > div > div > div > table > tbody > tr > td:nth-child(3)',
    );
    addColumn($headerColumn, $lineColumn, aRoot);
  }

  function bestRead() {
    console.log('ベストリーダー');
    var aRoot = 'https://www.amazon.co.jp/s/?keywords=';
    var $headerColumn = $(
      '#contents > form > div > div > div > table > tbody > tr.basemark > th:nth-child(3)',
    );
    var $lineColumn = $(
      '#contents > form > div > div > div > table > tbody > tr > td:nth-child(3)',
    );

    addColumn($headerColumn, $lineColumn, aRoot);
  }

  function bestOrder() {
    console.log('予約上位リスト');

    var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

    var $headerColumn = $(
      '#contents > form > div > div > div > table > tbody > tr.basemark > th:nth-child(3)',
    );
    var $lineColumn = $(
      '#contents > form > div > div > div > table > tbody > tr > td:nth-child(3)',
    );

    addColumn($headerColumn, $lineColumn, aRoot);
  }

  function srchList() {
    console.log('検索結果一覧');

    var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

    var $headerColumn = $(
      'table.table > tbody > tr.basemark > th:nth-child(2)',
    );
    var $lineColumn = $('table.table > tbody > tr > td:nth-child(2)');
    console.log('$headerColumn:' + $headerColumn.length);
    console.log('$lineColumn:' + $lineColumn.length);
    addColumn($headerColumn, $lineColumn, aRoot);
  }

  // ASINを導出できないときはnullを返す。呼び出し側でリンクを出さない判断に使う
  function isbn2asin(isbnStr) {
    var isbn = String(isbnStr).trim().replace(/-/g, '').toUpperCase();

    if (/^\d{13}$/.test(isbn)) {
      // ISBN-13からISBN-10に変換できるのは978で始まるものだけ。979にISBN-10は存在せず、
      // AmazonのASINもISBNから導出できないので、桁数だけで変換すると実在しない値になる
      if (isbn.indexOf('978') !== 0) return null;

      var body = isbn.substr(3, 9);
      var checkDigit = 0;
      for (var j = 0; j < body.length; j++)
        checkDigit += parseInt(body[j], 10) * (10 - j);
      // 検査数字は加重和の11の補数。10のときだけXになり、0はそのまま0
      checkDigit = (11 - (checkDigit % 11)) % 11;
      return body + (checkDigit === 10 ? 'X' : String(checkDigit));
    }

    // ISBN-10はそのままASINとして使える
    if (/^\d{9}[\dX]$/.test(isbn)) return isbn;

    return null;
  }
})(
  window,
  // 素の $ だとjQueryが無いフレーム(OPWAFFILIATE.CSPのiframe等)で
  // ReferenceErrorになる。プロパティ参照なら未定義でも例外にならない
  window.jQuery,
);
