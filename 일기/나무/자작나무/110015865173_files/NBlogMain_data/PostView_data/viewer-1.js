/*
╊━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Javascript Library 
   
   >> Photo Layer

   * NHN UX Design Center / UI innovation Team (YuIlSang,il3e@naver.com)

   * 07/24

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
*/

Function.prototype.bind = function(object) {
	var __method = this;
	return function() {
		return __method.apply(object, arguments);
	}
}
/* -----------------------------------------------------------
	EVENT handler
 ----------------------------------------------------------- */
var Event={
	addEventListener : function(element, name, observer, useCapture) {
		useCapture=useCapture || false;
		if(element.addEventListener) {
			element.addEventListener(name, observer, useCapture); // FF
		}else if(element.attachEvent) {
			element.attachEvent("on"+name, observer); // IE
		}
	},
	removeListener : function(element, name, observer, useCapture) {
		if(element.removeEventListener) {
			element.removeEventListener(name, observer, useCapture); // FF
		}else if(element.detachEvent) {
			element.detachEvent("on"+name, observer); // IE
		}
	}
}

/*  -----------------------------------------------------------
	Class (060723 JSON prototype 에서 상속방법 마련)
 ----------------------------------------------------------- */
var Class={
	_Inheritance : function(className) {
		className.call(this);
		for(property in className.prototype) {
			eval("this."+property+"="+className.prototype[property]);
		}	
	},
	Inheritance : function(obj,className) {
		this._Inheritance.call(obj,className);
	}
}

/*  -----------------------------------------------------------
	DivFrame Class (060722 View 프레임을 만드는 클래스)
 ----------------------------------------------------------- */
DivFrame=function() {
	this.oframe=null;
	this.sTargetId=null;
	this.sCreateId=null;
	this.oTargetId=null;
	this.oCreateId=null;
}

DivFrame.prototype={
	setFrame : function(frame,target_id,frame_id) {
		if (frame) this.oframe=frame; else this.oframe=self;
		this.sTargetId=target_id;
		this.sCreateId=target_id+frame_id;
	}, 

	doFrameCreate : function() {
		if(!this.oframe.document.getElementById(this.sCreateId)) {
			if(this.sTargetId) this.oTargetId=this.oframe.document.getElementById(this.sTargetId); else this.oTargetId=this.oframe.document.body;
			this.oCreateId=this.oframe.document.createElement("div"); // Div Tag Create
			this.oCreateId.id=this.sCreateId;
			this.oTargetId.appendChild(this.oCreateId); // Div Tag ADD
		}
	},

	doFrameDelete : function() {
		if(this.oTargetId) this.oTargetId.removeChild(this.oCreateId); 
		this.sTargetId=null;
		this.sCreateId=null;
		this.oTargetId=null;
		this.oCreateId=null;
	},

	setFrameCssApply : function(cssArray) {
		this.doFrameCreate();
		with (this.oCreateId.style) { // CSS Attribute
		  for (property in cssArray) {
			this.oCreateId.style[property]=cssArray[property];
		  }
		}
	}
}

/*  -----------------------------------------------------------
	FADE Class (060721)
 ----------------------------------------------------------- */
MotionFade=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;

	this.oTid=null;
	this.iSpeedFadeIn=5;
	this.iFadeShame=0;
	this.bStatus=true;
}

MotionFade.prototype={
	initialized : function(idObj) 
	{
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FadeFunction");
			this.setFrameCssApply({
					position : "absolute" ,
					top : "0px" ,
					left : "0px" ,
					width : "100%" ,
					height : "100%" ,
					background : "#FFFFFF"
				}
			);
			if(this.bStatus==false) {
				this.setFrameCssApply({
						opacity : "0",
						filter : "alpha(opacity : 0)"
					}
				);
			}

		}
	},
	onFadeStop : function() {
		clearInterval(this.oTid);
		this.oTid=null;
	},
	onFadeInStarted : function() {}, // Virtual Function
	onFadeInFinished : function() {}, // Virtual Function
	onFadeOutStarted : function() {}, // Virtual Function
	onFadeOutFinished : function() {}, // Virtual Function

	doFadeIn : function(range) 
	{
		if(!this.oTid) {
			this.bStatus=true;
			if(this.oCreateId==null) this.initialized(this.sTargetId);
			this.iFadeShame=100; 
			this.oCreateId.style.opacity="1";
			this.oCreateId.filter="alpha(opacity=100)";
			if(range) this.iSpeedFadeIn=range;
			this.onFadeInStarted();
			this.oTid=setInterval(this._FadeIn.bind(this),28); 
		}
	},

	doFadeOut : function(range) 
	{
		if(!this.oTid) {
			this.bStatus=false;
			if(this.oCreateId==null) this.initialized(this.sTargetId);
			this.iFadeShame=0;
			if(range) this.iSpeedFadeIn=range;
			this.onFadeOutStarted();
			this.oTid=setInterval(this._FadeOut.bind(this),28); 
		}
	},

	_FadeIn : function()
	{
		if (this.iFadeShame>0) {
			this.iFadeShame=this.iFadeShame-this.iSpeedFadeIn; 
			if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
				if(this.oCreateId) this.oCreateId.style.filter="alpha(opacity="+this.iFadeShame+");";
			}else{
				if(this.oCreateId) this.oCreateId.style.opacity=(this.iFadeShame/100);
			}
		} else {
			this._Clear();
			this.onFadeInFinished();
		}
	},

	_FadeOut : function()
	{
		if (this.iFadeShame>100) {
			this._Clear();
			this.onFadeOutFinished();
		} else {
			this.iFadeShame=this.iFadeShame+this.iSpeedFadeIn; 
			if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
				if(this.oCreateId) this.oCreateId.style.filter="alpha(opacity="+this.iFadeShame+");";
			}else{
				if(this.oCreateId) this.oCreateId.style.opacity=(this.iFadeShame/100);
			}
		}
	},

	_Clear : function() 
	{
		if(this.oTid!=null) clearTimeout(this.oTid);
		this.oTid=null;

		if(this.bStatus==true) {
			this.oTargetId.removeChild(this.oCreateId); 
			this.oCreateId=null;
		}
	}
}

/*  -----------------------------------------------------------
	PhotoMotionBox Class
 ----------------------------------------------------------- */
PhotoMotionBox=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;

	if(navigator.userAgent.toLowerCase().indexOf("opera") != -1) {
		this.iMotionSpeedWidth=0.3;
		this.iMotionSpeedHeight=0.25;
	}else{
		this.iMotionSpeedWidth=0.2;
		this.iMotionSpeedHeight=0.15;
	}

	this.iMotionSpeedTop=0.08;
	this.iMotionStyle=0;
	this.iTopMotion=this.oframe.document.documentElement.scrollTop+50;
	this.iWidthMotion=0;
	this.iHeightMotion=0;
	this.bWidthSize=true;
	this.bHeightSize=true;
	this.bTopSize=true;
	this.oTid=null;
	this.oTid2=null;
	this.oTid3=null;
	this.oTid4=null;
	this.bStatus=false;
}

PhotoMotionBox.prototype={
	Initialized : function(idObj) 
	{
		if(!this.oCreateId) {
			this.setFrame(this.oframe,"","_MotionBoxFunction");
			this.setFrameCssApply({
					margin : "0 auto",
					position : "absolute",
					border : "1px solid #555555",
					backgroundColor : "#FFFFFF",
					top : this.oframe.document.documentElement.scrollTop+50,
					width : "300px",
					height : "300px",
					zIndex : "1000"
				}
			);
		}
		this._ResizeLeft();
		new Event.addEventListener(this.oframe.window,"resize",this._ResizeLeft.bind(this));
	},

	onMotionStop : function() {
		clearInterval(this.oTid);
		clearInterval(this.oTid2);
		clearInterval(this.oTid3);
		clearInterval(this.oTid4);
		this.oTid=null;
		this.oTid2=null;
		this.oTid3=null;
		this.oTid4=null;
	},

	onMotionBoxStarted : function() {this.bStatus=true;}, // Virtual Function
	onMotionBoxFinished : function() {this.bStatus=false;}, // Virtual Function
	
	doMotionBoxClose : function() {
		if(this.oCreateId!=null && this.oTid2==null && this.oTid==null && this.oTid4==null ) {
			this.doFrameDelete(this.oCreateId);
		}
	},

	doMotionBox : function(width,height)
	{
		this.Initialized();
		this.iTop=this.oframe.document.documentElement.scrollTop+50;
		this.iWidth=width;
		this.iHeight=height;
		this.iWidthMotion=parseInt(this.oCreateId.style.width);
		this.iHeightMotion=parseInt(this.oCreateId.style.height);
		this.oCreateId.style.display="block";
		if(width>this.iWidthMotion) this.bWidthSize=true; else this.bWidthSize=false;
		if(height>this.iHeightMotion) this.bHeightSize=true; else this.bHeightSize=false;
		if(this.iTop>this.iTopMotion) this.bTopSize=true; else this.bTopSize=false;
		this._ResizeLeft();
		this.onMotionBoxStarted();
		this._MotionStyle01();
	},

	_MotionStyle01 : function() 
	{
		if(this.iMotionStyle==0) {
			if(!this.oTid2) this.oTid2=setInterval(this._MotionHeightBox.bind(this),13);
			if(!this.oTid4) this.oTid4=setInterval(this._MotionTopBox.bind(this),13);
			this.oTid3=setInterval(this._MotionStyle01.bind(this),100); // process
			this.iMotionStyle++;
		}else if(this.iMotionStyle==1) {
			if(!this.oTid2) {
				if(!this.oTid) this.oTid=setInterval(this._MotionWidthBox.bind(this),13);
				this.iMotionStyle++;
			}
		}else {
			if(!this.oTid) {
				clearInterval(this.oTid3);
				this.iMotionStyle=0;
				this.onMotionBoxFinished();
			}
		}
	},

	_MotionWidthBox : function() 
	{
		this.iWidthMotion +=this.iMotionSpeedWidth*((this.iWidth)-this.iWidthMotion);
		this.oCreateId.style.width=this.iWidthMotion+"px";
		if(this.bWidthSize==true) {
			if(parseInt(this.iWidthMotion)>=this.iWidth-2) { // error range 2
				clearInterval(this.oTid);
				this.oTid=null;
			}
		}else{
			if(parseInt(this.iWidthMotion)==this.iWidth) {
				clearInterval(this.oTid);
				this.oTid=null;
			}
		}
		this._ResizeLeft();
	},

	_MotionHeightBox : function() 
	{
		this.iHeightMotion +=this.iMotionSpeedHeight*((this.iHeight)-this.iHeightMotion);
		this.oCreateId.style.height=this.iHeightMotion+"px";
		if(this.bHeightSize==true) {
			if(parseInt(this.iHeightMotion)>=this.iHeight-2) { // error range 2
				clearInterval(this.oTid2);
				this.oTid2=null;
			}
		}else{
			if(parseInt(this.iHeightMotion)==this.iHeight) {
				clearInterval(this.oTid2);
				this.oTid2=null;
			}
		}
		this._ResizeLeft();
	},

	_MotionTopBox : function() 
	{
		this.iTopMotion +=this.iMotionSpeedTop*((this.iTop)-this.iTopMotion);
		this.oCreateId.style.top=this.iTopMotion+"px";
		if(this.bTopSize==true) {
			if(parseInt(this.iTopMotion)>=this.iTop-2) { // error range 2
				clearInterval(this.oTid4);
				this.oTid4=null;
			}
		}else{
			if(parseInt(this.iTopMotion)==this.iTop) {
				clearInterval(this.oTid4);
				this.oTid4=null;
			}
		}
	},

	_ResizeLeft : function()
	{
		if(this.oCreateId) {
			this.left=Math.round((this.oframe.document.body.clientWidth/2)-parseInt(this.oCreateId.style.width)/2);
			this.oCreateId.style.left=this.left+"px";
		}
	}

}

/*  -----------------------------------------------------------
	Photo View Frame Class (화면 설계)
 ----------------------------------------------------------- */
 /*  
	Frame (Photo)
*/

 PhotoFrameView=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;
}

PhotoFrameView.prototype={
	Initialized : function(idObj) {
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FrameViewFunction");
			this.setFrameCssApply({
					position : "absolute",
					top : "0px",
					marginTop : "28px",
					width : "100%"
				}
			);
		}
	}
}

/*  
	Frame (Photo View + Button)
*/
PhotoFrameImage=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;
}

PhotoFrameImage.prototype={
	Initialized : function(idObj) {
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FrameImageViewFunction");
			this.setFrameCssApply({
					position : "absolute",
					top : "0px",
					//border : "1px solid red",
					width : "100%"
				}
			);
		}
	}
}

/*  
	Frame (Prev Button)
*/
PhotoFrameBtnPrev=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;
}

PhotoFrameBtnPrev.prototype={
	Initialized : function(idObj) {
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FrameBtnPrevFunction");
			this.setFrameCssApply({
					position : "absolute",
					top : "0px",
					width : "27px",
					margin : "24px 0 0 35px"
				}
			);
		}
		this.sBtnPrevId=this.sCreateId+"_BtnPrevFunction";
		this.oCreateId.innerHTML +="<img id='"+this.sBtnPrevId+"' src='" + viewer_image_url + "btn_prev.gif' style='display:none;cursor:pointer;opacity:0.7;filter:alpha(opacity=70)'>";
	}
}

/*  
	Frame (Next Button)
*/
PhotoFrameBtnNext=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;
}

PhotoFrameBtnNext.prototype={
	Initialized : function(idObj) {
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FrameBtnNextFunction");
			this.setFrameCssApply({
					position : "absolute",
					top : "0px",
					width : "27px",
					margin : "24px 0 0 "+(parseInt(idObj.offsetWidth)-60)+"px"
				}
			);
		}

		this.sBtnNextId=this.sCreateId+"_BtnNextFunction";
		this.oCreateId.innerHTML +="<img id='"+this.sBtnNextId+"' src='" + viewer_image_url + "btn_next.gif' style='display:none;cursor:pointer;opacity:0.7;filter:alpha(opacity=70)'>";

	}
}


/*  
	Frame (Status)
*/
PhotoFrameStatus=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;
}

PhotoFrameStatus.prototype={
	Initialized : function(idObj) {
		if(!this.oCreateId) {
			this.setFrame(this.oframe,idObj.id,"_FrameStatusFunction");
			this.setFrameCssApply({
					height : "28px",
					textAlign : "right"
				}
			);
		}
		this.oCreateId.innerHTML="<img src='" + viewer_image_url + "btn_close.gif' style='margin:8px 12px 0 0;cursor:pointer'>";
	}
}

/*  
	Frame (MAIN)
*/
PhotoFrameMain=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;

	this.oMotionBox=null;
	this.oMotionFade=null;
	this.oFrameStatus=null;
	this.oFrameView=null;
	this.oFramePhotoView=null;
	this.oFrameBtnPrev=null;
	this.oFrameBtnNext=null;
	this.oLoadImage=null;
	this.sImageUrl=null;
	this.iNo=0;
	this.iTotal=0;
	this.oTimeOutError=null;

	this.bCreated=false; // 초기화 여부 판단.
	this.bFrameMainLock=false;
	this.mWidth=0; //this.mWidth=200;
	this.iHeight_Init=250;
	this.mHeight=250; //this.mHeight=250;
}

PhotoFrameMain.prototype={
	Initialized : function() {
		// Motion Box
		this.oMotionBox=new PhotoMotionBox(this.oframe);
		this.oMotionBox.Initialized();

		// Motion Fade 
		this.oMotionFade=new MotionFade(this.oframe);

		// Frame Status
		this.oFrameStatus=new PhotoFrameStatus(this.oframe);
		this.oFrameStatus.Initialized(this.oMotionBox.oCreateId);
	},

	onFrameStarted : function() {}, // Virtual  Function
	onFrameFinished : function() {}, // Virtual Function

	doFrameMain : function(url,no,total) {
		this.sImageUrl=url;
		this.iNo=no;
		this.iTotal=total;

		// Two Click LOCK
		if(this.bFrameMainLock==false) {
			this.bFrameMainLock=true; // 잠금

			// initalized
			if(this.bCreated==false) {
				this.Initialized();
			} 

			this.onFrameStarted();

			// Motion Box Started 
			this.oMotionBox.onMotionBoxStarted=function() {
					this.oFramePhotoView.oCreateId.style.height=this.mHeight; //this.mHeight-32
				}.bind(this);

			// Motion Box Finished 
			this.oMotionBox.onMotionBoxFinished=function() {
				if(this.bCreated==false) {		
					// Frame Image
					this.oFramePhotoView.oCreateId.innerHTML="<center><img src='"+this.sImageUrl+"' style='display:none'></center>";

					// Frame Btn
					if(this.oFrameBtnPrev != null) {this.oFrameBtnPrev.Initialized(this.oFramePhotoView.oCreateId);}
					if(this.oFrameBtnNext != null) {this.oFrameBtnNext.Initialized(this.oFramePhotoView.oCreateId);}

					// oFramePhotoView Frame Fade
					this.oMotionFade.initialized(this.oFramePhotoView.oCreateId);
					this.oMotionFade.onFadeInFinished=function(){
						// Frame OK
						this.onFrameFinished();
					}.bind(this);
					this.oMotionFade.doFadeIn(5);
					this.oFramePhotoView.oCreateId.getElementsByTagName("img")[0].style.display="block";
					
					// Frame Create OK
					this.bCreated=true;
				}
				this.bFrameMainLock=false; // 해제
			}.bind(this);

			if(this.oFrameView) {
				if(this.oFrameView != null) this.oFrameView.doFrameDelete();
				if(this.oFrameBtnPrev != null) this.oFrameBtnPrev.doFrameDelete(); 
				if(this.oFrameBtnNext != null) this.oFrameBtnNext.doFrameDelete();
				if(this.oFramePhotoView != null) this.oFramePhotoView.doFrameDelete();

				this.oFrameView=null;
				this.oFrameBtnPrev=null;
				this.oFrameBtnNext=null;
				this.oFramePhotoView=null;
				this.bCreated=false;
			}

			// Frame View
			this.oFrameView=new PhotoFrameView(this.oframe);
			this.oFrameView.Initialized(this.oMotionBox.oCreateId);
			this.oFrameView.oCreateId.style.height=this.mHeight;

			// Frame Button
			if(this.iNo-1>=0) this.oFrameBtnPrev=new PhotoFrameBtnPrev(this.oframe); else this.oFrameBtnPrev=null;
			if(this.iNo+1<this.iTotal) this.oFrameBtnNext=new PhotoFrameBtnNext(this.oframe);

			// Frame Image
			this.oFramePhotoView=new PhotoFrameImage(this.oframe);
			this.oFramePhotoView.Initialized(this.oFrameView.oCreateId);
			//this.oFramePhotoView.oCreateId.style.height="100%";//this.mHeight;
			this.oFramePhotoView.oCreateId.style.height=this.mHeight; //this.mHeight-32
			this.oFramePhotoView.oCreateId.innerHTML="<iframe src=http://lcs.naver.com/i{100046042} width=0 height=0 frameborder=0></iframe><table width=100% height=100% border=0 cellpadding=0 cellspacing=0 style='position:absolute;'><tr><td width=100% align=center><img src='" + viewer_image_url + "loading.gif' style='margin-top:0px;'></td></tr></table>";

			// Image PRE Load
			this.bLoadImageOnLoadBug=false; // 움직이는 애니메이션 실행시 계속 onLoad 되는 버그
			this.oLoadImage=new Image();

			this.oLoadImage.onload=function () {
				if(this.bLoadImageOnLoadBug==false) {
					// Motion Box
					this.mWidth=this.oLoadImage.width;
					this.mHeight=this.oLoadImage.height;
					if(this.oLoadImage.width<120 || this.oLoadImage.height<120) {
						this.oLoadImage.width=250; // 250
						this.oLoadImage.height=120; // 120
					}

					this.oMotionBox.doMotionBox(this.oLoadImage.width+22,this.oLoadImage.height+40);
					this.bLoadImageOnLoadBug=true;
					clearTimeout(this.oTimeOutError);
					this.oTimeOutError=null;
				}
			}.bind(this);

			this.oLoadImage.src=this.sImageUrl;

			this.oTimeOutError=setTimeout(function() {
				this.sImageUrl = viewer_image_url + "img_no_photo2.gif";
				this.oLoadImage.src=this.sImageUrl;
				this.oLoadImage.height=140;
			}.bind(this),3000);
		}
	},

	doFrameMainClose : function() { // 예외사항 없이 무조건 닫기 및 전 프레임 메모리 초기화
		if(this.oFrameStatus != null) this.oFrameStatus.doFrameDelete();
		if(this.oFrameView != null) this.oFrameView.doFrameDelete();
		if(this.oFramePhotoView != null) this.oFramePhotoView.doFrameDelete();
		if(this.oMotionBox != null) {this.oMotionBox.onMotionStop();this.oMotionBox.doFrameDelete();}
		if(this.oMotionFade != null) this.oMotionFade.onFadeStop();

		this.oMotionBox=null;
		this.oMotionFade=null;
		this.oFrameStatus=null;
		this.oFrameView=null;
		this.oFramePhotoView=null;
		this.oFrameBtnPrev=null;
		this.oFrameBtnNext=null;

		this.bCreated=false;
		this.bFrameMainLock=false;
		this.mHeight=this.iHeight_Init;
		clearTimeout(this.oTimeOutError);
	},

	doFrameMainFadeClose : function() { // 닫기 및 전 프레임 메모리 초기화
		if(this.oMotionFade) {
			if(this.bFrameMainLock==false) {
				this.oMotionFade.onFadeOutFinished=function() {
					// Object Delete
					if(this.oMotionFade) this.oMotionFade.doFrameDelete();
					if(this.oFramePhotoView) this.oFramePhotoView.doFrameDelete();
					if(this.oFrameView) this.oFrameView.doFrameDelete();
					if(this.oFrameStatus) this.oFrameStatus.doFrameDelete();
					if(this.oMotionBox) this.oMotionBox.doFrameDelete();
					if(this.oFrameBtnPrev) this.oFrameBtnPrev.doFrameDelete();
					if(this.oFrameBtnNext) this.oFrameBtnNext.doFrameDelete();
					this.oFrameBtnPrev=null;
					this.oFrameBtnNext=null;
					this.oMotionBox=null;
					this.oMotionFade=null;
					this.oFrameStatus=null;
					this.oFrameView=null; 
					this.oFramePhotoView=null;
					this.bCreated=false;
					this.mHeight=this.iHeight_Init;
				}.bind(this);

				this.oMotionFade.initialized(this.oMotionBox.oCreateId);
				this.oMotionFade.doFadeOut(10);
			}
		}
	}
}

/*  -----------------------------------------------------------
	Photo Layer Main CLASS
 ----------------------------------------------------------- */
PhotoLayer=function(frame) {
	Class.Inheritance(this,DivFrame); // CLASS DivFrame Inheritance
	if (frame) this.oframe=frame; else this.oframe=self;

	this.oPhotoFrame=null;
	this.oImg=null;
	this.bPhotoLayerLock=false;
	this.i=0;

	this.aPhotoLayer=[];
	this.j=0;
	this.n=0;
}

PhotoLayer.prototype={
	Initialized : function() {
		this.oPhotoFrame=new PhotoFrameMain(this.oframe);
	},

	doPhotoClick : function(e,id) {
		if(e.getElementsByTagName("img")[0]){
//			alert(e.getElementsByTagName("img")[0].src);
			this.aPhotoLayer=[];
			this.j=0;
			this.n=0;
			this.oImg=document.getElementById(id).getElementsByTagName("IMG");
			for(this.i=0;this.i<this.oImg.length;this.i++) {
				if(this.oImg[this.i].getAttribute("rel")) {
					this.aPhotoLayer[this.j]=this.oImg[this.i].getAttribute("rel");
//					if(this.oImg[this.i]==e) 	this.n=this.j;
					if(this.oImg[this.i].src==e.getElementsByTagName("img")[0].src) 	this.n=this.j;
					this.j++;
				}
			}
			this.doPhotoViewer();
		}
	},

	doPhotoViewer : function () {
		this.oPhotoFrame.onFrameStarted=function(){
			this.oPhotoFrame.oFrameStatus.oCreateId.getElementsByTagName('img')[0].onclick=function(){this.doPhotoBreakClose();}.bind(this);
		}.bind(this);

		this.oPhotoFrame.onFrameFinished=function(){
			this.bPhotoLayerLock=false;
			this.oPhotoFrame.oFrameStatus.oCreateId.getElementsByTagName('img')[0].onclick=function(){this.doPhotoClose();}.bind(this);

			eval("new Event.addEventListener(this.oPhotoFrame.oFramePhotoView.oCreateId,'mousewheel',function() { if(arguments[0].wheelDelta>0) this.doPhotoPrev(); else this.doPhotoNext();}.bind(this));");//window.event.cancelBubble=true;

			if (this.oPhotoFrame.oFrameBtnPrev) {
				eval("new Event.addEventListener(this.oPhotoFrame.oFramePhotoView.oCreateId,'mouseover',function() {this.oPhotoFrame.oFrameBtnPrev.oCreateId.getElementsByTagName('img')[0].style.display='block';}.bind(this));");
				eval("new Event.addEventListener(this.oPhotoFrame.oFramePhotoView.oCreateId,'mouseout',function() {this.oPhotoFrame.oFrameBtnPrev.oCreateId.getElementsByTagName('img')[0].style.display='none';}.bind(this));");
				eval("new Event.addEventListener(this.oPhotoFrame.oFrameBtnPrev.oCreateId,'click',function() {this.doPhotoPrev();}.bind(this));");
			}

			if (this.oPhotoFrame.oFrameBtnNext) {
				eval("new Event.addEventListener(this.oPhotoFrame.oFramePhotoView.oCreateId,'mouseover',function() {this.oPhotoFrame.oFrameBtnNext.oCreateId.getElementsByTagName('img')[0].style.display='block'}.bind(this));");
				eval("new Event.addEventListener(this.oPhotoFrame.oFramePhotoView.oCreateId,'mouseout',function() {this.oPhotoFrame.oFrameBtnNext.oCreateId.getElementsByTagName('img')[0].style.display='none'}.bind(this));");
				eval("new Event.addEventListener(this.oPhotoFrame.oFrameBtnNext.oCreateId,'click',function() {this.doPhotoNext();}.bind(this));");
			}
		}.bind(this);

		if(this.bPhotoLayerLock==false) this.oPhotoFrame.doFrameMain(this.aPhotoLayer[this.n],this.n,this.j);		
		this.bPhotoLayerLock=true;
	},

	doPhotoPrev : function () {	
		if(this.n-1>=0) this.n--;
		this.doPhotoViewer();
	},

	doPhotoNext : function () {
		if(this.n+1<this.j) this.n++;
		this.doPhotoViewer();
	},
	doPhotoClose : function () {
		this.bPhotoLayerLock=false;
		this.oPhotoFrame.doFrameMainFadeClose();
	},
	doPhotoBreakClose : function () {
		this.bPhotoLayerLock=false;
		this.oPhotoFrame.doFrameMainClose();
	}
}

