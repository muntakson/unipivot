class FROALA_WITH_EMOTICON extends FroalaEditor {
  constructor(selector,theme,options){
    super(selector,options)
    const that = this
    const emoticonStatus = window.localStorage.getItem('emoticon')
    that.toggleValue =  emoticonStatus ? emoticonStatus:'emoji';

    that.selector = selector
    that.theme = theme
    that.editor = document.querySelector(selector) //혹은 FroalaEditor(selector) //변하지 않는 값임.
    that.emoticonButton = that.editor.querySelector("[id^='emoticons-']")
    that.toggleButton = that.editor.querySelector("select.tab-toggle")
    that.changeColorThemeOfToggleButton = function(){
      let toggleButtonBackground = that.editor.querySelector('.toggle_background'); //
      toggleButtonBackground.style.backgroundColor = 'white';
      that.toggleButton = that.editor.querySelector("select.tab-toggle")
      that.toggleButton.style.backgroundColor = 'white';
      that.toggleButton.style.fontColor = 'black';
    }
    that.handleEmoticonBox = function(){
      if(that.theme == 'white'){
        that.changeColorThemeOfToggleButton();
      }
      that.emoticonButton = that.editor.querySelector("[id^='emoticons-']")

      that.toggleButton = that.editor.querySelector("select.tab-toggle") //toggle버튼 select
      that.toggleButton.value = that.toggleValue

      window.localStorage.setItem('emoticon',that.toggleValue);
      that.emoticonButton.addEventListener('click',()=>{ //열기버튼을 누르면
        that.activateToggle() //toggle 이벤트 활성화
      })
    }
    that.activateToggle= function(){
      if(that.theme == 'white'){
        that.changeColorThemeOfToggleButton();
      }
      that.handleToggleButton()
    }
    that.handleToggleButton = function(){
      that.toggleButton = that.editor.querySelector("select.tab-toggle") //toggle버튼 select
      that.toggleButton.value = that.toggleValue;
      that.toggleButton.addEventListener('change',function(){ //이벤트 활성화
        that.toggleValue = that.toggleButton.value;
        window.localStorage.setItem('emoticon',that.toggleButton.value);
        that.opts.emoticonsUseImage = that.toggleValue == "emoji" ? false : true; //클릭하면  이모티콘 방식 변환
        that.popups.hide("emoticons") //emoticons 팝업 가려짐
        that.deleteAndJustifyEmoticonBox();
      })

    }

    that.deleteAndJustifyEmoticonBox = function(){
      let emoticonBox = that.editor.querySelectorAll(".fr-popup");
      const deleteEmoticonBox = new Promise(function(){
        emoticonBox.forEach((e,i)=>{e.remove()})
      });
      const reopenEmoticonPopup = new Promise(function(){
        that.emoticons.showEmoticonsPopup() //다시 열기 => 이 과정에서 객체 초기화 다시 필요.
      })
      Promise.all([deleteEmoticonBox,reopenEmoticonPopup])
      that.activateToggle()
    }


    FroalaEditor.RegisterCommand("setEmoticonCategory", {
      callback: function (e, c) {
        const that = FroalaEditor(this.selector)
        that.emoticons.setEmoticonCategory(c);
        that.activateToggle()
      }
    })


    FroalaEditor.RegisterCommand("emoticons", {
      callback: function() {
        const that = FroalaEditor(this.selector)
        const emoticonStatus = window.localStorage.getItem('emoticon')
        that.toggleValue =  emoticonStatus ? emoticonStatus:'emoji';
        that.opts.emoticonsUseImage = that.toggleValue == 'froala' ? true : false; //클릭하면  이모티콘 방식 변환
        let emoticonBox = document.querySelectorAll(".fr-popup");
        emoticonBox.forEach((e,i)=>{ e.remove()})
        that.popups.isVisible("emoticons") ? (that.$el.find(".fr-marker").length && (that.events.disableBlur(), that.selection.restore()), that.popups.hide("emoticons")) : that.emoticons.showEmoticonsPopup()
        that.handleEmoticonBox()
      }
    })
  }
}