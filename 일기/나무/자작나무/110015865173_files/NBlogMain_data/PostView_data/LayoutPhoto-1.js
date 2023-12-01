
/**
 * 탭 링크 함수
 * 
*/
function uploadChange(url)
{
	if(editor.thumbnailList.imageCount > 0)
	{
		if (confirm('현재 추가된 사진들을 사용할 수 없습니다.\n\n계속 진행하시겠습니까?'))
		{
		    location.href = url;
		}
	}
	else
	{
		location.href = url;
	}
}


var layout_type_selected = ""; // 선택 레이아웃포토 타입.
var max_layout_free_type_count = 6; // 자유형 서브타입 전체갯수

/**
 * 레이아웃 업로드 처리.
 * 
 */
function uploadProc()
{
	if (editor.thumbnailList.imageCount == 0)
	{
		alert("사진을 첨부 해주세요!");
		return;
	}

	if(layout_type_selected == "")
	{
		alert("타입을 지정 해야 합니다.");
		return;	
	}
	
	var need_image_count;
	var sort_thunmbnail_type;
	var free_size_info;
	var select_layout_type = 0;
	var temp_col_size = 0;
	var temp_row_size = 0;
	if(layout_type_selected == "free")
	{
		select_layout_type = getFreeLayoutSubTypeCheck();
		need_image_count = getFreeLayoutTypeNeedCountInfo(select_layout_type);
		free_size_info = getFreeLayoutTypeSizeInfo(need_image_count, select_layout_type);
	}
	else if(layout_type_selected == "sort")
	{
		temp_col_size = document.getElementById("col_size").value; // alert(temp_col_size.value);
		temp_row_size = document.getElementById("row_size").value; // alert(temp_row_size.value);
		need_image_count = getSortLayoutPhotoMaxImageCount(temp_col_size, temp_row_size);
		sort_thunmbnail_type = CheckSortThunbnailSize(temp_col_size);
	}

	if(editor.thumbnailList.imageCount < need_image_count)
	{
		alert("현재 타입은 최소 "+need_image_count+"개까지 업로드 해야 합니다.");
		return;	
	}
	
	var onimgcount = need_image_count;
	var uidx = 0;
	var ImageLinkInfo = new Array(onimgcount);
	
	var j = 0;
	var temp_image_url = "";
	for(i = 0; i < onimgcount; i++) // 이미지 개수만큰 for 를 돌면 된다.
	{
		var temp_img = document.getElementById("srcImg" + i);
		
		temp_image_url = temp_img.src; //alert( temp_image_url );
		temp_image_url = temp_image_url.replace(thumbnail_url, attach_url); //alert( temp_image_url2 );
		temp_image_url = temp_image_url.replace("?type=s1", ""); //alert( temp_image_url2 );
				
		ImageLinkInfo[i] = temp_image_url;
//		alert(ImageLinkInfo[i]);
	}

//	var result_html = LayoutPhotoMakeHTML(layout_type_selected, select_layout_type, temp_col_size.value, temp_row_size.value, ImageLinkInfo);
//	opener.SetValueMosaicImg(result_html);
	opener.setLayoutPhoto2Editor(layout_type_selected, select_layout_type, temp_col_size, temp_row_size, ImageLinkInfo.join('|'));
	
	self.close();
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
//function LayoutPhotoMakeHTML(layout_type, free_layout_num, sort_col_size, sort_row_size, imagelink)
//{
//	var result_html = "";
//	var div_id = parseInt((Math.random()*10000000)) + "_div";
//
//	if(layout_type == "free")
//	{
//		var temp_object = document.getElementById("free_layout" + free_layout_num);
//		if(temp_object)
//			result_html = temp_object.innerHTML;
//	}
//	else	if(layout_type == "sort")
//		result_html = document.getElementById("sort_layout").innerHTML;
//	
//	result_html = "<span id='" + div_id + "'>\r\n<table border='0' align='center' valign='middle' cellspacing=0 style='padding : 0 0 0 0'>\r\n" + result_html.replaceAll('div_id', "onClick='photo.doPhotoClick(this, \"" + div_id + "\")'") + "\r\n</table>\r\n</span>";
//	return result_html;
//}

/**
 * 모든 레이아웃 형태 이미지 레이어 초기화.
 * 
 * max_layout_item_count : 최대 이미지 갯수.
 */
function imageTypeLayerItemAllClear(max_layout_item_count)
{
	for(var i = 1; i <= max_layout_item_count; i++)
	{
		var temp_div1;
		for(var j = 1; j <= max_layout_free_type_count; j++)
		{
			temp_div1 = document.getElementById("free_layout" + j + "_item" + i);
			if(temp_div1 != null) temp_div1.innerHTML = "";
		}
		var temp_div2 = document.getElementById("sort_layout_item" + i);
		if(temp_div2 != null) temp_div2.innerHTML = "";
	}
}

/**
 * 모든 레이어 숨김처리.
 * 
 */
function imageTypeLayerAllHidden()
{
	var temp_div1;
	for(var i = 1; i <= max_layout_free_type_count; i++)
	{
		temp_div1 = document.getElementById("free_layout" + i);
		if(temp_div1 != null) temp_div1.style.display = "none";
		
		document.getElementById("lay" + i).src = image_url + "img_lay0" + i + ".gif";
	}
	var temp_div2 = document.getElementById("sort_layout");
	if(temp_div2 != null) temp_div2.style.display = "none";
}

/**
 * 미리보기 화면 - 선택 레이어 형태 출력
 * 
 * ty1 : 선택 레이아웃의 하위 타입 번호
 * ty2 : 선택 메인레이아웃 타입
 */
function imageTypeLayerChange(subtype)
{
	var temp_div;
	if(layout_type_selected == "free")
	{
		for(var i = 1; i <= max_layout_free_type_count; i++)
		{
			temp_div = document.getElementById(layout_type_selected + "_layout" + i);
			if(temp_div != null && subtype == i) temp_div.style.display = "";
			else if(temp_div != null) temp_div.style.display = "none";
		}
	}
}

/* 레이아웃포토 정령형 이미지 최대 업로드 제한 갯수 반환
 * 
 * mosaicType1 : 열갯수 정보
 * mosaicType2 : 줄갯수 정보
 * */
function getSortLayoutPhotoMaxImageCount(mosaicType1, mosaicType2)
{
	var max_upload_count_info;
	max_upload_count_info = parseInt(mosaicType1) * parseInt(mosaicType2);
	return max_upload_count_info;
}

/**
 * 자유형 서브타입 필요 파일 갯수 정보
 * 
 */
function getFreeLayoutTypeNeedCountInfo(select_layout_type)
{
	var need_imagecount;
	if(select_layout_type==1)
	{
		need_imagecount = 3;
	}
	else 	if(select_layout_type==2)
	{
		need_imagecount = 3;
	}
	else 	if(select_layout_type==3)
	{
		need_imagecount = 5;
	}
	else 	if(select_layout_type==4)
	{
		need_imagecount = 7;
	}
	else 	if(select_layout_type==5)
	{
		need_imagecount = 6;
	}
	else 	if(select_layout_type==6)
	{
		need_imagecount = 7;
	}
	return need_imagecount;
}

/**
 * 자유형 서브타입 썸네일 정보
 * 
 */
function getFreeLayoutTypeSizeInfo(need_imagecount, select_layout_type)
{
	var max_info;
	if(select_layout_type==1)
	{
		max_info = new Array(need_imagecount);
		max_info[0] = "3:362";
		max_info[1] = "2:179";
		max_info[2] = "2:179";
	}
	else 	if(select_layout_type==2)
	{
		nedd_imagecount = 3;
		max_info = new Array(need_imagecount);
		max_info[0] = "2:179";
		max_info[1] = "3:362";
		max_info[2] = "2:179";
	}
	else 	if(select_layout_type==3)
	{
		max_info = new Array(need_imagecount);
		max_info[0] = "2:133";
		max_info[1] = "3:271";
		max_info[2] = "2:133";
		max_info[3] = "2:133";
		max_info[4] = "2:133";
	}
	else 	if(select_layout_type==4)
	{
		max_info = new Array(need_imagecount);
		max_info[0] = "2:106";
		max_info[1] = "3:326";
		max_info[2] = "2:106";
		max_info[3] = "2:106";
		max_info[4] = "2:106";
		max_info[5] = "2:106";
		max_info[6] = "2:106";
	}
	else 	if(select_layout_type==5)
	{
		max_info = new Array(need_imagecount);
		max_info[0] = "3:271";
		max_info[1] = "3:271";
		max_info[2] = "2:135"; 
		max_info[3] = "2:135";
		max_info[4] = "2:135";
		max_info[5] = "2:135";
		max_info[6] = "2:135";
	}
	else 	if(select_layout_type==6)
	{
		max_info = new Array(need_imagecount);
		max_info[0] = "3:269";
		max_info[1] = "3:269";
		max_info[2] = "2:108";
		max_info[3] = "2:108";
		max_info[4] = "2:108";
		max_info[5] = "2:108";
		max_info[6] = "2:108";
	}
	return max_info;
}


/**
 * 자유형 서브타입 체크.
 * 
 */
function getFreeLayoutSubTypeCheck()
{
	var select_layout_type = "";
	var lay_type = document.getElementsByName("laytype");
	for(var count = 0; count < lay_type.length; count++)
	{
		if(lay_type[count].checked)
		{
			select_layout_type = lay_type[count].value;
			break;
		}
	}
	return select_layout_type;
}

/**
 * 미리보기 화면 초기화
 * 
 * ty1 : free 일경우, 선택 메인레이아웃 타입  |  sort 일경우, col_size
 * ty2 : 선택 레이아웃의 하위 타입 번호
 * ty3 : sort 일경우, row_size
 */
function imageEditViewInit()
{
	if(layout_type_selected == null || layout_type_selected == "") return;

	var imagecount = 0;
	var select_layout_type;
	var col_size;
	var row_size;
	var max_info;
	
	/* 자유형 */
	if(layout_type_selected == "free")
	{
		select_layout_type = getFreeLayoutSubTypeCheck();
		need_imagecount = getFreeLayoutTypeNeedCountInfo(select_layout_type)
		max_info = getFreeLayoutTypeSizeInfo(need_imagecount, select_layout_type);
	}
	/* 정렬형 */
	else	if(layout_type_selected == "sort")
	{
		col_size = document.getElementById("col_size").value;
		row_size = document.getElementById("row_size").value;

		max_info = CheckSortThunbnailSize(col_size);
		need_imagecount = parseInt(col_size) * parseInt(row_size);
	}
	
	imageTypeLayerItemAllClear(20);
	
	for(var i = 0; i < need_imagecount; i++)
	{
		if(document.getElementById("srcImg" + i) != null)
		{
			var temp_image_url = "";
			var temp_image_url1 = "";
			var temp_image_url2 = "";
			var temp_object;
			var temp_thunmbnail_type;
			var temp_size;
			var imgid = parseInt((Math.random()*10000000));

			if(layout_type_selected == "free")
			{
				temp_object = document.getElementById( layout_type_selected + "_layout" + select_layout_type + "_item" + (i+1));
				var temp_split = max_info[i].split(":");
				temp_thunmbnail_type = temp_split[0];
				temp_size = temp_split[1];
			}
			else if(layout_type_selected == "sort")
			{
				temp_object = document.getElementById( layout_type_selected + "_layout_item" + (i+1));				
				temp_thunmbnail_type = max_info[0];
				temp_size = max_info[1];
			}
			
			if(temp_object != null)
			{
				temp_image_url = document.getElementById("srcImg" + i).src; //alert( temp_image_url );
//				temp_image_url = temp_image_url.replace(attach_url, ""); //alert( temp_image_url );
				temp_image_url1 = temp_image_url.replace("?type=s1", "?type=s" + temp_thunmbnail_type); //alert( temp_image_url1 );
				
				temp_image_url2 = temp_image_url.replace(thumbnail_url, attach_url); //alert( temp_image_url2 );
				temp_image_url2 = temp_image_url2.replace("?type=s1", ""); //alert( temp_image_url2 );
				
//				temp_object.innerHTML = "<img src='" + thumbnail_url + temp_image_url + "?type=s" + temp_thunmbnail_type + "' width='" + temp_size + "' height='" + temp_size + "' id='userImg" + imgid + "' style='cursor: pointer' rel='" + document.getElementById("srcImg" + i).src + "' div_id>";
				temp_object.innerHTML = "<img src='" + temp_image_url1 + "' width='" + temp_size + "' height='" + temp_size + "' id='userImg" + imgid + "' style='cursor: pointer' rel='" + temp_image_url2 + "' div_id>";
//				alert(temp_object.innerHTML);
			}
		}
	}

}

/**
 * 레이아웃 타입 설정.
 * 
 */
function imageChange(imgid)
{
	if(imgid == 0)
		layout_type_selected = "sort";
	else
		layout_type_selected = "free";

	document.getElementById("imageViewLayer").style.background = "";
	imageTypeLayerAllHidden();
	imageTypeLayerChange(imgid);
	
	for(var i = 1; i <= max_layout_free_type_count; i++)
	{
		if(i == imgid)
		{
			document.getElementById("lay" + i).src = image_url + "img_lay0" + i + "_on.gif";
			document.getElementsByName("laytype")[i].checked = true;
		}
		else
			document.getElementById("lay" + i).src = image_url + "img_lay0" + i + ".gif";
	}
	
	imageEditViewInit();
}


/**
 * 테이블 전체 tr 삭제
 * 
 * tbody : 테이블 객체
 */
function clearTableRow(tbody)
{
	while(tbody.hasChildNodes())
		tbody.removeChild(tbody.firstChild);
}

/**
 * 열갯수에 따른 썸네일사이즈
 * 
 */
function CheckSortThunbnailSize(col_size)
{
	var returnSize = new Array(2);
	if(col_size == 2)
	{
		returnSize[0] = "3";
		returnSize[1] = "271";
	}
	else if(col_size == 3)
	{
		returnSize[0] = "2";
		returnSize[1] = "179";
	}
	else if(col_size == 4)
	{
		returnSize[0] = "2";
		returnSize[1] = "133";
	}
	else if(col_size == 5)
	{
		returnSize[0] = "2";
		returnSize[1] = "106";
	}

	return returnSize;
}

/**
 * 정렬형 미리보기 테이블 생성.
 * 
 * main_div_id : 생성 메인 div id
 * col_size : 열갯수
 * row_size : 줄갯수
 */
function sortTypeSelect(main_div_id, col_size, row_size)
{
	if(document.getElementById(main_div_id) != null)
	{
		document.getElementById("imageViewLayer").style.background = "";
		document.getElementById(main_div_id).style.display = "";
		var tbody = document.getElementById(main_div_id).getElementsByTagName("TBODY")[0];
		clearTableRow(tbody);
		var thumbnailSize = CheckSortThunbnailSize(col_size);
		var spanId = 1;
		for(var rowCount = 0; rowCount < row_size; rowCount++)
		{
			var temp_row = document.createElement("<TR>");
			var temp_col;
			var temp_span;
			for(var colCount = 0; colCount < col_size; colCount++)
			{
				temp_col = document.createElement("<TD>");
				temp_col.className = "i" + spanId + " y" + col_size;
				temp_col.width = thumbnailSize[1]; //alert(temp_col.width);
				temp_col.height = thumbnailSize[1]; //alert(temp_col.height);
				temp_span = document.createElement("<SPAN>");
				temp_span.id = "sort_layout_item" + (spanId);

				temp_col.appendChild(temp_span);
				temp_row.appendChild(temp_col);
				spanId++;
			}
			tbody.appendChild(temp_row);
		}
//		alert( tbody.innerHTML );
	}
}

/**
 * 열선택에 의한 줄수 제한.
 * 
 * col_size_object : 열정보 객체명
 * row_size_object : 줄정보 객체명
 */
function sortRowSizeCheck(col_size_object, row_size_object)
{
	var temp_col = document.getElementById(col_size_object);
	if(temp_col)
	{
		var temp_row = document.getElementById(row_size_object); //alert(temp_row.value);		
		if(temp_row)
		{
			var selectedIndex = temp_row.selectedIndex;
			while(temp_row.hasChildNodes()) temp_row.removeChild(temp_row.firstChild);
			
			var temp_option;
			for(var count = 0; count <= 5; count++)
			{				
				temp_option = document.createElement("<option>");
				
				if(count > 0)
				{
					if(count == 5 && temp_col.value == 5) break;
					
					temp_option.text = count + "줄"; //alert(temp_option.text);
					temp_option.value = count; //alert(temp_option.value);
				}
				else
				{
					temp_option.text = "세로";
					temp_option.value = "";
				}
				temp_row.options.add( temp_option );
			}
			temp_row.selectedIndex = selectedIndex;
		}
	}
}

/**
 * 정렬형 미리보기.
 * 
 * col_size_object : 열정보 객체명
 * row_size_object : 줄정보 객체명
 */
function sortTypePreview(col_size_object, row_size_object)
{
	var temp_col = document.getElementById(col_size_object); //alert(temp_col.value);
	var temp_row = document.getElementById(row_size_object); //alert(temp_row.value);
	if(temp_row.value > 0 && temp_col.value > 0)
	{
		document.getElementsByName("laytype")[0].checked = true;
		layout_type_selected = "sort";
		sortTypeSelect("sort_layout", temp_col.value, temp_row.value);
		imageEditViewInit();
	}
	else
	{
		layout_type_selected = "";
	}
}


/**
 * 업로드 파일 실제 삭제.
 * 
 */
function deleteUploadFileFromLocal(real_filename)
{
//	alert("real_filename = " + real_filename);
	if(real_filename != null && real_filename.length > 0)
	{
		var fileName = real_filename.replaceAll(thumbnail_url, "");
		fileName = fileName.replaceAll("?type=s1", "");
//		alert("fileName = " + fileName);
		if(fileName != null && fileName.length > 0)
		{
			var checkIndex = false;
			
			if(opener.document.getElementById("filelist"))
			{
				for(var i = 0; i < opener.document.getElementById("filelist").options.length; i++)
				{
					var temp_filename = opener.document.getElementById("filelist").options[i].value.split("@");			
//					alert("temp_filename[0] = " + temp_filename[0]);
//					alert("encodeURIComponent(temp_filename[0]) = " + encodeURIComponent(temp_filename[0]));
					if(temp_filename[0] != "" && temp_filename[0] == fileName)
					{
						if(i > 0)
						{
							opener.document.getElementById("filelist").options.selectedIndex = i;
//							alert(opener.document.getElementById("filelist").options.selectedIndex);
							checkIndex = true;
							break;
						}
					}
				}
				
				if(checkIndex) opener.DelFileList(blogID,'','');
			}
		}
	}
}
