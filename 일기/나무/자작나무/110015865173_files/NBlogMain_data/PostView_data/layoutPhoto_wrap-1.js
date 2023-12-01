/*
	LayoutPhoto (Jindo framework was wrapped to aviod conflict with the previous framework)
	
	2007/04/25 (ilzzang)
	
	2006.06.01 - 좌우측 방향키 및 휠 기능 추가
	2006.06.07 - 기존 framework 이랑 충돌나서 jindo framework를 내장했습니다.
	
	#example 
	
	1) initialize 
		var mlayoutPhoto = new PhotoImageViewer({target:parent,cssurl:"/storyphoto/original_viewer.css"});
		
	2) run
		mlayoutPhoto.doPlayer(_arr,no);
*/

var PhotoImageViewerWrap=function() {
	var CusorStylePointer=$Agent().IE==true?"hand":CusorStylePointer;
	/** @id JINDO */
	var JINDO = {
		/** @id JINDO.clone */
		clone  : function(source) {
			var obj = new source.constructor;
			for(var x in source) obj[x] = source[x];
			
			return obj;
		},
		/** @id JINDO.extend */
		extend : function(source, append) {
			var obj = source;
			for(var x in append) obj[x] = append[x];
			
			return obj;
		}
	}
	
	JINDO.extend(Function.prototype, {
		/** @id Function.prototype.bind */
		bind : function(obj) {
			var f=this, a=$A(arguments);a.shift();
			return function() {
				return f.apply(obj, a);
			}
		},
		/** @id Function.prototype.bindForEvent */
		bindForEvent : function(obj) {
			var f=this, a=$A(arguments);
			return function(e) {
				a[0] = Event.ready(e);
				return f.apply(obj, a);
			}
		}
	});	
	
	/** @id Class */
	var Class = function(){
		var obj = function() {
			if (this.__init) this.__init.apply(this,arguments);
		}
		if (arguments[0]) obj.prototype = arguments[0];
		
		return obj;
	}
	
	/** @id Class.extend */
	Class.extend = function(superClass) {
		var obj = Class();	
		obj.prototype = new superClass;
		for(var i=1; i < arguments.length; i++) {
			if (arguments[i]) JINDO.extend(obj.prototype, arguments[i]);
		}
	
		return obj;
	}
	
	var Event = {
		/** @id Event.register */
		register : function(oEl, sEvent, pFunc) {
			oEl = $(oEl);
			if (oEl.addEventListener) {
				oEl.addEventListener(sEvent, pFunc, false);
			} else if(oEl.attachEvent) {
				oEl.attachEvent('on'+sEvent, pFunc);
			}
		},
		/** @id Event.unregister */
		unregister : function(oEl, sEvent, pFunc) {
			oEl = $(oEl);
			if (oEl.removeEventListener) {
				oEl.removeEventListener(sEvent, pFunc, false);
			} else if(oEl.detachEvent) {
				oEl.detachEvent('on'+sEvent, pFunc);
			}
		},
		/** @id Event.ready */
	 	ready : function(evt) {
			var e = evt || window.event;
			var b = document.body;
			
			/** Extend For Browser Event */
			/*
			JINDO.extend(e, {
				element : e.target || e.srcElement,
				page_x  : e.pageX || e.clientX+b.scrollLeft-b.clientLeft,
				page_y  : e.pageY || e.clientY+b.scrollTop-b.clientTop,
				layer_x : e.offsetX || e.layerX - 1,
				layer_y : e.offsetY || e.layerY - 1,
				key     : {
					alt   : e.altKey,
					ctrl  : e.ctrlKey,
					shift : e.shiftKey,
					up    : [38,104].has(e.keyCode),
					down  : [40,98].has(e.keyCode),
					left  : [37,100].has(e.keyCode),
					right : [39,102].has(e.keyCode),
					enter : (e.keyCode==13)
				},
				mouse   : {
					left   : (e.which&&e.button==0)||!!(e.button&1),
					middle : (e.which&&e.button==1)||!!(e.button&4),
					right  : (e.which&&e.button==2)||!!(e.button&2)
				},
				stop : function() { Event.stop(this); 	}
			});
			*/
			return e;
		},
		/** @id Event.stop */
		stop : function(e) {
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			
			e.returnValue = false;
			e.cancelBubble = true;
		}
	}
	
	/** @id Event.stopProc */
	Event.stopProc = function(e) {
		Event.stop(e || window.event);
	}
	
	/** @id $ */
	function $() {
		var ret = [];
		for(var i=0; i < arguments.length; i++) {
			if (typeof arguments[i] == 'string') {
				ret[ret.length] = document.getElementById(arguments[i]);
			} else {
				ret[ret.length] = arguments[i];
			}
		}
		return ret[1]?ret:ret[0];
	}
	
	/** @id $A */
	function $A(collection) {
		var ret = [];
		for(var i=0; i < collection.length; i++) ret[ret.length] = collection[i];
		return ret; 
	}
	
	/** @id $C */
	function $C(tag) {
		return document.createElement(tag);
	}
	/** @deprecated */
	$c = $C;	
	
	/** @id $Agent */
	function $Agent() {
		var isOpera = !!(window.opera);
		var nu = navigator.userAgent;
		var isIE = !isOpera && /MSIE/.test(nu), ie5=false, ie55=false, ie6=false, ie7=false, macIE=false;
		
		if (isIE) {
			/MSIE ([0-9\.]+)/.exec(nu);
			var ver = parseFloat(RegExp.$1);
			switch (ver) {
				case 5   : ie5 =true; break;
				case 5.5 : ie55=true; break;
				case 6   : ie6=true; break;
				case 7   : ie7=true; break;
				default  :
			}
		}
		
		return {
			IE     : isIE,
			IE5    : isIE && ie5,
			IE55   : isIE && ie55,
			IE6    : isIE && ie6,
			IE7    : isIE && ie7,
			macIE  : isIE && macIE,
			Gecko  : /Gecko/.test(nu),
			Opera  : isOpera,
			Safari : /WebKit/.test(nu),
			KHTML  : /KHTML/.test(nu)
		};
	}	
	
	/** Extend Protoype of Array */
	JINDO.extend(Array.prototype, {
		/** @id Array.prototype.has */
		has : function(needle) {
			return (this.indexOf(needle) > -1);
		},
		/** @id Array.prototype.load */
		load : function(obj) {
			for(var i=0; i<obj.length; i++) {
				this.push(obj[i]);
			}
			return this;
		},
		/** @id Array.prototype.each */
		each : function(iter) {
			for(var i=0; i<this.length; i++) {
				iter(this[i],i);
			}
		},
		/** @id Array.prototype.refuse */
		refuse : function(value) {
			return this.filter(function(v){ return v!=value });
		}
	});
	
	/** If This Browser Supports "forEach", Replace "each" */
	if (Array.prototype.forEach) Array.prototype.each = Array.prototype.forEach;	
		
	/** @id Element */	
	var Element = {
		/** @id Element.show */
		show : function() {
			[].load(arguments).each(function(v){ $(v).style.display=''; });
		},
		/** @id Element.hide */
		hide : function() {
			[].load(arguments).each(function(v){ $(v).style.display='none'; });
		},
		/** @id Element.toggle */
		toggle : function() {
			[].load(arguments).each(function(v){ Element[Element.visible(v)?'hide':'show'](v) });
		},
		/** @id Element.visible */
		visible : function(oEl) {
			return ($(oEl).style.display!='none');
		},
		/** @id Element.realPos */
		realPos : function(oEl) {
			if (oEl.offsetParent) {
				var p = this.realPos(oEl.offsetParent);
				return { top: oEl.offsetTop+p.top, left: oEl.offsetLeft+p.left };
			} else {
				return { top: oEl.offsetTop, left:oEl.offsetLeft };
			}
		},
		/** @id Element.getCSS */
		getCSS : function(oEl, name) {
			return oEl.style[name];
		},
		/** @id Element.setCSS */
		setCSS : function(oEl, css) {
			JINDO.extend(oEl.style, css);
		},
		/** @id Element.hasClass */
		hasClass : function(oEl, className) {
			return (new RegExp('(^|\\s)'+className+'(\\s|$)','g')).test($(oEl).className);
			//return $(oEl).className.split(/\s+/).has(className);
		},
		/** @id Element.addClass */
		addClass : function(oEl, className) {
			if (!this.hasClass(oEl, className)) $(oEl).className = ($(oEl).className+' '+className).replace(/^\s+/,'');
		},
		/** @id Element.removeClass */
		removeClass : function(oEl, className) {
			$(oEl).className = $(oEl).className.replace(new RegExp('(^|\s+)'+className+'($|\s+)','g'),' ');
		}
	}
	
	/** @id PhotoImageViewer **/
	var PhotoImageViewer=Class({
		__init : function() {
			this._ref=[];
			this._count=0;
			this._no=0;
			this._nObj={};
	
			this.tid=null;
			this.tidTimeout=null;		
			this.opt=JINDO.extend({
				imageMax : [0,0],
				marginTop : "50px",
				target : parent,
				cssurl : ""
			},arguments[0]||{});
	
			//CSS Loading 
			if(this.opt.cssurl) {
				var elCSS = this.opt.target.document.createElement("LINK");
				elCSS.rel = "stylesheet";
				elCSS.type = "text/css";
				elCSS.href = this.opt.cssurl;
//				this.opt.target.document.body.appendChild(elCSS);

				try {
					var oBody = this.opt.target.document.body;
					if (oBody.firstChild) {
						oBody.insertBefore(elCSS, oBody.firstChild);
					}
				} catch(e){}
			}

			//PhotoView
			this.createViewDiv();	
			this.createButtonDiv();

			//Event Binding
			this.onclick_PrevButton=this.doPrev.bind(this);
			this.onclick_NextButton=this.doNext.bind(this);
			this.onclick_CloseButton=this.doClose.bind(this);		
			this.onresize=function(){this.setAlignCenter();}.bind(this);
			this.onmouseover_ShowButton=function(){this.doShowButton(1);}.bind(this);
			this.onmouseout_ShowButton=function(){this.doShowButton(0);}.bind(this);
			//this.onclick_bodyclose=function(){this.chkMouseClick(arguments[0]);}.bindForEvent(this);
			this.keyboard=function(oEvent) {
				switch (oEvent.keyCode) {
					case 37: // left 
						this.doPrev();
						break;
					case 39: // right
						this.doNext();
						break;
					default:
						return;
				}
				Event.stop(oEvent);		
			}.bindForEvent(this);	

			this.ffmousewheel=function(oEvent) {
				//console.log("%i",oEvent.detail);
				// + up , - dn
				oEvent.detail>0 ? this.doNext() : this.doPrev();
				Event.stop(oEvent);
			}.bindForEvent(this);
			
			this.iemousewheel=function(oEvent) {
				//alert(oEvent.wheelDelta);
				// - up , + dn
				oEvent.wheelDelta<0 ? this.doNext() : this.doPrev();
				Event.stop(oEvent);
			}.bindForEvent(this);


			// 이벤트 활성화
			Event.register(this.oViewCloseButton,"click",this.onclick_CloseButton);
			Event.register(this.oViewPrevButton,"click",this.onclick_PrevButton);
			Event.register(this.oViewNextButton,"click",this.onclick_NextButton);
			Event.register(this.oView,"mouseover",this.onmouseover_ShowButton);
			Event.register(this.oView,"mouseout",this.onmouseout_ShowButton);

		},
		doPlayer : function (arr,no) {
			if(arr.length-1>=no) {
				this._ref=arr;
				this._count=arr.length-1;
				this._no=no;
				this.display();
			}
		},
		doClose : function() {
			if(this.tid) clearTimeout(this.tid);
			if(this.tidTimeout) clearTimeout(this.tidTimeout);
			Event.unregister(this.opt.target.window,"resize",this.onresize);
			//Event.unregister(this.doc,"click",this.onclick_bodyclose);
			Element.setCSS(this.oView,{display : "none"});
			Element.setCSS(this.oViewPrevButton,{display : "none"});
			Element.setCSS(this.oViewNextButton,{display : "none"});
		},
		doPrev : function() {
			this._no--;
			this._no<0 ? this._no=0 : this.display();
		},	
		doNext : function() {
			this._no++;
			this._no>this._count ? this._no=this._count : this.display();
		},
		display : function() {		
			Event.unregister(this.opt.target.window,"resize",this.onresize);
			Event.register(this.opt.target.window,"resize",this.onresize);
			
			var ethis=this;
			var img=this.img=new Image();
			if(this.tid) clearTimeout(this.tid);
			if(this.tidTimeout) clearTimeout(this.tidTimeout);
			this.oViewImgFrame.style.height="100%";
	
			img.onload=function() {				
				if(ethis.tidTimeout) clearTimeout(ethis.tidTimeout);
						
				if(ethis.opt.imageMax[0]!=0 && ethis.opt.imageMax[1]!=0) ethis.setResizeImage(this,ethis.opt.imageMax[0],ethis.opt.imageMax[1]);
				var _width=this.width<300?300:this.width+2;
				var _height=this.height<300?300:this.height+4;
				var _obj=ethis.getPosCenter(_width,_height);
				ethis._nObj.width=_width;
				ethis._nObj.height=_height;	
				this.__width=_width;
				this.__height=_height;
	
				Element.setCSS(ethis.oView,{display : "block"});						
				Element.setCSS(ethis.oView,{
					width : _width+"px",
					height : _height+"px",
					left : _obj.left+"px",
					top : _obj.top+"px"
				});
	
				ethis.tid=setTimeout(function() {
					ethis.setDraw(this);
					ethis.oView.style.display="block";

					if($Agent().IE==true) {
						ethis.oViewImgFrame.style.height=(this.height>300?this.height:"100%");
					}else{
						if(this.height>300) {ethis.oViewImgFrame.style.height="";}
					}
				}.bind(this),700);
	
				this.onload=function(){}; // 2006.05.31 bts 1차해결 (레이아웃에서 ani gif 파일을 등록하고 뷰어로 볼때, 해당 이미지만 반복해서 보여집니다)
			};
			
			/* 
				이미지를 재시간에 로드하지 못했을경우에 대한 처리
			*/
			this.tidTimeout=setTimeout(function() {
				//alert("img loading error");
				if(ethis.oView.style.display=="none") {
					var _width=300;
					var _height=300;			
					var _obj=ethis.getPosCenter(_width,_height);
					Element.setCSS(ethis.oView,{
						width : _width+"px",
						height : _height+"px",
						left : _obj.left+"px",
						top : 50+document.documentElement.scrollTop+"px"
					});
					Element.setCSS(ethis.oView,{display : "block"});				
				}
				
				ethis.setDraw({
					src : "http://blogimgs.naver.com/blog20/blog/layout_photo/viewer/img_no_photo2.gif",
					width : 140,
					height : 140
				});
			},2000);
	
			img.src=this._ref[this._no];
			
			var tmpImgObj={};
			tmpImgObj.src="http://blogimgs.naver.com/blog20/blog/layout_photo/viewer/loading.gif";
			tmpImgObj.width=41;
			tmpImgObj.height=23;		
			this.setDraw(tmpImgObj);
			this.setButtonDisplay();
		},
		doShowButton : function(s) {
			var h=((this.oViewImgFrame.offsetHeight - this.oViewPrevButton)/2)-this.oViewPrevButton.offsetHeight/2;
			var h = this.oViewTopFrame.offsetHeight + ((this.oViewImgFrame.offsetHeight - 60) / 2);
			
			if(s==1) {
				if(this.__evt==0 ||this.__evt==""){
					Event.register($Agent().IE?this.oView:this.opt.target,$Agent().IE?"keydown":"keypress",this.keyboard);
					Event.register(this.oView,"mousewheel",this.iemousewheel);
					Event.register(this.oView,"DOMMouseScroll",this.ffmousewheel);
				}
				this.__evt=1;

				Element.setCSS(this.oViewPrevButton,{visibility:"visible",top:h+"px"});
				Element.setCSS(this.oViewNextButton,{visibility:"visible",top:h+"px"});
				
			}else if(s==0) {
				if(this.__evt==1){
					Event.unregister($Agent().IE?this.oView:this.opt.target,$Agent().IE?"keydown":"keypress",this.keyboard);
					Event.unregister(this.oView,"mousewheel",this.iemousewheel);
					Event.unregister(this.oView,"DOMMouseScroll",this.ffmousewheel);
				}
				this.__evt=0;
				Element.setCSS(this.oViewPrevButton,{visibility:"hidden",top:h+"px"});
				Element.setCSS(this.oViewNextButton,{visibility:"hidden",top:h+"px"});
			}
		},
		setDraw : function(imgobj,s) {
			this.oViewImgFrame.innerHTML="<table width=100% height=100% cellspacing=0 cellpadding=0 border=0><tr align=center valign=middle><td><img id='photoview' src='"+imgobj.src+"' width='"+imgobj.width+"' height='"+imgobj.height+"'></td></tr></table>";	
		},
		chkMouseClick : function(e) {
			var r=Element.realPos(this.oView);
			var r2=Element.getCSS(this.oView);
			var x1=r.left;
			var y1=r.top;
			var x2=x1+this.oView.offsetWidth;
			var y2=y1+this.oView.offsetHeight;
			if(x1<=e.page_x && x2>=e.page_x && y1<=e.page_y && y2>=e.page_y) {
			}else{
				this.doClose();
			}
		},	
		setAlignCenter : function() {
			var _obj=this.getPosCenter(this._nObj.width,this._nObj.height);
			Element.setCSS(this.oView,{
				left : _obj.left+"px",
				top : _obj.top+"px"
			});
		},
		setButtonDisplay : function() {
			// 상황에 따라 좌우 버튼 display 토글
			if(this._no!=0) {
				Element.setCSS(this.oViewPrevButton,{display : "block"});	
			}else{
				Element.setCSS(this.oViewPrevButton,{display : "none"});
			}
	
			if(this._count!=this._no) {
				Element.setCSS(this.oViewNextButton,{display : "block"});
			}else{
				Element.setCSS(this.oViewNextButton,{display : "none"});
			}
		},
		setResizeImage : function(obj,max_width,max_height) {
			if(!max_width) {max_width = this._def.oLimitSize.width;}
			if(!max_height) {max_height = this._def.oLimitSize.height;}
			if((obj.width / obj.height) >= (max_width / max_height) && obj.width > max_width) { 
				obj.height = (obj.height*max_width)/obj.width; 
				obj.width = max_width; 
			}else if((obj.width / obj.height) < (max_width / max_height) && obj.height > max_height){
				obj.width = (obj.width*max_height)/obj.height; 
				obj.height = max_height; 
			}
			this.doShowButton();
		},
		getPosCenter : function(objWidth,objHeight) {
			var _width=window.innerWidth ? this.opt.target.window.innerWidth : this.opt.target.document.documentElement.clientWidth;
			var _height=window.innerHeight ? this.opt.target.window.innerHeight : this.opt.target.document. documentElement.clientHeight;
			
			if($Agent().IE55==true) {
				_width=top.document.body.clientWidth;
			}
			
			var _Left=parseInt(_width/2-(objWidth/2));
			if(_Left<0) _Left=0;
			var _Top=parseInt(this.opt.marginTop)+this.opt.target.document.documentElement.scrollTop;
			
			if($Agent().IE55==true) {
				_Top=parseInt(this.opt.marginTop)+this.opt.target.document.body.scrollTop;
			}			
					
			return {
				left : _Left,
				top : _Top
			};
		},
		createViewDiv : function() {

			// Draw Frame
			var oView=this.oView=this.opt.target.document.createElement("div");
			oView.id="photoviewer";
			Element.setCSS(oView,{
				display : "none",
				position : "absolute",
				top : "100px",
				left : "100px",
				width : "200px",
				height : "200px",
				zIndex : "10000",
				cursor : CusorStylePointer
			});
			
			// Draw Top Frame
			var oViewTopFrame=this.oViewTopFrame=this.opt.target.document.createElement("div");
			Element.setCSS(oViewTopFrame,{
				display : "block",
				float : "left",
				position : "relative",
				height : "30px",
				border : "0px",
				textAlign : "center",
				bottom : "0px"
			});
			
	//		oViewTopFrame.innerHTML="<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=0><tr><td class=\"photoviewer_t\"><table cellpadding=\"0\" border=1 cellspacing=\"0\" width=\"100%\"><tr><td class=\"photoviewer_tl\"></td><td class=\"photoviewer_tbg\"><h1><span></span></h1><p class=\"bar\"></p><h2><span></span></h2></td><td class=\"photoviewer_tr\"></td></tr></table></td></tr><tr></table>";
			oViewTopFrame.innerHTML="<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=0>\
				<tr>\
				<td class=\"photoviewer_t\">\
					<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\
					<tr>\
					<td class=\"photoviewer_tl\"></td>\
					<td class=\"photoviewer_tbg\">\
						<h1><a><span class=\"no\"></span></a></h1>\
						<p class=\"bar\"><span class=\"no\"></span></p>\
						<h2><a><span class=\"no\"></span></a></h2>\
					</td>\
					<td class=\"photoviewer_tr\"></td>\
					</tr>\
					</table>\
				</td>\
				</tr>\
				<tr>\
				</table>";
			// Draw Image Frame
			var oViewImgFrame=this.oViewImgFrame=this.opt.target.document.createElement("div");
			Element.setCSS(oViewImgFrame,{
				display : "block",
				position : "relative",
				float : "left",			
				height : "100%",
				borderTop : "1px solid #aaaaaa",			
				borderLeft : "1px solid #aaaaaa",
				borderRight : "1px solid #aaaaaa",
				borderBottom : "1px solid #aaaaaa",			
				textAlign : "center",
				bottom : "0px",
				top : "-1px",
				backgroundColor : "#fff"
			});
	
			// Append
			this.oView.appendChild(oViewTopFrame);		
			this.oView.appendChild(oViewImgFrame);	
			//this.opt.target.document.body.appendChild(oView);
			try {
				var oBody = this.opt.target.document.body;
				if (oBody.firstChild) {
					oBody.insertBefore(oView, oBody.firstChild);
				}
			} catch(e) {}
		},
		createButtonDiv : function() {
			// Draw Close Button		
			var oViewCloseButton=this.oViewCloseButton=this.opt.target.document.createElement("div");
			Element.setCSS(oViewCloseButton,{
				display : "block",
				position : "absolute",
				top : "8px",
				right : "11px",
				width : "12px",
				height : "11px",
				cursor : CusorStylePointer,
				zIndex : "100"			
			});		
			oViewCloseButton.innerHTML="<img src='http://static.naver.com/n/webphoto/btn_close.gif'>";
	
			// Draw Prev Button
			var oViewPrevButton=this.oViewPrevButton=this.opt.target.document.createElement("div");
			Element.setCSS(oViewPrevButton,{
				display : "block",
				visibility : "hidden",
				position : "absolute",
				top : "30px",
				left : "55px",
				width : "60px",
				height : "60px",
				cursor : CusorStylePointer,
				filter : "alpha(opacity:70)",
				opacity : "0.7",
				zIndex : "100"			
			});
			oViewPrevButton.innerHTML="<img src='http://static.naver.com/n/webphoto/btn_left2.png'>";
	
			// Draw Next Button
			var oViewNextButton=this.oViewNextButton=this.opt.target.document.createElement("div");
			Element.setCSS(oViewNextButton,{
				display : "block",
				visibility : "hidden",			
				position : "absolute",
				top : "30px",
				right : "55px",
				width : "60px",
				height : "60px",
				cursor : CusorStylePointer,
				filter : "alpha(opacity:70)",
				opacity : "0.7",
				zIndex : "100"	
			});
			oViewNextButton.innerHTML="<img src='http://static.naver.com/n/webphoto/btn_right2.png'>";
	
			// AppendCloseButton
			this.oView.appendChild(oViewCloseButton);
			this.oView.appendChild(oViewPrevButton);
			this.oView.appendChild(oViewNextButton);
		},
		unload : function() {
			this.doClose();
		}
		
	});	

	this.PhotoImageViewer=PhotoImageViewer;
}