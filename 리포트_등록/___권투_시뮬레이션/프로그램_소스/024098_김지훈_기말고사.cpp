// 024098_김지훈_기말고사.cpp
//
// 권투 게임 기말고사 과제

#include <windows.h> //윈도우즈 프로그램을 작성하는데 필요한 구조체,
                     // 각종 API 함수, 매크로, 메시지 등이 선언된 헤더 파일로
                     // 윈도우즈 프로그램에 반드시 포함해야 한다.
#include "resource.h" //윈도우즈 프로그램을 작성하는데 필요한 구조체,
#include <mmsystem.h>
//#include <math.h>

HINSTANCE g_hInst;   // 인스턴스 핸들을 저장하기 위한 전역 변수
                     // 윈도우 프로시저 선언
HWND	  g_hWnd;

void SetItem(HWND);
void ReadValue (HWND);
void DisplayEnergy();
void DisplayHit   ();
void    CALLBACK TimerProc (HWND, UINT, UINT_PTR, DWORD );
BOOL    CALLBACK DialogProc(HWND, UINT, WPARAM  , LPARAM);
LRESULT CALLBACK WndProc   (HWND, UINT, WPARAM  , LPARAM);

/* ------------------------- 변수 설정 ------------------------- */
static char player_A[20], player_B[20]; // 선수 이름
static int  prob_A, prob_B            ; // 확률
static int  att_A , att_B             ; // 맷집
static int  curAtt_A, curAtt_B		  ; // 현재 맷집

static int  sumHit_A, sumHit_B        ; // 총 공격 합계

static int  rndHit_A, rndHit_B        ; // 라운드 공격 합계

static int  round                     ; // 라운드
static int  roundTime                 ; // 라운드 초
static int  maxRound                  ; // 총 라운드 수
static int  maxHit                    ; // 라운드 당 공격수
static int  restTime	              ; // 설정된 휴식 시간
static int  chkRestTime               ; // 휴식 시간 체크
static POINT point = {280,0}          ; // 출력 좌표

int    resultY = 0                    ; // 결과 출력 좌표 Y값

// 윈도우즈 프로시저 (Window Procedure) 에 대한 선언
// WinMain() : 윈도우즈 어플리케이션의 진입점(Entry Point)
// 여기서 프로그램이 시작한다.
// 콘솔기반 C프로그램의 main()에 해당한다.
int APIENTRY WinMain(HINSTANCE hInstance,
					 HINSTANCE hpreInstance,
					 LPSTR szCmdLine, 
					 int nCmdShow) 
{
	static char szClassName[] = "024098_김지훈_중간고사"     ;
	static char szTitle[]     = "안녕하세요 - 024098 - 김지훈 입니다.";
	MSG        msg ; // 메시지 구조체
    HWND       hWnd; // 윈도우 핸들
	WNDCLASSEX wc  ; // 윈도우 클래스 구조체

	g_hInst = hInstance; // 인스턴스 핸들 저장
	
/*** 1. 윈도우 구조체에 값을 지정한다. ***/
    wc.cbSize=sizeof(WNDCLASSEX)              ; //윈도우 클래스 구조체의 크기
	wc.style         = CS_HREDRAW | CS_VREDRAW; // 클래스 스타일
	wc.lpfnWndProc   = WndProc                ; // 윈도우 프로시저 지정
	wc.cbClsExtra    = 0                      ; // 윈도우 클래스 데이터 영역
	wc.cbWndExtra    = 0                      ; // 윈도우 데이터 영역
    wc.hInstance     = hInstance              ; // 인스턴스 핸들
	wc.hIcon         = LoadIcon(hInstance,MAKEINTRESOURCE(IDI_ICON1))    ; // 아이콘 핸들
    wc.hCursor       = LoadCursor(hInstance,MAKEINTRESOURCE(IDC_CURSOR1))        ; // 사용할 커서 핸들
    wc.hbrBackground =(HBRUSH)GetStockObject(WHITE_BRUSH); // 바탕색 브러시 핸들
    wc.lpszMenuName  = MAKEINTRESOURCE(IDR_MENU1)        ; // 메뉴 이름
    wc.lpszClassName = szClassName                       ; // 윈도우 클래스 이름
    wc.hIconSm       = LoadIcon(hInstance,MAKEINTRESOURCE(IDI_ICON1))    ; // 작은 아이콘 핸들

/*** 2. 윈도우 클래스를 등록한다. ***/    
    RegisterClassEx(&wc);
    
/*** 3. 프레임 윈도우를 생성한다. ***/        
	hWnd = CreateWindow( 
		                 szClassName,           // registered class name           
		                 szTitle,               // window name                     
						 WS_OVERLAPPEDWINDOW,   // window style                    
						 0,						// horizontal position of window   
						 0,						// vertical position of window     
                         800,					// window width                    
						 600,					// window height                   
						 NULL,                  // handle to parent or owner window
						 NULL,                  // menu handle or child identifier 
						 hInstance,             // handle to application instance  
						 NULL                   // window-creation data
           );
	if ( !hWnd ) return (FALSE); //윈도우 생성에 실패하면 프로그램을 종료 합니다.

	g_hWnd = hWnd;

/*** 4. 프레임 윈도우를 화면에 나타낸다. ***/
    ShowWindow(hWnd,nCmdShow); // 윈도우를 화면에 나타낸다.
    UpdateWindow(hWnd)       ; // 윈도우의 클라이언트 영역을 칠한다.

/*** 5. 메시지 루프:루프를 돌며 메시지 큐로부터 메시지를 얻어와 처리한다. ***/
	while( GetMessage(&msg,NULL,0,0) )
	{
		TranslateMessage( &msg );
		DispatchMessage( &msg );
	}

	return msg.wParam;
}

/*--------------------------------------------------------------
 함수명    : SetItem
 아규먼트1 : HWND hDlg
             handle to dialog box
 기능      : 게임에 이용될 설정 대화상자의 속성값을 할당합니다.
---------------------------------------------------------------*/
void SetItem(HWND hDlg) {
      /* 한계 값 설정 */
      SendMessage(GetDlgItem(hDlg,IDC_ROUND     ),EM_LIMITTEXT,(WPARAM) 2,0);
      SendMessage(GetDlgItem(hDlg,IDC_ROUND_HIT ),EM_LIMITTEXT,(WPARAM) 3,0);
      SendMessage(GetDlgItem(hDlg,IDC_REST_TIME ),EM_LIMITTEXT,(WPARAM) 3,0);
	  SendMessage(GetDlgItem(hDlg,IDC_PLAYER_A),EM_LIMITTEXT,(WPARAM)20,0);
	  SendMessage(GetDlgItem(hDlg,IDC_PROB_A  ),EM_LIMITTEXT,(WPARAM)3 ,0);
	  SendMessage(GetDlgItem(hDlg,IDC_ATT_A   ),EM_LIMITTEXT,(WPARAM)3 ,0);

	  SendMessage(GetDlgItem(hDlg,IDC_PLAYER_B),EM_LIMITTEXT,(WPARAM)20,0);
	  SendMessage(GetDlgItem(hDlg,IDC_PROB_B  ),EM_LIMITTEXT,(WPARAM)3 ,0);
	  SendMessage(GetDlgItem(hDlg,IDC_ATT_B   ),EM_LIMITTEXT,(WPARAM)3 ,0);

      /* 대화 상자에 게임 설정 부분 Setting  */
	  SetDlgItemInt (hDlg,IDC_ROUND    ,maxRound,TRUE); // 총 라운드 수
	  SetDlgItemInt (hDlg,IDC_ROUND_HIT,maxHit	,TRUE); // 라운드 당 공격수
	  SetDlgItemInt (hDlg,IDC_REST_TIME,restTime,TRUE); // 휴식 시간

	  SetDlgItemText(hDlg,IDC_PLAYER_A,player_A   ); // A 선수 이름
	  SetDlgItemInt (hDlg,IDC_PROB_A  ,prob_A,TRUE); // A 선수 확률
	  SetDlgItemInt (hDlg,IDC_ATT_A   ,att_A ,TRUE); // A 선수 맷집

	  SetDlgItemText(hDlg,IDC_PLAYER_B,player_B   ); // B 선수 이름
	  SetDlgItemInt (hDlg,IDC_PROB_B  ,prob_B,TRUE); // B 선수 확률
	  SetDlgItemInt (hDlg,IDC_ATT_B   ,att_B ,TRUE); // B 선수 맷집
}
/*--------------------------------------------------------------
 함수명    : ReadValue
 아규먼트1 : HWND hDlg
             handle to dialog box
 기능      : 게임에 이용될 설정 대화상자의 속성값을 할당합니다.
---------------------------------------------------------------*/
void ReadValue(HWND hDlg) {
	  maxRound = GetDlgItemInt(hDlg,IDC_ROUND     , NULL, TRUE ); // 총 라운드 수    
	  maxHit   = GetDlgItemInt(hDlg,IDC_ROUND_HIT , NULL, TRUE ); // 라운드 당 공격수
	  restTime = GetDlgItemInt(hDlg,IDC_REST_TIME , NULL, TRUE ); // 휴식 시간       

	  GetDlgItemText(hDlg,IDC_PLAYER_A,player_A, sizeof(player_A) ); // A 선수 이름
	  prob_A = GetDlgItemInt(hDlg,IDC_PROB_A, NULL, TRUE ); // A 선수 확률
	  att_A  = GetDlgItemInt(hDlg,IDC_ATT_A , NULL, TRUE ); // A 선수 맷집

	  GetDlgItemText(hDlg,IDC_PLAYER_B,player_B, sizeof(player_B) ); // B 선수 이름
	  prob_B = GetDlgItemInt(hDlg,IDC_PROB_B, NULL, TRUE ); // B 선수 확률
	  att_B  = GetDlgItemInt(hDlg,IDC_ATT_B , NULL, TRUE ); // B 선수 맷집
}
/*--------------------------------------------------------------
 함수명    : InitValue
 기능      : 초기 변수값 설정.
---------------------------------------------------------------*/
void InitValue() {
	// 초기값 설정
	wsprintf(player_A,"%s","홍길동");
	prob_A      = 50 ;
	att_A       = 100;
	wsprintf(player_B,"%s","이순신");
	prob_B      = 100;
	att_B       = 100;

	maxRound    = 3  ;
	maxHit	    = 10 ;
	restTime    = 3  ;

	curAtt_A = att_A ;
	curAtt_B = att_B ;
	sumHit_A = 0;
	sumHit_B = 0; // 총 공격 합계
}
/*--------------------------------------------------------------
 함수명    : RecoverRound
 기능      : 게임 설정 메뉴를 눌렀을 경우 값을 초기화
---------------------------------------------------------------*/
void RecoverRound (HWND hWnd) {

	point.x = 280;
	point.y = 0;
	resultY = 0;

	round    =1; // 라운드
	roundTime=1; // 라운드 초
	chkRestTime = 0  ; // 휴식 시간 체크

	curAtt_A = att_A;
	curAtt_B = att_B;

	sumHit_A = 0;
	sumHit_B = 0; // 총 공격 합계

	InvalidateRect(hWnd,NULL,TRUE);
}

/*--------------------------------------------------------------
 함수명    : Judgment
 기능      : 승패를 결정한 결과를 출력합니다.
---------------------------------------------------------------*/
void Judgment (HDC hdc, int ko) {
	char szMessage[50]; // 경기 진행 메시지 출력
		wsprintf(szMessage,"최종 결과 : %d 대 %d ", sumHit_A, sumHit_B);
		//MessageBox(g_hWnd,szMessage,"dd",MB_OK);
		TextOut(hdc, 0, resultY + (15 * round), szMessage, strlen(szMessage));
		if ( sumHit_A == sumHit_B ) {
			wsprintf(szMessage,"무승부");
			TextOut(hdc, 0, resultY + (15 * (round+1) ), szMessage, strlen(szMessage));
		} else if ( sumHit_A > sumHit_B ) {
			if ( ko ) {
				wsprintf(szMessage,"A팀 %s KO 승리", player_A);
			} else {
				wsprintf(szMessage,"A팀 %s 승리", player_A);
			}
			TextOut(hdc, 0, resultY + (15 * (round+1) ), szMessage, strlen(szMessage));
		} else if ( sumHit_A < sumHit_B ) {
			if ( ko ) {
				wsprintf(szMessage,"B팀 %s KO 승리", player_B);
			} else {
				wsprintf(szMessage,"B팀 %s 승리", player_B);
			}
			TextOut(hdc, 0, resultY + (15 * (round+1) ), szMessage, strlen(szMessage));
		}
}

void CALLBACK TimerProc(HWND hWnd, UINT uMsg, UINT_PTR idEvent, DWORD dwTime)
{
	HDC hdc;
	HFONT font,oldfont;
	hdc = GetDC(hWnd);

	font = CreateFont(12,0,0,0,0,0,0,0,HANGUL_CHARSET,3,2,1,VARIABLE_PITCH|FF_ROMAN,"돋움");
	oldfont = (HFONT) SelectObject(hdc,font);
	char szMessage[100]; // 경기 진행 메시지 출력

	if ( round <= maxRound ) {
		if ( curAtt_A <= 0 || curAtt_B <= 0 ) {
			SetTextColor(hdc,RGB(255,0,0));
			Judgment (hdc,1); // 판정
		} else {
			
			if ( roundTime > maxHit ) {
				roundTime = 1;
				rndHit_A  = 0;
				rndHit_B  = 0;
			}
/*
	wsprintf(szMessage,"[%d / %d / %d / %d / %d ]",chkRestTime , restTime, roundTime, maxHit, maxRound);
	MessageBox(hWnd,szMessage,"",MB_OK);
*/
			if ( roundTime == maxHit ) {
				chkRestTime = restTime;
				if ( maxRound > 1 ) {
					round++     ; // 라운드 증가
				}
			} else if ( chkRestTime > 0 ) {
				if ( chkRestTime == restTime ) {
					point.y += 15; // 칸 내리기
					wsprintf(szMessage,"[%d초간 휴식중...]",restTime);
					TextOut(hdc, point.x, point.y, szMessage, strlen(szMessage));
				}
				chkRestTime--;
			}

			if ( chkRestTime == 0 || chkRestTime == restTime ) {
				int  hit_A, hit_B ; // 주먹질 수

				hit_A = (rand()%10) + 1;
				hit_B = (rand()%10) + 1;
				int attHit_A = hit_A *  prob_A / 100 ;
				int attHit_B = hit_B *  prob_B / 100 ;
				sumHit_A += attHit_A;
				sumHit_B += attHit_B;
				rndHit_A += attHit_A;
				rndHit_B += attHit_B;

				/* 적중된 히트수를 맷집에서 빼줌 */
				curAtt_B -= attHit_A;
				curAtt_A -= attHit_B;

				//SetBkColor  (hdc, RGB(255,0,0));
				SetTextColor(hdc,RGB(0,0,255 ));
				//SetBkMode (hdc,TRANSPARENT);

				// 회전 결과 출력
				if ( roundTime == maxHit || curAtt_A<=0 || curAtt_B<=0) {
					wsprintf(szMessage,"%d 회전 결과 : %d 대 %d ", round-1, rndHit_A, rndHit_B);
					resultY = resultY + (15 * (round-1));
					TextOut(hdc, 0, resultY, szMessage, strlen(szMessage));
				}

				if ( round==1 && roundTime==1 ) {
					wsprintf(szMessage,"[%s]", "A선수");
					TextOut(hdc, point.x, point.y, szMessage, strlen(szMessage));
					wsprintf(szMessage,"[%s]", "B선수");
					TextOut(hdc, point.x+250, point.y, szMessage, strlen(szMessage));
				}
				point.y += 15; // 칸 내리기

				if ( roundTime == 1 ) {
					//point.y += 15; // 칸 내리기
					wsprintf(szMessage,"[%d ROUND]", round);
					TextOut(hdc, point.x-70, point.y, szMessage, strlen(szMessage));
				}

				wsprintf(szMessage,"[ %d 초] %d 개 펀치중 %d개 적중 -> 맷집 %d ",
					roundTime, hit_A, attHit_A, curAtt_A );
				TextOut(hdc, point.x, point.y, szMessage, strlen(szMessage));

				wsprintf(szMessage,"[ %d 초] %d 개 펀치중 %d개 적중 -> 맷집 %d ",
					roundTime, hit_B, attHit_B, curAtt_B );
				TextOut(hdc, point.x+250, point.y, szMessage, strlen(szMessage));

				InvalidateRect(hWnd,NULL,FALSE); 

				roundTime++; // 라운드 초 증가
			}
		}
	} else {
		SetTextColor(hdc,RGB(255,0,0));
		Judgment (hdc,0); // 판정
	}

	SelectObject(hdc,oldfont);
	DeleteObject(font);
	ReleaseDC(hWnd,hdc);
}

BOOL CALLBACK DialogProc(HWND hDlg, UINT uMsg, WPARAM wParam, LPARAM lParam) 
{

	switch (uMsg) {
	case WM_INITDIALOG:
		SetItem(hDlg);
		ReadValue (hDlg);
		RecoverRound(hDlg);
		return TRUE;
	case WM_COMMAND:
		switch (wParam) {
			case IDOK:
				ReadValue(hDlg);
				EndDialog(hDlg,0);
				RecoverRound(hDlg);
				break;
			case IDCANCEL:
				EndDialog(hDlg,0);
				break;
		}
		return TRUE;
	}
	return FALSE;
}

DWORD WINAPI ThreadFunc(LPVOID temp) {
	for(;;) {
			DisplayHit   ();
			DisplayEnergy();
		Sleep(100);
		//if (xx==1) xx=0;
	}
	return 0;
}


int hPosXFA=10,hPosXTA=180,hPosYFA=260,hPosYTA=310;

/*--------------------------------------------------------------
 함수명    : DisplayHit
 기능      : 실효 타격수를 계산한 수치를 수평그래프 형태로 표시합니다.
---------------------------------------------------------------*/
void DisplayHit   () {
	HDC hdc;
	HBRUSH hBrush , hOldBrush	;
	HBRUSH hHBrush, hHOldBrush	;

	hdc=GetDC(g_hWnd);
	hBrush = CreateSolidBrush(RGB(0,0,255));
	hOldBrush=(HBRUSH)SelectObject(hdc,hBrush);
	Rectangle(hdc,hPosXFA,hPosYFA,hPosXTA,hPosYTA);

	int barSize = hPosXTA - hPosXFA;
	int prgA=0;
	int sumTotAtt = sumHit_A + sumHit_B;
	int cPrgA=50;
	if ( sumHit_A > 0 ) {
		prgA = (sumHit_A*100)/sumTotAtt;
	} else {
		prgA=50;
	}
	
	TextOut(hdc,hPosXFA+ 20,hPosYFA-25,player_A,strlen(player_A));

	cPrgA = (barSize*prgA) / 100;
	TextOut(hdc,hPosXFA+ 20,hPosYFA-25,player_A,strlen(player_A));
	TextOut(hdc,hPosXFA+100,hPosYFA-25,player_B,strlen(player_B));
	char dd[100];
//	wsprintf(dd,"barSize : %d / prgA : %d / cPrgA : %d",barSize,prgA,cPrgA);
	wsprintf(dd,"       %s       "," ");
	TextOut(hdc,hPosXTA-70,hPosYTA+20,dd,strlen(dd));

//	if ( cPrgA == 0 ) { cPrgA =1; MessageBox(g_hWnd,"알림",dd,MB_OK); }

	char percent[10];
	wsprintf(percent,"%d %%(%d hit)",prgA    ,sumHit_A);
	TextOut(hdc,hPosXFA   ,hPosYTA,percent,strlen(percent));
	wsprintf(percent,"%d %%(%d hit)",100-prgA,sumHit_B);
	TextOut(hdc,hPosXTA-70,hPosYTA,percent,strlen(percent));

	hHBrush = CreateSolidBrush(RGB(255,0,0));
	hHOldBrush=(HBRUSH)SelectObject(hdc,hHBrush);

	Rectangle(hdc,hPosXFA,hPosYFA,cPrgA+hPosXFA,hPosYTA);

	SelectObject(hdc,hOldBrush );
	SelectObject(hdc,hHOldBrush);
	DeleteObject(hBrush);
	DeleteObject(hHBrush);
	ReleaseDC(g_hWnd,hdc);
}

/*--------------------------------------------------------------
 함수명    : DisplayEnergy
 기능      : 맺집 상황을 수직형 그래프 형태로 표시 합니다.
---------------------------------------------------------------*/
int ePosXFA=30 ,ePosXTA=80 ,ePosYFA=350,ePosYTA=500;
int ePosXFB=100,ePosXTB=150,ePosYFB=350,ePosYTB=500;
void DisplayEnergy() {
	HDC hdc;
	HBRUSH hBrush , hOldBrush	;
	HBRUSH hPBrush, hPOldBrush	;
	hdc=GetDC(g_hWnd);

	hBrush = CreateSolidBrush(RGB(255,0,0));
	hOldBrush=(HBRUSH)SelectObject(hdc,hBrush);
	Rectangle(hdc,ePosXFA,ePosYFA+1,ePosXTA,ePosYTA+1);
	Rectangle(hdc,ePosXFB,ePosYFB+1,ePosXTB,ePosYTB+1);
	
	char dd[100];
	int prgA=(curAtt_A*100)/att_A;
	int prgB=(curAtt_B*100)/att_B;
	int barSize = ePosYTA - ePosYFA;
	int cPrgA = (barSize*(100-prgA)) / 100;
	int cPrgB = (barSize*(100-prgB)) / 100;
	wsprintf(dd,"att_A : %d, curAtt_A : %d, prs %d, cPrgA %d",att_A, curAtt_A,prgA, cPrgA);
	// TextOut(hdc,100,500,dd,strlen(dd));
	// MessageBox(g_hWnd,dd,"info",MB_OK);

	hPBrush = CreateSolidBrush(RGB(0,0,0));
	hPOldBrush=(HBRUSH)SelectObject(hdc,hPBrush);

	if ( curAtt_A > 0 ) {
		Rectangle(hdc,ePosXFA,ePosYFA+1,ePosXTA,ePosYFA + cPrgA);
	} else {
		Rectangle(hdc,ePosXFA,ePosYFA+1,ePosXTA,ePosYTA);
	}
	if ( curAtt_B > 0 ) {
		Rectangle(hdc,ePosXFB,ePosYFB+1,ePosXTB,ePosYFB + cPrgB);
	} else {
		Rectangle(hdc,ePosXFB,ePosYFB+1,ePosXTB,ePosYTB);
	}

	char percent[20];
	wsprintf(percent,"%d / %d  ",curAtt_A,att_A);
	TextOut(hdc,ePosXFA,ePosYTA+1,percent,strlen(percent));
	wsprintf(percent,"%d / %d  ",curAtt_B,att_B);
	TextOut(hdc,ePosXFA+70,ePosYTA+1,percent,strlen(percent));
	
	SelectObject(hdc,hOldBrush );
	DeleteObject(hBrush );
	SelectObject(hdc,hPOldBrush);
	DeleteObject(hPBrush);

	ReleaseDC(g_hWnd,hdc);
}

/*--------------------------------------------------------------
 함수명    : StartThread
 아규먼트1 : DWORD ThreadID
 아규먼트2 : HANDLE hThread
 기능      : 게임에 이용될 설정 대화상자의 속성값을 할당합니다.
---------------------------------------------------------------*/
//StartThread(DWORD ThreadID,HANDLE hThread); // Thread 시작
void StartThread(DWORD ThreadID,HANDLE hThread) {
	hThread = CreateThread(NULL,0,ThreadFunc,NULL,0,&ThreadID);
	SetThreadPriority(hThread,THREAD_PRIORITY_TIME_CRITICAL);
	CloseHandle  (hThread);
}

/*--------------------------------------------------------------
 함수명    : StartBGMusic
 기능      : 배경 음악(Eye OF The Tiger) 재생
---------------------------------------------------------------*/
void StartBGMusic() {
	// 리소스에 있는 WAVE를 연주하기
	PlaySound(MAKEINTRESOURCE(IDR_WAVE1), g_hInst, SND_RESOURCE | SND_ASYNC | SND_LOOP);
}

// 윈도우 프로시져 (Window Procedure)
LRESULT CALLBACK WndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam) 
{
	DWORD ThreadID;
	HANDLE hThread;

	// switch-case 문을 써서 메시지의 종류에 따라 
	// 적절한 작업을 수행한다.
	switch( uMsg ) 
	{
		case WM_PAINT:
			resultY = 0;
			PAINTSTRUCT ps; // 페인트 구조체를 얻어 옵니다.
			HDC hdc;
			HFONT font,oldfont;
			hdc = BeginPaint(hWnd,&ps);
			font = CreateFont(12,0,0,0,0,0,0,0,HANGUL_CHARSET,3,2,1,VARIABLE_PITCH|FF_ROMAN,"돋움");

			oldfont = (HFONT) SelectObject(hdc,font);
			// BeginPaint 함수를 이용하여, DC를 얻은뒤
			// TextOut 함수를 이용하여 문자열을 출력한다.
			char szMessage[100];
			wsprintf(szMessage,"%s","========================");
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
			wsprintf(szMessage,"A팀 선수 이름 : %s ",player_A);resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
			wsprintf(szMessage,"확률 : %d / 맷집 : %d ",prob_A, att_A );resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
/*
			wsprintf(szMessage,"현재 맷집 : %d ",curAtt_A);resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
*/
			wsprintf(szMessage,"%s","========================");resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));

			wsprintf(szMessage,"B팀 선수 이름 : %s ",player_B);resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
			wsprintf(szMessage,"확률 : %d / 맷집 : %d ",prob_B, att_B );resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
/*
			wsprintf(szMessage,"현재 맷집 : %d ",curAtt_B);resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
*/
			wsprintf(szMessage,"%s","========================");resultY = resultY + 15;
			TextOut(hdc,0  , resultY, szMessage, strlen(szMessage));
			SelectObject(hdc,oldfont);
			DeleteObject(font);
			EndPaint(hWnd,&ps);
			break;
		case WM_CREATE : // 윈도우가 생성 될때
			InitValue    ();
			DisplayHit   ();
			DisplayEnergy();
			break;
		case WM_LBUTTONDBLCLK:
			KillTimer(hWnd,1);
			break;
		case WM_COMMAND: // 윈도우에서 명령이 실행 되었을때
			if(LOWORD(wParam) == ID_SETUP) { // 게임 설정
				RecoverRound (hWnd);
				KillTimer(hWnd,1);
				DialogBox(g_hInst, MAKEINTRESOURCE(IDD_DIALOG1),hWnd,(DLGPROC) DialogProc);
			} else if ( LOWORD(wParam) == ID_START ) { // 게임 시작
				StartThread(ThreadID, hThread); // Thread 시작
				StartBGMusic();					// 배경음악 삽입
				RecoverRound (hWnd);
				SetTimer(hWnd,1,1000,(TIMERPROC)TimerProc);
			} else if ( LOWORD(wParam) == ID_EXIT ) { // 게임 종료
				DestroyWindow(hWnd);
			}
			break;
		case WM_DESTROY: // 프로그램에 종료하는 경우
			KillTimer(hWnd,1);
			PostQuitMessage(0); // WM_QUIT 메시지를 발생시켜 메시지 루프를 중단한다.
			break;
		default: // 처리하지 않은 메시지는 
			return DefWindowProc(hWnd, uMsg, wParam, lParam);
	}
	return 0;
}
