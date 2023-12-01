<?
echo 'REQUEST_METHOD : ' . $REQUEST_METHOD . '<BR>';
echo 'HTTP_REFERER : ' . $HTTP_REFERER . '<BR>';
if ( $REQUEST_METHOD == 'POST' && ereg($HTTP_HOST, $HTTP_REFERER) ) 
{
	echo '<p>입력 실행 성공</p>';
} else {
	echo '<p>입력 실행 불가</p>';
}
?>