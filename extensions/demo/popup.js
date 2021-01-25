/*
// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const a1 = "中东区《严格版》" + "《Strict  Vers.》" + "Middle East";
const a2 = "欧非区《偏严版》" + "Europe and Africa" + "Turkey";
const a3 = "欧非区《标准版》" + "Europe and Africa" + "《Standard Vers.》";
const a4 = "俄罗斯区《标准版》" + " Russian region" + "《Standard Vers.》";
const a5 = "拉美区《标准版》" + "Latin America 《Standard Vers.》";
const a6 = "英语区《标准版》" + "English region" + "《Standard Vers.》";
const a7 = "澳新区《偏严版》" + " Australia + New Zealand" + "《 Medium Vers.》";
const a8 = "印度区《偏严版》" + "IN etc" + "《 Medium Vers.》";
const a9 = "东南亚区《标准版》" + "SEA 《Standard Vers.》";
const a10 = "日韩区《偏严版》" + "Korea and Japan" + "《 Medium Vers.》";
const a11 = "华语区《偏严版》" + "Chinese-speaking area" + "《 Medium Vers.》";
const a12 = "普通区域《标准版》" + "General countries" + "《Standard Vers.》";
const content = "";
let myMap;
document.onkeyup = function(e) {
    //点击C键开始循环查询直到出现数据为止
    if(e && (e.keyCode == 18 || e.keyCode == 113)){//按下Alt键、F2
        alert(buildAlert())
    }
}
function buildAlert() {
    var tag = document.getElementsByTagName("p")[5].innerText.slice(-2);
    tag = document.getElementsByTagName("p")[5].innerText + "\\n" + getMap().get(tag) + "\\n" + document.getElementsByTagName("p")[4].innerText;
    return tag
}

function getMap() {
    if (!myMap || myMap.size < 1) {
        myMap = new Map();
        myMap.set("", "没得");
        myMap.set("AE", a1);
        myMap.set("SA", a1);
        myMap.set("KW", a1);
        myMap.set("LB", a1);
        myMap.set("IQ", a1);
        myMap.set("PS/BL", a1);
        myMap.set("PS", a1);
        myMap.set("BL", a1);
        myMap.set("JO", a1);
        myMap.set("YE", a1);
        myMap.set("OM", a1);
        myMap.set("SY", a1);
        myMap.set("QA", a1);
        myMap.set("BH", a1);
        myMap.set("EG", a1);
        myMap.set("SD", a1);
        myMap.set("LY", a1);
        myMap.set("TN", a1);
        myMap.set("DZ", a1);
        myMap.set("MA", a1);
        myMap.set("SO", a1);
        myMap.set("IR", a1);
        myMap.set("IL", a1);
        myMap.set("MR", a1);
        myMap.set("DJ", a1);
        myMap.set("KM", a1);
        myMap.set("PK", a1);
        myMap.set("BD", a1);
        myMap.set("TR", a2);
        myMap.set("FR", a3);
        myMap.set("DE", a3);
        myMap.set("IT", a3);
        myMap.set("PL", a3);
        myMap.set("ZA", a3);
        myMap.set("BE", a3);
        myMap.set("NL", a3);
        myMap.set("SE", a3);
        myMap.set("AT", a3);
        myMap.set("RO", a3);
        myMap.set("CH", a3);
        myMap.set("SK", a3);
        myMap.set("BA", a3);
        myMap.set("RU", a4);
        myMap.set("UA", a4);
        myMap.set("BY", a4);
        myMap.set("GE", a4);
        myMap.set("AM", a4);
        myMap.set("AZ", a4);
        myMap.set("TJ", a4);
        myMap.set("TM", a4);
        myMap.set("KG", a4);
        myMap.set("UZ", a4);
        myMap.set("KZ", a4);
        myMap.set("BR", a5 + " 巴西");
        myMap.set("MX", a5 + " 西语区");
        myMap.set("AR", a5 + " 西语区");
        myMap.set("CO", a5 + " 西语区");
        myMap.set("BO", a5 + " 西语区");
        myMap.set("CL", a5 + " 西语区");
        myMap.set("CR", a5 + " 西语区");
        myMap.set("DO", a5 + " 西语区");
        myMap.set("EC", a5 + " 西语区");
        myMap.set("SV", a5 + " 西语区");
        myMap.set("GT", a5 + " 西语区");
        myMap.set("HN", a5 + " 西语区");
        myMap.set("NI", a5 + " 西语区");
        myMap.set("PA", a5 + " 西语区");
        myMap.set("PY", a5 + " 西语区");
        myMap.set("PE", a5 + " 西语区");
        myMap.set("ES", a5 + " 西语区");
        myMap.set("UY", a5 + " 西语区");
        myMap.set("VE", a5 + " 西语区");
        myMap.set("PR", a5 + " 西语区");
        myMap.set("US", a6);
        myMap.set("GB", a6);
        myMap.set("CA", a6);
        myMap.set("AU", a7);
        myMap.set("NZ", a7);
        myMap.set("IN", a8);
        myMap.set("ID", a9);
        myMap.set("PH", a9);
        myMap.set("TH", a9);
        myMap.set("VN", a9);
        myMap.set("KH", a9);
        myMap.set("MM", a9);
        myMap.set("NP", a9);
        myMap.set("MY", a9 + " （执行偏严版）");
        myMap.set("JP", a10);
        myMap.set("KR", a10);
        myMap.set("CN", a11);
        myMap.set("TW", a11);
        myMap.set("HK", a11);
        myMap.set("MO", a11);
        myMap.set("SG", a11);
        myMap.set("AF", a12);
        myMap.set("BN", a12 + "（执行偏严版）");
        myMap.set("CY", a12);
        myMap.set("KP", a12);
        myMap.set("LK", a12);
        myMap.set("MN", a12);
        myMap.set("MV", a12);
        myMap.set("BT", a12);
        myMap.set("TL", a12);
        myMap.set("AD", a12);
        myMap.set("AL", a12);
        myMap.set("AT", a12);
        myMap.set("BE", a12);
        myMap.set("BG", a12);
        myMap.set("CH", a12);
        myMap.set("DK", a12);
        myMap.set("EE", a12);
        myMap.set("FI", a12);
        myMap.set("GR", a12);
        myMap.set("HU", a12);
        myMap.set("IE", a12);
        myMap.set("IS", a12);
        myMap.set("LA", a12);
        myMap.set("LI", a12);
        myMap.set("LT", a12);
        myMap.set("LU", a12);
        myMap.set("LV", a12);
        myMap.set("MD", a12);
        myMap.set("NL", a12);
        myMap.set("MT", a12);
        myMap.set("NO", a12);
        myMap.set("AS", a12);
        myMap.set("LV", a12);
        myMap.set("KY", a12);
        myMap.set("MQ", a12);
        myMap.set("VC", a12);
        myMap.set("BM", a12);
        myMap.set("CW", a12);
        myMap.set("VG", a12);
        myMap.set("AO", a12);
        myMap.set("BF", a12);
        myMap.set("BI", a12);
        myMap.set("BJ", a12);
        myMap.set("CD", a12);
        myMap.set("CF", a12);
        myMap.set("CG", a12);
        myMap.set("CM", a12);
        myMap.set("ET", a12);
        myMap.set("GA", a12);
        myMap.set("GH", a12);
        myMap.set("GM", a12);
        myMap.set("GN", a12);
        myMap.set("KE", a12);
        myMap.set("LR", a12);
        myMap.set("LS", a12);
        myMap.set("MG", a12);
        myMap.set("ML", a12);
        myMap.set("MU", a12);
        myMap.set("UG", a12);
        myMap.set("MW", a12);
        myMap.set("TZ", a12);
        myMap.set("MZ", a12);
        myMap.set("NA", a12);
        myMap.set("NE", a12);
        myMap.set("SC", a12);
        myMap.set("SZ", a12);
        myMap.set("ZM", a12);
        myMap.set("TD", a12);
        myMap.set("TG", a12);
        myMap.set("ZW", a12);
        myMap.set("CI", a12);
        myMap.set("NG", a12);
        myMap.set("FM", a12);
        myMap.set("SS", a12);
        myMap.set("CV", a12);
        myMap.set("GW", a12);
        myMap.set("RE", a12);
        myMap.set("ST", a12);
        myMap.set("ER", a12);
        myMap.set("XK", a12);
        myMap.set("CK", a12);
        myMap.set("FJ", a12);
        myMap.set("GU", a12);
        myMap.set("NR", a12);
        myMap.set("PG", a12);
        myMap.set("SB", a12);
        myMap.set("TO", a12);
        myMap.set("CX", a12);
        myMap.set("MH", a12);
        myMap.set("MP", a12);
        myMap.set("NC", a12);
        myMap.set("PF", a12);
        myMap.set("PW", a12);
        myMap.set("TK", a12);
        myMap.set("NU", a12);
        myMap.set("KI", a12);
        myMap.set("WS", a12);
        myMap.set("VU", a12);
        myMap.set("GQ", a12);
        myMap.set("PT", a12);
        myMap.set("RO", a12);
        myMap.set("RS", a12);
        myMap.set("PW", a12);
        myMap.set("JM", a12);
        myMap.set("BW", a12);
    }
    return myMap;
}

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

*/
