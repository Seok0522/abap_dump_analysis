
export interface ErrorItem {
  code: string;
  title: string;
  mean: string;
  desc: string;
  dept: string;
}

export interface ErrorCategory {
  category: string;
  desc: string;
  items: ErrorItem[];
}

export const errorDictionaryData: ErrorCategory[] = [
  {
    "category": "Critical",
    "desc": "서버의 자원(CPU, 메모리) 부족으로 발생하는 심각한 문제입니다.",
    "items": [
      {"code": "TSV_TNEW_PAGE_ALLOC_FAILED", "title": "메모리 할당 실패", "mean": "그릇 넘침", "desc": "프로그램이 담으려는 데이터가 허용된 메모리 용량을 초과했습니다. (주로 전체 조회 시 발생)", "dept": "개발팀"},
      {"code": "TIME_OUT", "title": "실행 시간 초과", "mean": "강제 퇴장", "desc": "정해진 시간(예: 10분) 동안 처리가 안 끝나서 시스템이 강제로 종료시켰습니다.", "dept": "개발팀"},
      {"code": "SYSTEM_NO_ROLL", "title": "사용자 메모리 고갈", "mean": "입석 불가", "desc": "사용자별로 할당된 작업 공간이 꽉 찼습니다. 동시 접속자가 많거나 무거운 작업 시 발생합니다.", "dept": "BC팀"},
      {"code": "MEMORY_NO_MORE_PAGING", "title": "페이징 메모리 부족", "mean": "창고 부족", "desc": "데이터를 임시 보관하는 페이징 영역이 부족합니다.", "dept": "BC팀"},
      {"code": "STORAGE_PARAMETERS_WRONG_SET", "title": "스토리지 파라미터 오류", "mean": "설정 불량", "desc": "시스템 메모리 관리 설정이 잘못되어 작동을 멈췄습니다.", "dept": "BC팀"},
      {"code": "SPOOL_INTERNAL_ERROR", "title": "출력 시스템 오류", "mean": "프린터 마비", "desc": "출력 요청(Spool)이 너무 많이 쌓여 관리 시스템이 뻗었습니다.", "dept": "BC팀"},
      {"code": "NO_MORE_LOG_HANDLES", "title": "로그 핸들 부족", "mean": "기록지 부족", "desc": "시스템 상태를 기록할 자원이 부족합니다.", "dept": "BC팀"}
    ]
  },
  {
    "category": "Database",
    "desc": "데이터 저장소(DB)와 대화하는 과정에서 발생한 문제입니다.",
    "items": [
      {"code": "DBIF_RSQL_SQL_ERROR", "title": "SQL 구문 오류", "mean": "문법 틀림", "desc": "DB에게 명령을 내리는 문장(SQL)에 오류가 있어 DB가 거부했습니다.", "dept": "개발팀"},
      {"code": "SAPSQL_IN_ITAB_ILLEGAL_SIGN", "title": "조회 조건 오류", "mean": "잘못된 질문", "desc": "데이터 검색 조건(Range) 설정 값이 비정상적입니다. (코딩 실수 1위)", "dept": "개발팀"},
      {"code": "SAPSQL_DATA_LOSS", "title": "데이터 손실 경고", "mean": "잘림 현상", "desc": "DB에 있는 긴 데이터를 짧은 변수에 담으려다 내용이 잘렸습니다.", "dept": "개발팀"},
      {"code": "SQL_CAUGHT_RABAX", "title": "DB 내부 치명적 오류", "mean": "DB 셧다운", "desc": "DB 자체에서 처리를 포기한 상태입니다. DB 점검이 필요합니다.", "dept": "BC팀/DBA"},
      {"code": "DBSQL_DUPLICATE_KEY_ERROR", "title": "DB 키 중복", "mean": "번호표 중복", "desc": "이미 존재하는 사번/문서번호를 다시 저장하려고 했습니다.", "dept": "개발팀"},
      {"code": "SAPSQL_ARRAY_INSERT_DUPREC", "title": "대량 삽입 중 중복", "mean": "단체 중복", "desc": "여러 건을 한 번에 저장하다가 중복 데이터가 발견되었습니다.", "dept": "개발팀"},
      {"code": "DBIF_RSQL_INVALID_RSQL", "title": "부적절한 SQL", "mean": "해석 불가", "desc": "SAP가 번역할 수 없는 난해한 SQL 구문이 사용되었습니다.", "dept": "개발팀"}
    ]
  },
  {
    "category": "Logic",
    "desc": "개발자의 코딩 실수로 발생하는 논리적 오류입니다.",
    "items": [
      {"code": "GETWA_NOT_ASSIGNED", "title": "참조 대상 없음", "mean": "허공 잡기", "desc": "존재하지 않는 데이터 주소(Field Symbol)를 읽으려 했습니다. (Null Pointer)", "dept": "개발팀"},
      {"code": "OBJECTS_OBJREF_NOT_ASSIGNED", "title": "객체 미생성", "mean": "유령 호출", "desc": "생성되지 않은 클래스(객체)를 사용하려 했습니다.", "dept": "개발팀"},
      {"code": "CONVT_NO_NUMBER", "title": "숫자 변환 실패", "mean": "문자 혼입", "desc": "금액/수량 필드에 'ABC' 같은 문자가 들어왔습니다. (엑셀 업로드 시 빈번)", "dept": "현업/개발팀"},
      {"code": "BCD_ZERODIVIDE", "title": "0으로 나누기", "mean": "불능 계산", "desc": "수식 계산 중 분모가 0이 되었습니다. (달성률 계산 등)", "dept": "개발팀"},
      {"code": "ITAB_DUPLICATE_KEY", "title": "내부 표 키 중복", "mean": "명단 중복", "desc": "메모리상의 표(Internal Table)에 중복된 키 값을 넣으려 했습니다.", "dept": "개발팀"},
      {"code": "DATA_OFFSET_TOO_LARGE", "title": "자릿수 지정 오류", "mean": "범위 초과", "desc": "문자열 길이보다 더 뒤쪽을 자르려고 시도했습니다.", "dept": "개발팀"},
      {"code": "MESSAGE_TYPE_X", "title": "강제 중단 메시지", "mean": "비상 정지", "desc": "개발자가 '이건 위험하다'고 판단해 의도적으로 프로그램을 죽인 경우입니다.", "dept": "개발팀"},
      {"code": "SYNTAX_ERROR", "title": "문법 오류", "mean": "오타", "desc": "프로그램 문법이 틀렸습니다. 주로 수정 직후 발생합니다.", "dept": "개발팀"},
      {"code": "COMPUTE_INT_PLUS_OVERFLOW", "title": "정수 범위 초과", "mean": "카운터 초과", "desc": "숫자가 너무 커서 정수형 변수(Integer)에 담을 수 없습니다.", "dept": "개발팀"}
    ]
  },
  {
    "category": "Interface",
    "desc": "타 시스템(MES, 인사 등)과 통신 중 발생한 오류입니다.",
    "items": [
      {"code": "CALL_FUNCTION_NOT_FOUND", "title": "함수 없음", "mean": "결번", "desc": "상대방 시스템에 호출하려는 기능(Function)이 없습니다.", "dept": "연동 담당"},
      {"code": "CALL_FUNCTION_SIGN_INCOMPL", "title": "파라미터 불일치", "mean": "대화 불통", "desc": "주고받는 데이터의 모양(Type)이 서로 다릅니다.", "dept": "연동 담당"},
      {"code": "CALL_FUNCTION_REMOTE_ERROR", "title": "원격 실행 오류", "mean": "상대방 에러", "desc": "호출은 성공했으나, 상대방 시스템 내부에서 에러가 터졌습니다.", "dept": "상대 시스템"},
      {"code": "RFC_NO_AUTHORITY", "title": "RFC 권한 없음", "mean": "출입 통제", "desc": "타 시스템 접속 권한이 없습니다.", "dept": "보안팀"}
    ]
  },
  {
    "category": "User",
    "desc": "서버 문제가 아닌, 사용자 PC나 네트워크 문제입니다.",
    "items": [
      {"code": "RAISE_EXCEPTION", "title": "예외 발생", "mean": "PC 통신 끊김", "desc": "주로 엑셀 연동 중 취소를 누르거나 네트워크가 끊겨 발생합니다.", "dept": "HelpDesk"},
      {"code": "CNTL_ERROR", "title": "화면 컨트롤 오류", "mean": "화면 깨짐", "desc": "PC에서 SAP 화면(Grid, Tree)을 그리는 엔진이 오작동했습니다.", "dept": "HelpDesk"},
      {"code": "GUI_IS_NOT_SUPPORTED", "title": "미지원 GUI", "mean": "구버전", "desc": "사용자의 SAP 접속 프로그램 버전이 너무 낮습니다.", "dept": "HelpDesk"}
    ]
  }
];
