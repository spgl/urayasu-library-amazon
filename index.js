(function (window, $) {
  if (window != top) return;
  // このサイトはjQueryを読み込んでいるページとそうでないページがある
  if (!$) return;
  if (location.hostname !== 'opac.city.urayasu.chiba.jp') return;

  // console.log("main script");
  $('body').css('background-color', '#eceee4');

  var amazonIconUrl =
    '<img src="https://www.amazon.com/favicon.ico" style="width:18px;height:18px;" />';

  // test();

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
          .replace(/／.*$/, '')
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
    var isbn = getIsbn();

    // \u96d1\u8a8c\u30fb\u8996\u8074\u899a\u8cc7\u6599\u306a\u3069ISBN\u3092\u6301\u305f\u306a\u3044\u66f8\u8a8c\u304c\u3042\u308b
    if (!isbn) {
      console.log('ISBN\u306a\u3057');
      return;
    }

    var asin = isbn2asin(isbn);

    // 979始まりのISBNなどASINを導出できない場合がある。
    // 誤ったASINでリンクを張ると存在しない商品ページに飛ぶので、何も出さない
    if (!asin) {
      console.log('ASINを導出できないISBN: ' + isbn);
      return;
    }

    // var $linkSetPoint = $('#content > div:nth-child(1) > div.row > div.col-xs-2 > div');
    var $linkSetPoint = $('ul.ul-list-group');

    console.log('asin = ' + asin);

    var ancHtml =
      '<li><div style="padding: 5px;"><a href="' +
      aRoot +
      asin +
      '" class="btn btn-success linkbtn" >' +
      amazonIconUrl +
      '</a></div></li>';
    //            anc.innerHTML = 'Amazon.co.jp\u3067\u30c1\u30a7\u30c3\u30af';
    $linkSetPoint.append(ancHtml);

    // \u56fd\u4f1a\u56f3\u66f8\u9928\u306e\u66f8\u5f71API\u306f2026-03-31\u3067\u63d0\u4f9b\u7d42\u4e86\u3057\u305f\u306e\u3067Amazon\u306e\u66f8\u5f71\u3092\u4f7f\u3046\u3002
    // .09.\u306f\u30ed\u30b1\u30fc\u30eb(\u65e5\u672c)\u3001LZZZZZZZ\u306f\u5927\u30b5\u30a4\u30ba\u3092\u6307\u3059\u3002\u516c\u5f0f\u306b\u6587\u66f8\u5316\u3055\u308c\u305f\u4ed5\u69d8\u3067\u306f\u306a\u3044\u306e\u3067
    // \u4e88\u544a\u306a\u304f\u58ca\u308c\u3046\u308b\u304c\u3001\u305d\u306e\u5834\u5408\u3082\u66f8\u5f71\u304c\u51fa\u306a\u304f\u306a\u308b\u3060\u3051\u3067\u4e0a\u306eAmazon\u30ea\u30f3\u30af\u306f\u6b8b\u308b\u3002
    var picUrl = `https://m.media-amazon.com/images/P/${asin}.09.LZZZZZZZ.jpg`;
    console.log(`picUrl=${picUrl}`);

    // \u66f8\u5f71\u304c\u7121\u3044ASIN\u306b\u306f1x1\u306e\u900f\u904eGIF\u304c\u8fd4\u308b\u3002\u5148\u306b\u8aad\u3093\u3067\u6709\u7121\u3092\u78ba\u304b\u3081\u3066\u304b\u3089\u8cbc\u308b
    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth <= 1) {
        console.log('\u66f8\u5f71\u306a\u3057');
        return;
      }
      $linkSetPoint.append(
        `<li><div style="padding: 5px;"><a href="${aRoot}${asin}"><img src="${picUrl}" width="150" /></a></div></li>`,
      );
    };
    probe.src = picUrl;

    // $anc.style.marginLeft = '10px';

    function getIsbn() {
      var isbn;
      $(
        '#content > div:nth-child(1) > div.row > div.col-xs-8 > table > tbody > tr > th',
      ).each(function () {
        if ($(this).text() == 'ISBN') {
          isbn = $(this).parent().find('td').text();
          // console.log($(this).parent().find('td').text());
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

  function test() {
    console.log(isbn2asin('978-4-87311-618-1'));
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

  function u2a() {
    var bs = document.getElementsByTagName('strong');
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].innerHTML == 'ISBN') {
        var A_ROOT = 'https://www.amazon.co.jp/o/ASIN/';
        var isbn_node = bs[i].parentNode.parentNode.nextSibling;
        var isbn = isbn_node.innerHTML.replace(/-/g, '');
        var asin;
        asin = isbn2asin(isbn);

        var anc = document.createElement('a');
        anc.setAttribute('href', A_ROOT + asin);
        anc.style.marginLeft = '10px';
        //            anc.innerHTML = 'Amazon.co.jp\u3067\u30c1\u30a7\u30c3\u30af';
        anc.innerHTML = amazonIconUrl;
        isbn_node.appendChild(anc);
        break;
      }
    }
  }
})(
  window,
  // 素の $ だとjQueryが無いフレーム(OPWAFFILIATE.CSPのiframe等)で
  // ReferenceErrorになる。プロパティ参照なら未定義でも例外にならない
  window.jQuery,
);
