
(function (window, $) {

    if (window != top) return;
    if (location.hostname !== 'opac.city.urayasu.chiba.jp') return;

    // console.log("main script");
    $('body').css('background-color', '#eceee4');

    var amazonIconUrl = '<img src="https://www.amazon.com/favicon.ico" style="width:18px;height:18px;" />';

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
    if (location.pathname == "/opw/OPW/OPWBESTREAD.CSP") {
        bestRead();
    }

    // 検索結果一覧
    if (location.pathname == "/opw/OPW/OPWSRCHLIST.CSP") {
        srchList();
    }


    function addColumn($headerColumn, $lineColumn, aRoot) {
        var authorIndex;
        console.log($headerColumn.parent().find('th').length);
        $headerColumn.parent().find('th').each(function () {
            if ($(this).find('span.smallfont').text() == '著者名▼') {
                authorIndex = $(this).index();
                console.log("index=" + authorIndex);
            }
        });
        $headerColumn.before('<th><span class="smallfont">Amazon</span></th>');


        $lineColumn.each(
            function () {
                var authorStr;
                // $(this).find('a').attr('target', '_blank');

                if (authorIndex != null) {
                    authorStr = $(this).siblings().eq(authorIndex - 1).text().replace(/／.*$/, '');
                } else {
                    authorStr = ''
                }
                // console.log('authorStr = ' + authorStr);
                $(this).before('<td><a href="' + aRoot + $(this).text() + authorStr + '" target="_blank" >' + amazonIconUrl + '</a></td>');
            }
        );
    }

    function myPage() {

        var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

        contentLend();
        contentRsv();
        contentKeep();
        contentRsvd();

        //貸出
        function contentLend() {
            console.log("Myページ-貸出");

            var $headerColumn = $('#ContentLend > form > div.container > table > tbody > tr.basemark > th:nth-child(3)');
            var $lineColumn = $('#ContentLend > form > div.container > table > tbody > tr > td:nth-child(3)');

            $("td[colspan=6]").attr('colspan', 7);
            addColumn($headerColumn, $lineColumn, aRoot);
        }

        //予約
        function contentRsv() {
            console.log("Myページ-予約");

            var $headerColumn = $('#ContentRsv > form > div.container > table > tbody > tr.basemark > th:nth-child(4)');
            var $lineColumn = $('#ContentRsv > form > div.container > table > tbody > tr > td:nth-child(4)');

            addColumn($headerColumn, $lineColumn, aRoot);

        }


        //Ｍｙリスト一覧
        function contentKeep() {
            console.log("Myページ-Myリスト一覧");

            var $headerColumn = $('#ContentKeep > form > div > div > div.col-xs-10 > table.table > tbody > tr.basemark > th:nth-child(4)');
            var $lineColumn = $('#ContentKeep > form > div > div > div.col-xs-10 > table.table > tbody > tr > td:nth-child(4)');

            addColumn($headerColumn, $lineColumn, aRoot);

        }

        //予約取消
        function contentRsvd() {
            console.log("Myページ-予約取り消し");

            var $headerColumn = $('#ContentRsvd > form > div.container > table > tbody > tr.basemark > th:nth-child(3)');
            var $lineColumn = $('#ContentRsvd > form > div.container > table > tbody > tr > td:nth-child(3)');

            addColumn($headerColumn, $lineColumn, aRoot);

        }

    }

    function bookDetail() {
        console.log("書誌詳細");

        var aRoot = 'https://www.amazon.co.jp/o/ASIN/';
        var asin = isbn2asin(getIsbn());

        var $linkSetPoint = $('#content > div:nth-child(1) > div.row > div.col-xs-2 > div');


        console.log('asin = ' + asin);

        var ancHtml = '<a href="' + aRoot + asin + '" class="list-group-item" style="padding-left: 25px;">' + amazonIconUrl + '</a>';
        //            anc.innerHTML = 'Amazon.co.jp\u3067\u30c1\u30a7\u30c3\u30af';
        $linkSetPoint.append(ancHtml);
        // isbn_node.appendChild(anc);
        // $anc.style.marginLeft = '10px';


        function getIsbn() {

            var isbn;
            $('#content > div:nth-child(1) > div.row > div.col-xs-8 > table > tbody > tr > th').each(function () {
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
        console.log("新着案内");

        var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

        var $headerColumn = $('#contents > form:nth-child(9) > div > table > tbody > tr.basemark > th:nth-child(3)');
        var $lineColumn = $('#contents > form:nth-child(9) > div > table > tbody > tr > td:nth-child(3)');

        $("td[colspan=7]").attr('colspan', 8);
        addColumn($headerColumn, $lineColumn, aRoot);
    }

    function bestRead() {
        console.log("ベストリーダー");
        var aRoot = 'https://www.amazon.co.jp/s/?keywords=';
        var $headerColumn = $('#contents > form:nth-child(9) > div > table.table > tbody > tr.basemark > th:nth-child(3)');
        var $lineColumn = $('#contents > form:nth-child(9) > div > table.table > tbody > tr > td:nth-child(3)');

        addColumn($headerColumn, $lineColumn, aRoot);
    }

    function bestOrder() {
        console.log("予約上位リスト");

        var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

        var $headerColumn = $('#contents > form:nth-child(9) > div > table.table > tbody > tr.basemark > th:nth-child(3)');
        var $lineColumn = $('#contents > form:nth-child(9) > div > table.table > tbody > tr > td:nth-child(3)');

        addColumn($headerColumn, $lineColumn, aRoot);
    }

    function srchList() {
        console.log("検索結果一覧");

        var aRoot = 'https://www.amazon.co.jp/s/?keywords=';

        var $headerColumn = $('table.table > tbody > tr.basemark > th:nth-child(2)');
        var $lineColumn = $('table.table > tbody > tr > td:nth-child(2)');

        addColumn($headerColumn, $lineColumn, aRoot);

    }


    function test() {
        console.log(isbn2asin('978-4-87311-618-1'));
    }

    function isbn2asin(isbnStr) {
        var asin;
        var isbn = isbnStr.trim().replace(/-/g, '');
        if (isbn.length == 13) {
            asin = isbn.substr(3, 9);
            var checkDigit = 0;
            for (var j = 0; j < asin.length; j++)
                checkDigit += parseInt(asin[j]) * (10 - j);
            checkDigit = (11 - checkDigit % 11) % 10;
            if (checkDigit === 0)
                asin = asin + 'X';
            else
                asin = asin + String(checkDigit);
        } else {
            asin = isbn;
        }
        return asin;
    }

    function u2a() {
        var bs = document.getElementsByTagName('strong');
        for (var i = 0; i < bs.length; i++) {
            if (bs[i].innerHTML == 'ISBN') {
                var A_ROOT = 'https://www.amazon.co.jp/o/ASIN/';
                var isbn_node = bs[i].parentNode.parentNode.nextSibling;
                var isbn = isbn_node.innerHTML.replace(/-/g, "");
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

})(window, $);
