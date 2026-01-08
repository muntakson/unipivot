function repositionFormWidgetDropdown(){
  window.onload = ()=>{
    const formList = document.querySelectorAll("._form-widget")
    const lastFormList = formList[formList.length -1];
    const lastFormCountryChosenDrop = lastFormList.querySelector(".phonenumber_wrap .chosen-drop");
    const lastFormChosenContainer = lastFormList.querySelector("._form-widget .phonenumber_wrap .chosen-container");

    if(lastFormCountryChosenDrop && lastFormChosenContainer){
      /*
      * containerHeight : select container 높이
      * chosenDropHeight : dropdown 높이
      * correctionValue : 보정값
      * */
      let containerHeight = 34;
      let chosenDropHeight = 290;
      let correctionValue = 12;
      if (window.scrollY + lastFormChosenContainer.getBoundingClientRect().y +containerHeight + chosenDropHeight + correctionValue >  document.body.scrollHeight){
        //드롭다운의 위치를 위로 바꾸기
        //부모 요소 relative에서 static으로 수정
        lastFormChosenContainer.style.position = '';
        //드롭다운 위치를 select container 위로 위치
        lastFormCountryChosenDrop.style.top = '-300px'
      }
    }
  }
}

const formList = document.querySelectorAll("._form-widget")
if(formList.length > 0){
  repositionFormWidgetDropdown()
}
