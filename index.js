
if(window != top) return;
if (location.hostname == 'opac.city.urayasu.chiba.jp'){
    console.log("u2a");
    u2a();
}

console.log("main script");
 $('body').css('background-color','#b4e9cc');






function u2a() {

    var amazonIconUrl = '<img src="https://www.amazon.com/favicon.ico" style="width:18px;height:18px;" />';
    var bs = document.getElementsByTagName('strong');
    for (var i=0; i<bs.length; i++) {
        if (bs[i].innerHTML == 'ISBN') {
            var A_ROOT = 'https://www.amazon.co.jp/o/ASIN/';
            var isbn_node = bs[i].parentNode.parentNode.nextSibling;
            var isbn = isbn_node.innerHTML.replace( /-/g, "");
            var asin;
            if (isbn.length == 13) {
                asin = isbn.substr(3, 9);
                var checkdigit = 0;
                for(var j=0; j<asin.length; j++)
                    checkdigit += parseInt(asin[j]) * (10 - j);
                checkdigit = (11 - checkdigit % 11) % 10;
                if (checkdigit === 0)
                    asin = asin + 'X';
                else
                    asin = asin + String(checkdigit);
            } else
                asin = isbn;

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
