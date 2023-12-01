VERSION 5.00
Object = "{67397AA1-7FB1-11D0-B148-00A0C922E820}#6.0#0"; "MSADODC.OCX"
Object = "{CDE57A40-8B86-11D0-B3C6-00A0C90AEA82}#1.0#0"; "MSDATGRD.OCX"
Begin VB.Form Form1 
   Caption         =   "부조금 관리"
   ClientHeight    =   5925
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   7155
   LinkTopic       =   "Form1"
   ScaleHeight     =   5925
   ScaleWidth      =   7155
   StartUpPosition =   3  'Windows 기본값
   Begin VB.CommandButton cmdUpdate 
      Caption         =   "저장"
      Height          =   300
      Left            =   2160
      TabIndex        =   17
      Top             =   240
      Width           =   855
   End
   Begin VB.OptionButton searchGb 
      Caption         =   "신부"
      Height          =   375
      Index           =   2
      Left            =   5040
      TabIndex        =   6
      Top             =   240
      Width           =   735
   End
   Begin VB.OptionButton searchGb 
      Caption         =   "신랑"
      Height          =   375
      Index           =   1
      Left            =   4200
      TabIndex        =   5
      Top             =   240
      Width           =   735
   End
   Begin VB.OptionButton searchGb 
      Caption         =   "전체"
      Height          =   375
      Index           =   0
      Left            =   3360
      TabIndex        =   4
      Top             =   240
      Value           =   -1  'True
      Width           =   735
   End
   Begin MSDataGridLib.DataGrid DataGrid1 
      Bindings        =   "Form1.frx":0000
      Height          =   3615
      Left            =   120
      TabIndex        =   3
      Top             =   720
      Width           =   6855
      _ExtentX        =   12091
      _ExtentY        =   6376
      _Version        =   393216
      AllowUpdate     =   -1  'True
      DefColWidth     =   67
      HeadLines       =   2
      RowHeight       =   15
      AllowAddNew     =   -1  'True
      AllowDelete     =   -1  'True
      BeginProperty HeadFont {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "굴림"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "굴림"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ColumnCount     =   2
      BeginProperty Column00 
         DataField       =   ""
         Caption         =   ""
         BeginProperty DataFormat {6D835690-900B-11D0-9484-00A0C91110ED} 
            Type            =   0
            Format          =   ""
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   1042
            SubFormatType   =   0
         EndProperty
      EndProperty
      BeginProperty Column01 
         DataField       =   ""
         Caption         =   ""
         BeginProperty DataFormat {6D835690-900B-11D0-9484-00A0C91110ED} 
            Type            =   0
            Format          =   ""
            HaveTrueFalseNull=   0
            FirstDayOfWeek  =   0
            FirstWeekOfYear =   0
            LCID            =   1042
            SubFormatType   =   0
         EndProperty
      EndProperty
      SplitCount      =   1
      BeginProperty Split0 
         BeginProperty Column00 
         EndProperty
         BeginProperty Column01 
         EndProperty
      EndProperty
   End
   Begin VB.CommandButton cmdInsert 
      Caption         =   "입력"
      Height          =   300
      Left            =   120
      TabIndex        =   2
      Top             =   240
      Width           =   855
   End
   Begin MSAdodcLib.Adodc Adodc1 
      Height          =   450
      Left            =   240
      Top             =   5160
      Visible         =   0   'False
      Width           =   3015
      _ExtentX        =   5318
      _ExtentY        =   794
      ConnectMode     =   0
      CursorLocation  =   3
      IsolationLevel  =   -1
      ConnectionTimeout=   15
      CommandTimeout  =   30
      CursorType      =   3
      LockType        =   3
      CommandType     =   1
      CursorOptions   =   0
      CacheSize       =   50
      MaxRecords      =   0
      BOFAction       =   0
      EOFAction       =   0
      ConnectStringType=   1
      Appearance      =   1
      BackColor       =   -2147483643
      ForeColor       =   -2147483640
      Orientation     =   0
      Enabled         =   -1
      Connect         =   "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=F:\학교\비쥬얼프로그래밍\과제\기말고사\wedding.mdb;Persist Security Info=False"
      OLEDBString     =   "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=F:\학교\비쥬얼프로그래밍\과제\기말고사\wedding.mdb;Persist Security Info=False"
      OLEDBFile       =   ""
      DataSourceName  =   ""
      OtherAttributes =   ""
      UserName        =   ""
      Password        =   ""
      RecordSource    =   "select * from wedding_main"
      Caption         =   "Adodc1"
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "굴림"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      _Version        =   393216
   End
   Begin VB.CommandButton cmdDelete 
      Caption         =   "삭제"
      Height          =   300
      Left            =   1080
      TabIndex        =   1
      Top             =   240
      Width           =   975
   End
   Begin VB.CommandButton cmdSelect 
      Caption         =   "조회"
      Height          =   300
      Left            =   6000
      TabIndex        =   0
      Top             =   240
      Width           =   975
   End
   Begin VB.Frame Frame1 
      Caption         =   "통계"
      Height          =   1335
      Left            =   120
      TabIndex        =   7
      Top             =   4440
      Width           =   6855
      Begin VB.Label lbWon3 
         Caption         =   "만원"
         Height          =   255
         Left            =   6240
         TabIndex        =   16
         Top             =   960
         Width           =   375
      End
      Begin VB.Label lbWon2 
         Caption         =   "만원"
         Height          =   375
         Left            =   6240
         TabIndex        =   15
         Top             =   600
         Width           =   375
      End
      Begin VB.Label lbWon1 
         Caption         =   "만원"
         Height          =   255
         Left            =   6240
         TabIndex        =   14
         Top             =   240
         Width           =   495
      End
      Begin VB.Label lbTotal3 
         Alignment       =   1  '오른쪽 맞춤
         Caption         =   "0"
         Height          =   255
         Left            =   5160
         TabIndex        =   13
         Top             =   960
         Width           =   1005
      End
      Begin VB.Label lbTotal2 
         Alignment       =   1  '오른쪽 맞춤
         Caption         =   "0"
         Height          =   255
         Left            =   5160
         TabIndex        =   12
         Top             =   600
         Width           =   1005
      End
      Begin VB.Label lbTotal1 
         Alignment       =   1  '오른쪽 맞춤
         Caption         =   "0"
         Height          =   255
         Left            =   5160
         TabIndex        =   11
         Top             =   240
         Width           =   1005
      End
      Begin VB.Label lbResult3 
         Caption         =   "전체"
         Height          =   255
         Left            =   4440
         TabIndex        =   10
         Top             =   960
         Width           =   855
      End
      Begin VB.Label lbResult2 
         Caption         =   "신부"
         Height          =   255
         Left            =   4440
         TabIndex        =   9
         Top             =   600
         Width           =   735
      End
      Begin VB.Label lbResult1 
         Caption         =   "신랑"
         Height          =   255
         Left            =   4440
         TabIndex        =   8
         Top             =   240
         Width           =   615
      End
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdDelete_Click()
    Dim Response As Integer
    Response = MsgBox("삭제하시겠습니까?", vbYesNo + vbInformation)
    If Response = 6 Then ' ok 이면
        Adodc1.Recordset.Delete
        cmdSelect_Click
    End If
End Sub

Private Sub cmdInsert_Click()
    Form2.Show
End Sub
Private Sub cmdSelect_Click()
    Adodc1.ConnectionString = dbStr
    Adodc1.CommandType = adCmdText
    
    Dim sql As String
    Dim where As String
    
    sql = "select gubun as 구분, name as 이름, han_name as 한자이름, sex as 성별, help_money as 금액, visit_time as 방문일자 from wedding_main "
    If searchGb(1).Value Then
        where = "where gubun = '신랑'"
    End If
    If searchGb(2).Value Then
        where = "where gubun = '신부'"
    End If
    
    If sort = "" Then
        where = where & " ORDER BY gubun "
    Else
        where = where & " ORDER BY " & sort
    End If

    Adodc1.RecordSource = sql & where
    Adodc1.Refresh
    colWidthFix
    totalPrint
End Sub

Private Sub cmdUpdate_Click()
    Adodc1.Recordset.Update
    MsgBox "저장되었습니다", vbInformation
End Sub

Private Sub DataGrid1_HeadClick(ByVal ColIndex As Integer)
    Dim sort As String
    sort = Switch(ColIndex = 0, "gubun", ColIndex = 1, "name", ColIndex = 2, "han_name", _
                  ColIndex = 3, "sex", ColIndex = 4, "help_money", ColIndex = 5, "visit_time")
    Adodc1.ConnectionString = dbStr
    Adodc1.CommandType = adCmdText
    
    Dim sql As String
    Dim where As String
    
    sql = "select gubun as 구분, name as 이름, han_name as 한자이름, sex as 성별, help_money as 금액, visit_time as 방문일자 from wedding_main "
    If searchGb(1).Value Then
        where = "where gubun = '신랑'"
    End If
    If searchGb(2).Value Then
        where = "where gubun = '신부'"
    End If
    where = where & " ORDER BY " & sort

    Adodc1.RecordSource = sql & where
    Adodc1.Refresh
    colWidthFix
    totalPrint
End Sub

Private Sub Form_load()
    dbStr = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & CurDir & "\wedding.mdb;Persist Security Info=False"
    cmdSelect_Click
End Sub
Private Sub cmdQuit_Click()
   End
End Sub
Private Sub colWidthFix()
    Form1.DataGrid1.Columns(0).Width = 500  ' 구분
    Form1.DataGrid1.Columns(1).Width = 1000 ' 이름
    Form1.DataGrid1.Columns(2).Width = 800  ' 한자이름
    Form1.DataGrid1.Columns(3).Width = 800  ' 성별
    Form1.DataGrid1.Columns(4).Width = 1000 ' 금액
    Form1.DataGrid1.Columns(5).Width = 2100 ' 방문일자
    Form1.DataGrid1.Columns(4).Alignment = dbgRight
    'DataGrid1.Columns(4).NumberFormat = "#,##0"
End Sub

Private Sub totalPrint()
    '접속
    Set cn = New ADODB.Connection
    cn.ConnectionString = dbStr
    cn.Open
    Dim sql As String
    Dim total1 As String
    Dim total2 As String
    
    '신랑
    Set rs = New ADODB.Recordset
    sql = "SELECT sum(help_money) as 총금액 FROM wedding_main where gubun = '신랑'"
    rs.Open sql, cn, adOpenStatic
    If IsNull(rs!총금액) Then
        total1 = 0
    Else
        total1 = rs!총금액
    End If
    
    Form1.lbTotal1.Caption = total1
    '신부
    Set rs = New ADODB.Recordset
    sql = "SELECT sum(help_money) as 총금액 FROM wedding_main where gubun = '신부'"
    rs.Open sql, cn, adOpenStatic
    If IsNull(rs!총금액) Then
        total2 = 0
    Else
        total2 = rs!총금액
    End If
    Form1.lbTotal2.Caption = total2
    '전체
    Form1.lbTotal3.Caption = CLng(total1) + CLng(total2)
    rs.Close
    cn.Close
End Sub

Private Sub searchGb_Click(Index As Integer)
    cmdSelect_Click
End Sub
