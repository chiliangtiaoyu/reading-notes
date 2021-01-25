// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


document.onkeyup = function(e) {
    //点击C键开始循环查询直到出现数据为止
    if(e && (e.keyCode == 18 || e.keyCode == 113)){//按下Alt键、F2
        alert(buildAlert())
    }
}


