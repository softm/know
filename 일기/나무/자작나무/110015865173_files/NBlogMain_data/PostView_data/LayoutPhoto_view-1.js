
String.prototype.replaceAll = function(str1, str2)
{
  var temp_str = "";

  if (this.trim() != "" && str1 != str2)
  {
    temp_str = this.trim();

    while (temp_str.indexOf(str1) > -1)
    {
      temp_str = temp_str.replace(str1, str2);
    }
  }

  return temp_str;
}
    
/**
 * 생성 레이아웃포토 html 생성.
 * 
 * layout_type : 레이아웃 타입 정보
 * free_layout_num : 자유형 서브타입 정보
 * sort_col_size : 정렬형 열갯수 정보
 * sort_row_size : 정렬형 줄갯수 정보
 * imagelink : 이미지 링크 정보 배열
 */
function LayoutPhotoMakeHTML(layout_type, free_layout_num, sort_col_size, sort_row_size, imagelink)
{
	var result_html = "";
	var div_id = parseInt((Math.random()*10000000)) + "_div";
//	alert(layout_type);
	if(layout_type == "free")
		result_html = freeLayoutMakeHTML(div_id, free_layout_num, imagelink);
	else	if(layout_type == "sort")
		result_html = sortLayoutMakeHTML(div_id, sort_col_size, sort_row_size, imagelink);
	
	return result_html;
}

/**
 * 썸네일 링크 반환.
 * 
 */
function thunmbnailLinkMake(origin_src, temp_thunmbnail_type, temp_size)
{
	var temp_image_url = origin_src.replace(attach_url, "");
	var imgid = parseInt((Math.random()*10000000));
	var imgLink = "<img src='" + thumbnail_url + temp_image_url + "?type=s" + temp_thunmbnail_type + "' width='" + temp_size + "' height='" + temp_size + "' id='userImg" + imgid + "' style='cursor: pointer' rel='" + origin_src + "' div_id>";	
//	var imgLink = "<img src='" + thumbnail_url + temp_image_url + "?type=s" + temp_thunmbnail_type + "' width='" + temp_size + "' height='" + temp_size + "' id='userImg" + imgid + "' style='cursor: pointer' rel='" + origin_src + "'>";	

	return imgLink;
}

/**
 * 정렬형 레이아웃 포토 html 생성.
 * 
 */
function sortLayoutMakeHTML(div_id, sort_col_size, sort_row_size, imagelinkArray)
{
//	alert(div_id);
//	alert(sort_col_size);
//	alert(sort_row_size);
//	alert(imagelinkArray);
	var table_html = "";
	if(imagelinkArray != "")
	{
		var imagelink = imagelinkArray.split("|");
		var tableObject = document.createElement("table");
		var tbody = document.createElement("tbody");;
		var thumbnailSize = CheckSortThunbnailSize(sort_col_size);
		var max_info = CheckSortThunbnailSize(sort_col_size);
//		var need_imagecount = parseInt(sort_col_size) * parseInt(sort_row_size);
		var temp_thunmbnail_type = max_info[0];
		var temp_size = max_info[1];
		var spanId = 1;	
		var imageCount = 0;
		for(var rowCount = 0; rowCount < sort_row_size; rowCount++)
		{
			var temp_row = document.createElement("tr");
			var temp_col;
			var temp_span;
			for(var colCount = 0; colCount < sort_col_size; colCount++)
			{
				temp_col = document.createElement("td");
				temp_col.className = "i" + spanId + " y" + sort_col_size;
				temp_col.width = thumbnailSize[1];
				temp_col.height = thumbnailSize[1];
				
				
//				temp_span = document.createElement("<div onMouseOver='ImgMouseOver(this)' onMouseOut='ImgMouseOut(this)' style='position:relative;top:0px;left:0px;cursor:pointer;' div_id>");
//				temp_span = document.createElement("<div>");			
//				temp_span.onMouseOut = "ImgMouseOut(this)";
//				temp_span.onMouseOver = "ImgMouseOver(this)";
//				temp_span.onClick = "photo.doPhotoClick(this, 'firefoxOnly');";
//				temp_span.style.position = "relative";
//				temp_span.style.top = "0px";
//				temp_span.style.left = "0px";
//				temp_span.style.cursor = "pointer";
//				temp_span.id = "sort_layout_item" + (spanId);
//				temp_span.innerHTML = thunmbnailLinkMake(imagelink[imageCount++], temp_thunmbnail_type, temp_size);
//				temp_col.appendChild(temp_span);
				
				var temp_span_html = "<div id='sort_layout_item" + (spanId) + "' onMouseOver='ImgMouseOver(this)' onMouseOut='ImgMouseOut(this)' style='position:relative;top:0px;left:0px;cursor:pointer;' div_id>" + thunmbnailLinkMake(imagelink[imageCount++], temp_thunmbnail_type, temp_size) + "</div>"
				temp_col.innerHTML = temp_span_html;
				
				temp_row.appendChild(temp_col);
				spanId++;
			}
			tbody.appendChild(temp_row);
		}
		
		tableObject.appendChild(tbody);
		
		table_html = tableObject.innerHTML;
		table_html = table_html.replaceAll('div_id', "onClick='photo.doPhotoClick(this, \"" + div_id + "\")'");
//		table_html = table_html.replaceAll('firefoxOnly', div_id);
		table_html = "<span id='" + div_id + "'>\r\n<table border='0' align='center' valign='middle' cellspacing=0 style='padding : 0 0 0 0'>\r\n" + table_html + "\r\n</table>\r\n</span>";
	}

	return table_html;		
}

/**
 * 자유형 레이아웃 포토 html 생성.
 * 
 */
function freeLayoutMakeHTML(div_id, free_layout_num, imagelinkArray)
{
	var result_html ="";
	if(imagelinkArray != "")
	{
		var imagelink = imagelinkArray.split("|");
		var need_imagecount = getFreeLayoutTypeNeedCountInfo(free_layout_num);
		var max_info = getFreeLayoutTypeSizeInfo(need_imagecount, free_layout_num);
		var table_html = "";
		var temp_thunmbnail_type = new Array(need_imagecount);
		var temp_size = new Array(need_imagecount);
		var css_style = " onMouseOver='ImgMouseOver(this)' onMouseOut='ImgMouseOut(this)' style='position:relative;top:0px;left:0px;cursor:pointer;' div_id ";
		for(var i = 0; i < need_imagecount; i++)
		{
			temp_split = max_info[i].split(":");
			temp_thunmbnail_type[i] = temp_split[0];
			temp_size[i] = temp_split[1];
		}

		if(free_layout_num == "1")
		{	
			table_html = 
			"<table summary='레이아웃 스타일1' cellpadding='0' cellspacing='1' id='free_layout1'>" + 
			"<tr>" +
			"<td rowspan='2' width='362' height='362'><div id='free_layout1_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" +
			"<td width='179' height='179'><div id='free_layout1_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</div></td>" +
			"</tr>" +
			"<tr>" +
			"<td width='179' height='179'><div id='free_layout1_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" +
			"</tr>" + 
			"</table>";
		}
		else	if(free_layout_num == "2")
		{
			table_html = 
			"<table summary='레이아웃 스타일2' cellpadding='0' cellspacing='1' id='free_layout2'>" + 
			"<tr>" + 
			"<td width='179' height='179'><div id='free_layout2_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" + 
			"<td rowspan='2' width='362' height='362'><div id='free_layout2_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</div></td>" + 
			"</tr>" + 
			"<tr>" + 
			"<td width='179' height='179'><div id='free_layout2_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" + 
			"</tr>" + 
			"</table>";
		}
		else	if(free_layout_num == "3")
		{
			table_html = 
			"<table summary='레이아웃 스타일3' cellpadding='0' cellspacing='1' id='free_layout3'>" + 
			"<tr>" + 
			"<td width='133' height='133'><div id='free_layout3_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" + 
			"<td rowspan='2' width='271' height='271'><div id='free_layout3_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</span></td>" + 
			"<td width='133' height='133'><div id='free_layout3_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" + 
			"</tr>" + 
			"<tr>" + 
			"<td width='133' height='133'><div id='free_layout3_item4' " + css_style + ">" + thunmbnailLinkMake(imagelink[3], temp_thunmbnail_type[3], temp_size[3]) + "</div></td>" + 
			"<td width='133' height='133'><div id='free_layout3_item5' " + css_style + ">" + thunmbnailLinkMake(imagelink[4], temp_thunmbnail_type[4], temp_size[4]) + "</div></td>" + 
			"</tr>" + 
			"</table>";
		}
		else	if(free_layout_num == "4")
		{
			table_html = 
			"<table summary='레이아웃 스타일4' cellpadding='0' cellspacing='1' id='free_layout4'>" + 
			"<tr>" + 
			"<td width='106' height='106'><div id='free_layout4_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" + 
			"<td rowspan='3' width='326' height='326'><div id='free_layout4_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</div></td>" + 
			"<td width='106' height='106'><div id='free_layout4_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" + 
			"</tr>" + 
			"<tr>" + 
			"<td width='106' height='106'><div id='free_layout4_item4' " + css_style + ">" + thunmbnailLinkMake(imagelink[3], temp_thunmbnail_type[3], temp_size[3]) + "</div></td>" + 
			"<td width='106' height='106'><div id='free_layout4_item5' " + css_style + ">" + thunmbnailLinkMake(imagelink[4], temp_thunmbnail_type[4], temp_size[4]) + "</div></td>" + 
			"</tr>" + 
			"<tr>" + 
			"<td width='106' height='106'><div id='free_layout4_item6' " + css_style + ">" + thunmbnailLinkMake(imagelink[5], temp_thunmbnail_type[5], temp_size[5]) + "</div></td>" + 
			"<td width='106' height='106'><div id='free_layout4_item7' " + css_style + ">" + thunmbnailLinkMake(imagelink[6], temp_thunmbnail_type[6], temp_size[6]) + "</div></td>" + 
			"</tr>" + 
			"</table>";
		}
		else	if(free_layout_num == "5")
		{
			table_html = 
			"<table summary='레이아웃 스타일5' cellpadding='0' cellspacing='1' id='free_layout5'>" + 
			"<tr>" + 
			"<td colspan='2' width='271' height='271' align='center'><div id='free_layout5_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" + 
			"<td colspan='2' width='271' height='271' align='center'><div id='free_layout5_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</div></td>" + 
			"</tr>" + 
			"<tr>" + 
			"<td width='135' height='135' align='center'><div id='free_layout5_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" + 
			"<td width='135' height='135' align='center'><div id='free_layout5_item4' " + css_style + ">" + thunmbnailLinkMake(imagelink[3], temp_thunmbnail_type[3], temp_size[3]) + "</div></td>" + 
			"<td width='135' height='135' align='center'><div id='free_layout5_item5' " + css_style + ">" + thunmbnailLinkMake(imagelink[4], temp_thunmbnail_type[4], temp_size[4]) + "</div></td>" + 
			"<td width='135' height='135' align='center'><div id='free_layout5_item6' " + css_style + ">" + thunmbnailLinkMake(imagelink[5], temp_thunmbnail_type[5], temp_size[5]) + "</div></td>" + 
			"</tr>" + 
			"</table>";
		}
		else	if(free_layout_num == "6")
		{
			table_html = 
			"<table summary='레이아웃 스타일6' cellpadding='0' cellspacing='1' id='free_layout6'>" + 
			"<tr>" + 
			"<td width='269' height='269'><div id='free_layout6_item1' " + css_style + ">" + thunmbnailLinkMake(imagelink[0], temp_thunmbnail_type[0], temp_size[0]) + "</div></td>" + 
			"<td width='269' height='269'><div id='free_layout6_item2' " + css_style + ">" + thunmbnailLinkMake(imagelink[1], temp_thunmbnail_type[1], temp_size[1]) + "</div></td>" + 
			"</tr>" + 
			"<tr><td colspan='2'>" + 
			"<table cellpadding='0' cellspacing='0'>" + 
			"<tr>" + 
			"<td width='108' height='108'><div id='free_layout6_item3' " + css_style + ">" + thunmbnailLinkMake(imagelink[2], temp_thunmbnail_type[2], temp_size[2]) + "</div></td>" + 
			"<td width='108' height='108'><div id='free_layout6_item4' " + css_style + ">" + thunmbnailLinkMake(imagelink[3], temp_thunmbnail_type[3], temp_size[3]) + "</div></td>" + 
			"<td width='108' height='108'><div id='free_layout6_item5' " + css_style + ">" + thunmbnailLinkMake(imagelink[4], temp_thunmbnail_type[4], temp_size[4]) + "</div></td>" + 
			"<td width='108' height='108'><div id='free_layout6_item6' " + css_style + ">" + thunmbnailLinkMake(imagelink[5], temp_thunmbnail_type[5], temp_size[5]) + "</div></td>" + 
			"<td width='108' height='108'><div id='free_layout6_item7' " + css_style + ">" + thunmbnailLinkMake(imagelink[6], temp_thunmbnail_type[6], temp_size[6]) + "</div></td>" + 
			"</tr>" + 
			"</table>" + 
			"</td></tr>" + 
			"</table>";
		}
	
		table_html = table_html.replaceAll('div_id', "onClick='photo.doPhotoClick(this, \"" + div_id + "\")'");
		result_html = "<span id='" + div_id + "'>\r\n" + table_html + "\r\n</span>";
	//	alert(result_html);
	}
	
	return result_html;
}


/**
 * 레이아웃포토 포스트 보기 - 마우스 오버 이벤트.
 * 
 */
function ImgMouseOver(e)
{
	targetImage = e.getElementsByTagName("img")[0];
	offsetWidth = (targetImage.width / 2) - 11;
	offsetHeight = (targetImage.height / 2) - 11;

	btnObject = e.getElementsByTagName("img")[1];
	
	if(!btnObject)
		e.innerHTML = e.innerHTML + "<div style='position:absolute;left:0px;top:0px'></div><img  src='" + viewer_image_url + "/ico_zoom.gif' width='0' height='0' style='display: ; position:absolute; left:" + offsetWidth + "; top:" + offsetHeight + "'>";
	else
		btnObject.style.display = "";

	fadeObject = e.getElementsByTagName("div")[0];
	fadeObject.style.width = targetImage.width;
	fadeObject.style.height = targetImage.height;
	fadeObject.style.backgroundColor = "#fff";
	fadeObject.style.filter = "alpha(opacity:20)";
	fadeObject.style.opacity = "0.2";
	fadeObject.style.display = "block";
}


/**
 * 레이아웃포토 포스트 보기 - 마우스 아웃 이벤트.
 * 
 */
function ImgMouseOut(e)
{
	btnObject = e.getElementsByTagName("img")[1];
	fadeObject = e.getElementsByTagName("div")[0];

	if(btnObject)
	{
		btnname = e.getElementsByTagName("img")[1];
		btnname.style.display = "none";
	}

	if(fadeObject)
	{
		fadeObject.style.display="none";
	}
}

/**
 * 레이아웃포토 html 생성 출력.
 * 
 */
function setLayoutPhoto2Preview(layoutType, freeLayoutType, colSize, rowSize, files)
{
	var resultHTML = LayoutPhotoMakeHTML(layoutType, freeLayoutType, colSize, rowSize, files);
//	alert(resultHTML);
	document.write(resultHTML);
}
