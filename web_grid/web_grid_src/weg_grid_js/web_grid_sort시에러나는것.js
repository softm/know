<!--
var webGridHandler = {
    setID     : "",
    idCounter : 0,
    idPrefix  : "g-obj",
    getId     : function() { 
        if ( this.setID != "" )
        {
//          alert ( 'setID : ' + this.setID );
            return this.setID;
        } else {
            this.setID = (this.idPrefix + this.idCounter++);
//          alert ( 'this.idPrefix + this.idCounter++ : ' + this.setID);
            return this.setID;
        }
    },
    all       : {},
    scroll    : function(id) {
        this.all[id]._scroll();
        //alert ( '_scroll' + head.scrollLeft);
    },

    mouseover : function(obj,name) {
        var id=obj.id.split('.')[0];
        this.all[id]._mouseover(obj,name);
        //alert ( '_scroll' + head.scrollLeft);
    },

    mouseout  : function(obj,name) {
        var id=obj.id.split('.')[0];
        this.all[id]._mouseout(obj,name);
        //alert ( '_scroll' + head.scrollLeft);
    },

    resize  : function(obj,idx) {
        var id=obj.id.split('.')[0];
//      tmp.value += 'resize : [ ' + obj.id + ' ]';
//      tmp.value += 'headdown : [ ' + obj.parent.id + ' ]';
//alert ( obj.id );
        var head_col_id = obj.id.replace(RegExp(".div","g"),"");
        this.all[id]._resize(document.getElementById(head_col_id),idx);
    },
    sort    : function(obj,idx) {
        var id=obj.id.split('.')[0];
        this.all[id]._sort(obj,idx);
    },

    selectedRow: function(rowObj) {
        var id=rowObj.id.split('.')[0];
//      tmp.value += 'resize : [ ' + obj.id + ' ]';
//      tmp.value += 'headdown : [ ' + obj.parent.id + ' ]';
//        alert ( 'selectedRow  : ' + rowObj.id );
        this.all[id].selectedRowMain(rowObj,null);
//        var head_col_id = obj.id.replace(RegExp(".div","g"),"");
//        this.all[id]._resize(document.getElementById(head_col_id),idx);
    },

    selectedCol: function(rowObj,cellObj) {
        var id=rowObj.id.split('.')[0];
//      tmp.value += 'resize : [ ' + obj.id + ' ]';
//      tmp.value += 'headdown : [ ' + obj.parent.id + ' ]';
//        alert ( 'selectedCol  : ' + rowObj.id );
        this.all[id].selectedColMain(rowObj,cellObj);
//        var head_col_id = obj.id.replace(RegExp(".div","g"),"");
//        this.all[id]._resize(document.getElementById(head_col_id),idx);
    },

    upAdownKeyRow: function(rowObj) {
        var id=rowObj.id.split('.')[0];
//      tmp.value += 'resize : [ ' + obj.id + ' ]';
//      tmp.value += 'headdown : [ ' + obj.parent.id + ' ]';
//        alert ( 'upAdownKeyRow  : ' + rowObj.id );
        this.all[id].upAdownKeyRowMain(rowObj,null);
//        var head_col_id = obj.id.replace(RegExp(".div","g"),"");
//        this.all[id]._resize(document.getElementById(head_col_id),idx);
    },

    upAdownKeyCol: function(rowObj,cellObj) {
        var id=rowObj.id.split('.')[0];
//      tmp.value += 'resize : [ ' + obj.id + ' ]';
//      tmp.value += 'headdown : [ ' + obj.parent.id + ' ]';
//        alert ( 'upAdownKeyCol  : ' + rowObj.id );
        this.all[id].upAdownKeyColMain(rowObj,cellObj);
//        var head_col_id = obj.id.replace(RegExp(".div","g"),"");
//        this.all[id]._resize(document.getElementById(head_col_id),idx);
    }

/*
    headdown  : function(obj,idx) {
        var id=obj.id.split('/')[0];
          tmp.value += 'resize : [ ' + obj.id + ' ]';
        this.all[id]._headdown(obj,idx);
    }
*/
};


function getElement(e) {
    if (e.tagName == 'TD') { return e; }
    else if (e.tagName == 'SPAN') { return e.parentNode; }
    else return null;
}

function WebGrid() {
    webGridHandler.setID = ""; // 초기화

    this.rows          = new Array();
    this.headers       = new Array();
    this.types         = new Array();

    this.colsize       = 0; // 컬럼수
    this.parent        = null;
    this.sort_index    =-1;
    this.sort_direction="";

    this.s_row                  = null; // 선택된 로우 Object
    this.s_cell                 = null; // 선택된 컬럼 Object
    this.s_rownum               = 0; // 선택할 로우의 위치 ( 숫자값 )
    this.s_cellnum              = 0; // 선택할 컬럼의 위치 ( 숫자값 )

    this.rowSelectColor         = '#FFFFFF'; // Row 선택시 폰트 색상    
    this.rowSelectBgColor       = '#316AC5'; // Row 선택시 배경 색상    
    this.rowDeSelectColor       = '#000000'; // Row 선택해제시 폰트 색상
    this.rowDeSelectBgColor     = '#FFFFFF'; // Row 선택해제시 배경 색상
    this.colSelectColor         = '#FFFFFF'; // Col 선택시 폰트 색상    
    this.colSelectBgColor       = '#82A6A6'; // Col 선택시 배경 색상    

}

function WebGridRow(p0, pid, idx, bUnescapeData) {
    var c         = (p0.length)?p0.length:p0;
//  this.id       = webGridHandler.getId();
    this.id       = pid + '.data.item:' + idx;
    this.cells    = new Array();
    this.parent   = null;
    this.pid      = pid || null;
    this._deleted = false;
    webGridHandler.all[this.id] = this;
    for (var i = 0; i < c; i++) {
        this.cells[i] = new WebGridCell((p0.length > i)?((bUnescapeData)?unescape(p0[i]):p0[i]):"",this.id,i);
        this.cells[i].parent = this;
    }
}

function WebGridCell(sValue, pid, idx) {
//    this.id       = webGridHandler.getId();
    this.id       = pid + '.item:' + idx;

    this.value    = sValue;
    this.index    = idx;
    this.parent   = null;
    this.pid      = pid || null;
    this.style    = '';
    this._collapsed = false;
    this._changed   = false;
    this._dropdown  = false;
    webGridHandler.all[this.id] = this;
}

function WebGridHeader(sValue, pid, idx) {
//    this.id       = webGridHandler.getId();

    this.id       = pid + '.item:' + idx;
//    alert ( this.id );
    this.value    = sValue;
    this.index    = idx;
    this.parent   = null;
    this.pid      = pid || null;
    this.style    = '';
    this._collapsed = false;
    this._changed   = false;
    this._dropdown  = false;
    webGridHandler.all[this.id] = this;
}

WebGrid.prototype.setId= function(id) {
    webGridHandler.setID = id;
    webGridHandler.all[id] = this;
}

WebGrid.prototype.setData = function(p0, p1, bUnescapeData) {
    var r = (p0.length)?p0.length:p0;
    var c = (p0.length && p0[0].length)?p0[0].length:p1;
    this.id = webGridHandler.getId();
    this.colsize          = c; // 컬럼수
    webGridHandler.all[this.id] = this;
    var types    = new Array(c);
    for (var i = 0; i < c; i++) {types[i] = 'D';}

    this.setType(types); // 기본 데이터 타입 설정
    for (var i = 0; i < r; i++) {
        this.rows[i] = new WebGridRow(((p0.length > i)?p0[i]:c), this.id, i, bUnescapeData);
        this.rows[i].parent = this;
    }
}

WebGrid.prototype.setHeader = function(h0, h1, bUnescapeData) {
    var r = (h0.length)?h0.length:h0;
    var c = (h0.length && h0[0].length)?h0[0].length:h1;
    for (var i = 0; i < r; i++) {
//      alert (i + ' : ' + h0[i]);
        this.headers[i] = new WebGridHeader(((h0.length > i)?h0[i]:c), this.id + '.top', i);
    }
}

/*
    STRING DATA       : D
    INPUT TEXT        : T
    INPUT CHECKBOX    : C
    INPUT RADIO       : R
    INPUT HIDDEN      : H
    SELECT            : S
*/
WebGrid.prototype.setType = function(t0, t1, bUnescapeData) {
    var r = (t0.length)?t0.length:t0;
    var c = (t0.length && t0[0].length)?t0[0].length:t1;
    for (var i = 0; i < r; i++) {
//      alert (i + ' : ' + h0[i]);
        this.types[i] = ((t0.length > i)?t0[i]:c);
    }
}

WebGrid.prototype.selectedColMain = function(sRowObj,sColObj) {
    //var sRowObj = null;
    //var sColObj = null;
    //sRowObj = document.getElementById('rpt_' + this.index + '_row_' + rowIdx);
    //sColObj = document.getElementById('rpt_' + this.index + '_col_' + rowIdx + '_' + cellIdx);

//    alert ( 'selectedColMain : rowIdx  / cellIdx ' + rowIdx + ' / ' + cellIdx );
//    alert ( sColObj.id );
    if ( this.s_cell != null && typeof(this.s_cell) == 'object') {
            this.s_cell.style.backgroundColor="";
            this.s_cell.style.color="";
    }
    if (sColObj != null && typeof(sColObj) == 'object') {
//        alert ( 'sObj.style.display : ' + sObj.style.display );
        if ( sColObj.style.display != 'none' ) {
            //alert ( 'color changed' );
            sColObj.style.backgroundColor=this.colSelectBgColor;
            sColObj.style.color=this.colSelectColor;
            this.setColMain(sRowObj,sColObj);
            if ( typeof(this.selectedCol) == 'function' ) this.selectedCol(sColObj);
            //this.selectedRowMain(sPObj);
        }
    } else {
        this.s_cell = null;
        this.s_cellnum = -1;
    }
//    alert ( 'selectedRowMain : ' + obj );
}

WebGrid.prototype.selectedRowMain = function(sRowObj) {
//    var sRowObj = null;
//    var sColObj = null;
//    sRowObj = document.getElementById('rpt_' + this.index + '_row_' + rowIdx);
//    alert ( 'selectedRowMain : ' + rowIdx);
//    alert ( sRowObj.id );
    if (this.s_row != null) {
        this.s_row.style.backgroundColor=this.rowDeSelectBgColor;
        this.s_row.style.color=this.rowDeSelectColor;
    }
    if (sRowObj != null && typeof(sRowObj) == 'object') {
        if ( sRowObj.style.display != 'none' ) {
            sRowObj.style.backgroundColor=this.rowSelectBgColor;
            sRowObj.style.color=this.rowSelectColor;
            this.setRowMain(sRowObj);
            if ( typeof(this.selectedRow) == 'function' ) this.selectedRow(sRowObj);
//            scrollRowCB(this.index, sObj.rowIndex); // report.onlaod시 scrollRow호출이 됨으로 굳이 필요없음
            //alert (window.event) ;
            if ( window.event != null ) {
                //alert ('event null');
                window.event.cancelBubble = true;
            }
            if ( this.s_cell != null && this.s_cell.id.indexOf(sRowObj.id) < 0 )
            {
                this.selectedColMain(sRowObj,null);
            } else {
                if (  this.s_cell == null )
                {
                    sRowObj.setActive();
                }
            }
        }
    } else {
        this.s_row = null;
        this.s_rownum = -1;

        this.s_cell = null;
        this.s_cellnum = -1;
    }
//    alert ( 'selectedRowMain : ' + obj );
}

WebGrid.prototype.setMain = function(sRowObj,sColObj) {
    this.setColMain(sRowObj,sColObj);
    this.setRowMain(sRowObj);
}

WebGrid.prototype.setColMain = function(sRowObj,sColObj) {
    //var sRowObj = null;
    //var sColObj = null;
    //sRowObj = document.getElementById('rpt_' + this.index + '_row_' + rowIdx);
    //sColObj = document.getElementById('rpt_' + this.index + '_col_' + rowIdx + '_' + cellIdx);

    this.s_cell = sColObj;

    //grid1.data.item:0.item:1
    var ids = sColObj.id.split('.item:');
//    alert ( sColObj.id + ' / ' + ids[2] );
    this.s_cellnum = parseInt(ids[2]);

    if ( typeof(this.setCol) == 'function' ) this.setCol(sRowObj,sColObj);
}

WebGrid.prototype.setRowMain = function(sRowObj) {
    //var sRowObj = null;
    //var sColObj = null;
    //sRowObj = document.getElementById('rpt_' + this.index + '_row_' + rowIdx);
    //sColObj = document.getElementById('rpt_' + this.index + '_col_' + rowIdx + '_' + cellIdx);

    this.s_row = sRowObj;
    //alert ( 'setRowMain : ' + sRowObj.id );

    // grid1.data.item:0
    var ids = this.id.split('.item:');
    this.s_rownum = parseInt(ids[1]);

    if ( typeof(this.setRow) == 'function' ) this.setRow(sRowObj);
}

WebGrid.prototype.upAdownKeyColMain = function(sRowObj,sColObj) {
//    var sRowObj = null;
//    var sColObj = null;
//[trap = 37] 좌
//[trap = 39] 우
//[trap = 38] 상
//[trap = 40] 하
    var code = null;
    code = event.keyCode;
//    alert ( code );
//    alert ( idx );
    if ( this.s_row != null ) {

        var gridRowCnt = this.rows.length;

        var ids = sColObj.id.split('.item:');
        var oldRowIdx = parseInt(ids[1]);
        var oldCellIdx = (sColObj != null) ? parseInt(ids[2]) : -1;

        if ( ( code == 38 && (oldRowIdx - 1) >= 0 ) || ( code == 40 && (oldRowIdx + 1) < gridRowCnt ) ) {
            //alert ('upAdownKeyColMain : ' + oldRowIdx + ' / ' + oldCellIdx + ' / ' );
            if (code == 38 )  { // 상
            // grid1.data.item:0
                sRowObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx - 1 ));
                sColObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx - 1 ) + '.item:' + oldCellIdx );
            } else if (code == 40)  { // 하
                sRowObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx + 1 ));
                sColObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx + 1 ) + '.item:' + oldCellIdx );
            }

            if (code == 38 || code == 40)  { // 상
                if ( typeof(sColObj) == 'object' ) {
                    if ( sColObj != null && typeof(sColObj) == 'object' ) {
    //                    alert ( '간다.1 : ' + selectColObj);
    //                  this.selectedColMain(selectColObj,selectRowObj);
                    } else {
    //                  alert ( '간다.2' );
    //                  this.selectedRowMain(selectRowObj);
                    }
                    this.selectedColMain(sRowObj,sColObj);
                    sColObj.setActive();
                    //alert ( 'colEnd' + sRowObj.id + ' / ' + sColObj.id + ' / ' );
                    if ( typeof(this.upAdownKeyCol) == 'function' ) this.upAdownKeyCol(event,sRowObj,sColObj,oldRowIdx,oldCellIdx);
                }
            }
        }
    }
}

WebGrid.prototype.upAdownKeyRowMain = function(sRowObj) {
//    var sRowObj = null;
//    var sColObj = null;

//[trap = 37] 좌
//[trap = 39] 우
//[trap = 38] 상
//[trap = 40] 하
    var code = null;
    code = event.keyCode;
//  alert ( code );
    var gridRowCnt = this.rows.length;
    var ids = sRowObj.id.split('.item:');
    var oldRowIdx = parseInt(ids[1]);
    var oldCellIdx = (this.s_cell != null) ? this.s_cellnum : -1;
    //alert (idx);
    if ( ( code == 38 && (oldRowIdx - 1) >= 0 ) || ( code == 40 && (oldRowIdx + 1) < gridRowCnt ) ) {
        //alert ('upAdownKeyRowMain : ' + oldRowIdx + ' / ' + oldCellIdx);
        if (code == 38 )  { // 상
            // grid1.data.item:0
            //grid1.data.item:0.item:1
            var ids = sRowObj.id.split('.item:');
            sRowObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx - 1 ));
        } else if (code == 40)  { // 하
            sRowObj = document.getElementById(ids[0] + '.item:' + ( oldRowIdx + 1 ));
        }
        if (code == 38 || code == 40)  { // 상
            if ( sRowObj != null && typeof(sRowObj) == 'object' ) {
                //alert ( selectObj.id );
                //this.selectedRowMain(selectRowObj);
                //alert ( 'upAdownKeyRowMain');
                    this.selectedRowMain(sRowObj);
                    if ( typeof(this.upAdownKeyRow) == 'function' ) this.upAdownKeyRow(event,sRowObj,null,oldRowIdx,oldCellIdx);
                    //sRowObj.setActive();
                    //alert ( 'rowEnd' + sRowObj.id );
            }
        }
    }
}
WebGridRow.prototype._toString = function(r) {
    var str = "";
    // grid1.data.item:0
    var ids = this.id.split('.item:');
        str = '        <div id="' + this.id + '" class="active-templates-row active-grid-row  "' + "onmousedown='webGridHandler.selectedRow(this);' onkeydown='webGridHandler.upAdownKeyRow(this);'>";
    for (var i = 0; i < this.cells.length; i++) {
        str += this.cells[i]._toString(i, r);
    }
        str += '        </div>\n';
    return str;
}

WebGridCell.prototype._toString = function(i, r) {
    this.index = i;
    var str, foo = 0;
    if (!this.value) { this.value = ''; }
    foo = this.value;
    if (foo) {
        foo = foo.replace('<', '&lt;');
        foo = foo.replace('>', '&gt;');
    }
    //grid1.data.item:0.item:1
    var ids = this.id.split('.item:');
    //selectedRowMain(ROW_INDEX,COL_INDEX);
    str  = '            <div id="' + this.id + '" class="active-row-cell active-grid-column active-column-' + this.index + "\""  + "onmousedown='webGridHandler.selectedCol(this.parentNode,this);' onkeydown='webGridHandler.upAdownKeyCol(this.parentNode,this);'>";

    str += foo ;
    str += '            </div>\n';
    return str;
}

WebGridHeader.prototype._toString = function(i) {

//    this.index = i;
    var str = "";
    var foo = 0;
//    alert (this.value);
    if (!this.value) { this.value = ''; }
    foo = this.value;
    if (foo) {
        foo = foo.replace('<', '&lt;');
        foo = foo.replace('>', '&gt;');
    }

    str  = '        <div id="' + this.id + '" class="active-templates-header active-box-normal active-column-' +  this.index;
    var id=this.id.split('.')[0];
    var index     = webGridHandler.all[id].sort_index;
    var direction = webGridHandler.all[id].sort_direction;

    if (index == i) {
        str += ' active-sort-' + direction;
        if ( direction=="ascending" ) {} else if ( direction=="descending" ) {}
    }
    str += '" title="" onmousedown="webGridHandler.sort(this,' + this.index + ');" onmouseenter="webGridHandler.mouseover(this,\'active-header-over\');" onmouseleave="webGridHandler.mouseout(this,\'active-header-over\');">';
    str += '            <div id="' + this.id + '.box" class="active-box-item ">';
    str += '            <span id="' + this.id + '.box.image" class="active-box-image active-image-none "></span>\n';
    str += '            <nobr>' + foo + '</nobr>';
    str += '            <span id="' + this.id + '.box.sort" class="active-box-sort "></span>\n';
    str += '            </div>\n';
//  str += '            <div id="' + this.id + '.top/' +  i + '/div" class="active-box-resize " onmousedown="dispatch(event,this)"></div>\n';
//  str += '            <div id="' + this.id + '.top/' +  i + '/div" class="active-box-resize "></div>\n';
    str += '            <div id="' + this.id + '.div" class="active-box-resize" onmousedown="webGridHandler.resize(this,' + this.index + ');"></div>\n';
    str += '        </div>\n';
    return str;
}

WebGrid.prototype.toString = function() {
//    this._main = webGridHandler.getId(); webGridHandler.all[this._main] = this;

//  var str  = '<div id="' + this.id + '" class="active-controls-grid " oncontextmenu="return false" onselectstart="return false" onkeydown="dispatch(event,this)" onmousewheel="dispatch(event,this)">';
    var str  = '<div id="' + this.id + '" class="active-controls-grid " oncontextmenu="return false" onselectstart="return false">';
//      str += '    <div id="' + this.id + '.data" class="active-scroll-data " style="padding-left:28px;padding-top:20px;">';

        str += '    <div id="' + this.id + '.data" class="active-scroll-data " style="padding-left:0px;padding-top:20px;">';
        for (var i = 0; i < this.rows.length; i++) {
            str += this.rows[i]._toString(i);
        }
        str += '    </div>\n';


        str += '    <div id="' + this.id + '.left.line" class="active-scrool-line " style="">';
        str += '    </div>\n';

        str += '    <div id="' + this.id + '.top" class="active-scroll-top " style="padding-left:0px;height:20px;">';

        for (var i = 0; i < this.headers.length; i++) {
            str += this.headers[i]._toString(i);
        }
        str += '        <div id="' + this.id + '.top.fill" class="active-templates-box active-box-normal active-scroll-fill ">';
        str += '            <div id="' + this.id + '.top.fill.box" class="active-box-item ">';
        str += '            </div>';
        str += '        </div>';
        str += '    </div>\n';
//
        str += '    <div id="' + this.id + '.scrollbars" class="active-scroll-bars " onscroll="webGridHandler.scroll(this.parentNode.id);" onfocus="webGridHandler.scroll(this.parentNode.id);"  onresize="webGridHandler.scroll(this.parentNode.id);">';

        str += '        <div id="' + this.id + '.scrollbars.space" class="active-scroll-space ">';
        str += '        </div>\n';
        str += '    </div>\n';

        str += '</div>\n';
    return str;
}

WebGrid.prototype.calcSize = function() {
//    alert ( document.getElementById( this.id + '.top') );
//    webGridHandler.all[this.id + '.top'] = document.getElementById( this.id + '.top');
    this.timeout(this.adjustSize,500);
}

WebGrid.prototype.timeout = function(handler,delay){
    var self=this;
    var wrapper=function(){
        handler.call(self)
    };
    return window.setTimeout(wrapper,delay?delay:0)
}

WebGrid.prototype.adjustSize = function() {
    var root   = document.getElementById(this.id);
    var main   = document.getElementById(this.id + '.data');
    var head   = document.getElementById(this.id + '.top');
//    var scrollbars = document.getElementById(this.id + '.scrollbars.space');
    var scrollbars = document.getElementById(this.id + '.scrollbars');
    var space= document.getElementById(this.id + '.scrollbars.space');

    var widthTotal =0, heightTotal = 0; 
//    for (var i = 0; i < this.cols; i++) {
//      alert ( head.childNodes(i).currentStyle.width );
//      widthTotal  += parseInt(head.childNodes(i).currentStyle.width);
//    }

//  heightTotal = parseInt(head.childNodes(0).currentStyle.height) * this.rows.length;
//    alert ( this.cols + '/' + widthTotal + '/' + heightTotal + '/' + this.rows.length);
    if(main){
        if(main.scrollHeight){
            space.style.height=main.scrollHeight > main.offsetHeight?main.scrollHeight:0;
            space.style.width =main.scrollWidth > main.offsetWidth?main.scrollWidth:0;

            var y=scrollbars.clientHeight;
            var x=scrollbars.clientWidth;
            main.style.width=x;
            head.style.width=x;
            main.style.height=y;
            head.scrollLeft=main.scrollLeft;
            scrollbars.style.zIndex=0;
//        tmp.value += '[ onresize 0 ]';
//        tmp.value += "main.offsetWidth + ' / ' + main.offsetHeight : " + main.offsetWidth + ' / ' + main.offsetHeight + '\n';
//        tmp.value += "main.scrollWidth + ' / ' + main.scrollHeight : " + main.scrollWidth + ' / ' + main.scrollHeight + '\n';
//        tmp.value += "x + ' / ' + y : " + x + ' / ' + y ;
/*
    tmp.value = ( "root.clientWidth + ' / ' + root.clientHeight : " + root.clientWidth + ' / ' + root.clientHeight + '\n' + "root.offsetWidth + ' / ' + root.offsetHeight : " + root.offsetWidth + ' / ' + root.offsetHeight + '\n' + 
            "main.clientWidth + ' / ' + main.clientHeight : " + main.clientWidth + ' / ' + main.clientHeight + '\n' + "main.offsetWidth + ' / ' + main.offsetHeight : " + main.offsetWidth + ' / ' + main.offsetHeight + '\n' + 
            "main.scrollWidth + ' / ' + main.scrollHeight : " + main.scrollWidth + ' / ' + main.scrollHeight + '\n' +
            "head.clientWidth + ' / ' + head.clientHeight : " + head.clientWidth + ' / ' + head.clientHeight + '\n' + "head.offsetWidth + ' / ' + head.offsetHeight : " + head.offsetWidth + ' / ' + head.offsetHeight + '\n' + 
            "scrollbars.clientWidth + ' / ' + scrollbars.clientHeight : " + scrollbars.clientWidth + ' / ' + scrollbars.clientHeight  + '\n' + "scrollbars.offsetWidth + ' / ' + scrollbars.offsetHeight : " + scrollbars.offsetWidth + ' / ' + scrollbars.offsetHeight + '\n' +
            "x + ' / ' + y : " + x + ' / ' + y 
        );
*/
        }
        else{
            this.timeout(this.adjustSize,500);
        }
        main.className=main.className+"";
    }
}
var start_scroll_time = 0, end_scroll_time = 0;
WebGrid.prototype._scroll = function() {
// var root   = document.getElementById(this.id);
    var main   = document.getElementById(this.id + '.data');
    var head   = document.getElementById(this.id + '.top');
//  var scrollbars = document.getElementById(this.id + '.scrollbars.space');
    var scrollbars = document.getElementById(this.id + '.scrollbars');

    scrollbars.style.zIndex=1000;
    main.scrollLeft = scrollbars.scrollLeft;
    main.scrollTop  = scrollbars.scrollTop;
    head.scrollLeft = scrollbars.scrollLeft;
    scrollbars.style.zIndex=0;

    d = new Date();
    start_scroll_time = d.getTime();
    if ( start_scroll_time - end_scroll_time > 500 ) { // 스크롤 간격이 0.5초 이상이되면 adjustSize 실행
//      tmp.value += '[ onresize 0 ]';
//      tmp.value += '[ onscroll 0 ]' + start_scroll_time + ' / ' + end_scroll_time + '\n';
        this.timeout(this.adjustSize,500);
        end_scroll_time = d.getTime();
    }

}

WebGrid.prototype._mouseover=function(obj,name){
    try{obj.className+=" "+name}catch(error){}
//    tmp.value += '[ ' + obj.className + ' ]';
};

WebGrid.prototype._mouseout=function(obj,name){
    try{obj.className=obj.className.replace(RegExp(" "+name,"g"),"")}catch(error){}
//    tmp.value += '[ ' + obj.className + ' ]';
};

WebGrid.prototype._sortExec=function(index,direction){
    try{
        if(direction && direction !="ascending"){
            direction="descending"
        } else{
            direction="ascending"
        }
//alert ( '' ) ;
        this.rows.sort(function(x,y){
//    tmp.value += '[ ' + x.cells[index].value + ' / ' + y.cells[index].value + ' ]\r\n';
                    return x.cells[index].value > y.cells[index].value?1:(x.cells[index].value==y.cells[index].value?0:-1)
                  });
        if(direction=="descending"){
            this.rows.reverse()
        }
        this.sort_index=index;
        this.sort_direction=direction;
        this.timeout(this.adjustSize,100);
    }catch(error){}
};

WebGrid.prototype._refresh= function() {
    try{
        if(this){
            document.getElementById(this.id).outerHTML=this.toString();
        } else {
//            alert ( '없음.');
        }
    }
    catch(error){
        alert(error.message);
    }
};

WebGrid.prototype._sort = function(obj,idx) {
    var d=(this.sort_index==idx)&&(this.sort_direction=="ascending")?"descending":"ascending";
    window.status="Sorting...";
    this._sortExec(idx,d);
    this._refresh();
    this.timeout(function(){window.status=""})
    event.cancelBubble=true;
}

WebGrid.prototype._resize = function(obj,idx) {
    var id=obj.id.split('.')[0];

    var el=obj;
    var wgrid = this;
    var pos=event.clientX;
    var size=el.offsetWidth;
    var grid=this;

    var doResize=function(){
        var el=obj;
        var sz=size+event.clientX - pos;
            el.style.width=sz < 5?5:sz;
            el=null
//        tmp.value = pos + ' / ' + event.clientX + '\n';
    };

    var endResize=function(){
//      tmp.value += 'end \n';
        var el=obj;
        if(typeof el.onmouseleave=="function"){
            el.onmouseleave()
        }
        el.detachEvent("onmousemove",doResize);
        el.detachEvent("onmouseup",endResize);
        el.detachEvent("onlosecapture",endResize);
        el.releaseCapture();

        var width=size+event.clientX - pos;
        if(width < 5){width=5}
        el.style.width=width;

        var ss=document.styleSheets[document.styleSheets.length-1];
        var i,selector="#"+id+" .active-column-"+idx;

        for(i=0;i<ss.rules.length;i++){
            if(ss.rules[i].selectorText==selector){
                ss.rules[i].style.width=width;el=null;
                wgrid.timeout(wgrid.adjustSize,100);
                break;
            }
        }
        ss.addRule(selector,"width:" + width + "px");
        el=null;
        wgrid.timeout(wgrid.adjustSize,100);
    };

    el.attachEvent("onmousemove",doResize);
    el.attachEvent("onmouseup",endResize);
    el.attachEvent("onlosecapture",endResize);
    el.setCapture();
    el=null;
    event.cancelBubble=true
}
//-->