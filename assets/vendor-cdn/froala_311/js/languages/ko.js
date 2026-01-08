/*!
 * froala_editor v3.1.1 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2020 Froala Labs
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('froala-editor')) :
  typeof define === 'function' && define.amd ? define(['froala-editor'], factory) :
  (factory(global.FroalaEditor));
}(this, (function (FE) { 'use strict';

  FE = FE && FE.hasOwnProperty('default') ? FE['default'] : FE;

  /**
   * Korean
   */
  FE.LANGUAGE['ko'] = {
    translation: {
      // Place holder
      "Type something": "\ub0b4\uc6a9\uc744 \uc785\ub825\ud558\uc138\uc694",

      // Basic formatting
      "Bold": "\uad75\uac8c",
      "Italic": "\uae30\uc6b8\uc784\uaf34",
      "Underline": "\ubc11\uc904",
      "Strikethrough": "\ucde8\uc18c\uc120",

      // Main buttons
      "Insert": "삽입",
      "Delete": "삭제",
      "Cancel": "취소",
      "OK": "확인",
      "Back": "뒤로",
      "Remove": "제거",
      "More": "더보기",
      "Update": "업데이트",
      "Style": "스타일",

      // Font
      "Font Family": "글꼴",
      "Font Size": "글꼴 크기",

      // Colors
      "Colors": "색상",
      "Background": "배경",
      "Text": "텍스트",
      "HEX Color": "헥스 색상",
      "Text Color": "텍스트 색상",
      "Background Color": "배경 색상",

      // Paragraphs
      "Paragraph Format": "\ub2e8\ub77d",
      "Normal": "\ud45c\uc900",
      "Code": "\ucf54\ub4dc",
      "Heading 1": "\uc81c\ubaa9 1",
      "Heading 2": "\uc81c\ubaa9 2",
      "Heading 3": "\uc81c\ubaa9 3",
      "Heading 4": "\uc81c\ubaa9 4",
      "Heading 5": "\uc81c\ubaa9 5",
      "Heading 6": "\uc81c\ubaa9 6",

      // Style
      "Paragraph Style": "\ub2e8\ub77d \uc2a4\ud0c0\uc77c",
      "Inline Style": "자간",

      // Alignment
      "Align": "\uc815\ub82c",
      "Align Left": "\uc67c\ucabd\uc815\ub82c",
      "Align Center": "\uac00\uc6b4\ub370\uc815\ub82c",
      "Align Right": "\uc624\ub978\ucabd\uc815\ub82c",
      "Align Justify": "\uc591\ucabd\uc815\ub82c",
      "None": "\uc5c6\uc74c",

      // Lists
      "Ordered List": "\uc22b\uc790 \ub9ac\uc2a4\ud2b8",
      "Default": "기본",
      "Lower Alpha": "소문자 알파벳",
      "Lower Greek": "소문자 그리스어",
      "Lower Roman": "소문자 로마자",
      "Upper Alpha": "대문자 알파벳",
      "Upper Roman": "대문자 로마자",

      "Unordered List": "\uc810 \ub9ac\uc2a4\ud2b8",
      "Circle": "원",
      "Disc": "디스크",
      "Square": "네모",

      // Line height
      "Line Height": "줄 높이",
      "Single": "단일",
      "Double": "더블",

      // Indent
      "Decrease Indent": "\ub0b4\uc5b4\uc4f0\uae30",
      "Increase Indent": "\ub4e4\uc5ec\uc4f0\uae30",

      // Links
      "Insert Link": "링크 삽입",
      "Open in new tab": "새 탭으로 열기",
      "Open Link": "링크 열기",
      "Edit Link": "링크 수정",
      "Unlink": "링크 해제",
      "Choose Link": "링크 선택",

      // Images
      "Insert Image": "\uc774\ubbf8\uc9c0 \uc0bd\uc785",
      "Upload Image": "\uc774\ubbf8\uc9c0 \uc5c5\ub85c\ub4dc",
      "By URL": "URL \ub85c",
      "Browse": "\uac80\uc0c9",
      "Drop image": "\uc774\ubbf8\uc9c0\ub97c \ub4dc\ub798\uadf8&\ub4dc\ub86d",
      "or click": "\ub610\ub294 \ud074\ub9ad",
      "Manage Images": "\uc774\ubbf8\uc9c0 \uad00\ub9ac",
      "Loading": "\ub85c\ub4dc",
      "Deleting": "\uc0ad\uc81c",
      "Tags": "\ud0dc\uadf8",
      "Are you sure? Image will be deleted.": "\ud655\uc2e4\ud55c\uac00\uc694? \uc774\ubbf8\uc9c0\uac00 \uc0ad\uc81c\ub429\ub2c8\ub2e4.",
      "Replace": "변경",
      "Uploading": "\uc5c5\ub85c\ub4dc",
      "Loading image": "\uc774\ubbf8\uc9c0 \ub85c\ub4dc \uc911",
      "Display": "\ub514\uc2a4\ud50c\ub808\uc774",
      "Inline": "\uc778\ub77c\uc778",
      "Break Text": "\uad6c\ubd84 \ud14d\uc2a4\ud2b8",
      "Alternative Text": "\ub300\uccb4 \ud14d\uc2a4\ud2b8",
      "Change Size": "\ud06c\uae30 \ubcc0\uacbd",
      "Width": "\ud3ed",
      "Height": "\ub192\uc774",
      "Something went wrong. Please try again.": "\ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc2ed\uc2dc\uc624.",
      "Image Caption": "이미지 설명",
      "Advanced Edit": "\uace0\uae09 \ud3b8\uc9d1",

      // Video
      "Insert Video": "\ub3d9\uc601\uc0c1 \uc0bd\uc785",
      "Embedded Code": "\uc784\ubca0\ub514\ub4dc \ucf54\ub4dc",
      "Paste in a video URL": "동영상 URL 입력",
      "Drop video": "\ub3d9\uc601\uc0c1\uc744 \ub4dc\ub798\uadf8&\ub4dc\ub86d",
      "Your browser does not support HTML5 video.": "\uadc0\ud558\uc758 \ube0c\ub77c\uc6b0\uc800\ub294 html5 video\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
      "Upload Video": "\ub3d9\uc601\uc0c1 \uc5c5\ub85c\ub4dc",

      // Tables
      "Insert Table": "표 삽입",
      "Table Header": "표 헤더",
      "Remove Table": "표 삭제",
      "Table Style": "표 스타일",
      "Horizontal Align": "수평 정렬",
      "Row": "행",
      "Insert row above": "위에 행 삽입",
      "Insert row below": "아래에 행 삽입",
      "Delete row": "행 삭제",
      "Column": "열",
      "Insert column before": "앞에 열 삽입",
      "Insert column after": "뒤에 열 삽입",
      "Delete column": "열 삭제",
      "Cell": "셀",
      "Merge cells": "셀 합치기",
      "Horizontal split": "수평 분할",
      "Vertical split": "수직 분할",
      "Cell Background": "셀 배경",
      "Vertical Align": "수직 정렬",
      "Top": "위쪽 정렬",
      "Middle": "가운데 정렬",
      "Bottom": "아래쪽 정렬",
      "Align Top": "위쪽 정렬",
      "Align Middle": "가운데 정렬",
      "Align Bottom": "아래쪽 정렬",
      "Cell Style": "셀 스타일",

      // Files
      "Upload File": "\ud30c\uc77c \ucca8\ubd80",
      "Drop file": "\ud30c\uc77c\uc744 \ub4dc\ub798\uadf8&\ub4dc\ub86d",

      // Emoticons
      "Emoticons": "\uc774\ubaa8\ud2f0\ucf58",
      "Grinning face": "웃는 얼굴",
      "Grinning face with smiling eyes": "눈웃음 얼굴",
      "Face with tears of joy": "\uae30\uc068\uc758 \ub208\ubb3c\ub85c \uc5bc\uad74",
      "Smiling face with open mouth": "\uc624\ud508 \uc785\uc73c\ub85c \uc6c3\ub294 \uc5bc\uad74",
      "Smiling face with open mouth and smiling eyes": "\uc624\ud508 \uc785\uc73c\ub85c \uc6c3\ub294 \uc5bc\uad74\uacfc \ub208\uc744 \ubbf8\uc18c",
      "Smiling face with open mouth and cold sweat": "\uc785\uc744 \uc5f4\uace0 \uc2dd\uc740 \ub540\uacfc \ud568\uaed8 \uc6c3\ub294 \uc5bc\uad74",
      "Smiling face with open mouth and tightly-closed eyes": "\uc624\ud508 \uc785\uacfc \ubc00\uc811\ud558\uac8c \ub2eb\ud78c \ub41c \ub208\uc744 \uac00\uc9c4 \uc6c3\ub294 \uc5bc\uad74",
      "Smiling face with halo": "\ud6c4\uad11 \uc6c3\ub294 \uc5bc\uad74",
      "Smiling face with horns": "\ubfd4 \uc6c3\ub294 \uc5bc\uad74",
      "Winking face": "\uc5bc\uad74 \uc719\ud06c",
      "Smiling face with smiling eyes": "\uc6c3\ub294 \ub208\uc73c\ub85c \uc6c3\ub294 \uc5bc\uad74",
      "Face savoring delicious food": "\ub9db\uc788\ub294 \uc74c\uc2dd\uc744 \uc74c\ubbf8 \uc5bc\uad74",
      "Relieved face": "\uc548\ub3c4 \uc5bc\uad74",
      "Smiling face with heart-shaped eyes": "\ud558\ud2b8 \ubaa8\uc591\uc758 \ub208\uc73c\ub85c \uc6c3\ub294 \uc5bc\uad74",
      "Smiling face with sunglasses": "\uc120\uae00\ub77c\uc2a4 \uc6c3\ub294 \uc5bc\uad74",
      "Smirking face": "\ub3c8\uc744 \uc9c0\ubd88 \uc5bc\uad74",
      "Neutral face": "\uc911\ub9bd \uc5bc\uad74",
      "Expressionless face": "\ubb34\ud45c\uc815 \uc5bc\uad74",
      "Unamused face": "\uc990\uac81\uac8c\ud558\uc9c0 \uc5bc\uad74",
      "Face with cold sweat": "\uc2dd\uc740 \ub540\uacfc \uc5bc\uad74",
      "Pensive face": "\uc7a0\uaca8\uc788\ub294 \uc5bc\uad74",
      "Confused face": "\ud63c\ub780 \uc5bc\uad74",
      "Confounded face": "\ub9dd\ud560 \uac83 \uc5bc\uad74",
      "Kissing face": "\uc5bc\uad74\uc744 \ud0a4\uc2a4",
      "Face throwing a kiss": "\ud0a4\uc2a4\ub97c \ub358\uc9c0\uace0 \uc5bc\uad74",
      "Kissing face with smiling eyes": "\ubbf8\uc18c\ub294 \ub208\uc744 \uac00\uc9c4 \uc5bc\uad74\uc744 \ud0a4\uc2a4",
      "Kissing face with closed eyes": "\ub2eb\ud78c \ub41c \ub208\uc744 \uac00\uc9c4 \uc5bc\uad74\uc744 \ud0a4\uc2a4",
      "Face with stuck out tongue": "\ub0b4\ubc00 \ud600 \uc5bc\uad74",
      "Face with stuck out tongue and winking eye": "\ub0b4\ubc00 \ud600\uc640 \uc719\ud06c \ub208\uacfc \uc5bc\uad74",
      "Face with stuck out tongue and tightly-closed eyes": "\ubc16\uc73c\ub85c \ubd99\uc5b4 \ud600\uc640 \ubc00\uc811\ud558\uac8c \ub2eb\ud78c \ub41c \ub208\uc744 \uac00\uc9c4 \uc5bc\uad74",
      "Disappointed face": "\uc2e4\ub9dd \uc5bc\uad74",
      "Worried face": "\uac71\uc815 \uc5bc\uad74",
      "Angry face": "\uc131\ub09c \uc5bc\uad74",
      "Pouting face": "\uc5bc\uad74\uc744 \uc090",
      "Crying face": "\uc5bc\uad74 \uc6b0\ub294",
      "Persevering face": "\uc5bc\uad74\uc744 \uc778\ub0b4",
      "Face with look of triumph": "\uc2b9\ub9ac\uc758 \ud45c\uc815\uc73c\ub85c \uc5bc\uad74",
      "Disappointed but relieved face": "\uc2e4\ub9dd\ud558\uc9c0\ub9cc \uc5bc\uad74\uc744 \uc548\uc2ec",
      "Frowning face with open mouth": "\uc624\ud508 \uc785\uc73c\ub85c \uc5bc\uad74\uc744 \ucc21\uadf8\ub9bc",
      "Anguished face": "\uace0\ub1cc\uc758 \uc5bc\uad74",
      "Fearful face": "\ubb34\uc11c\uc6b4 \uc5bc\uad74",
      "Weary face": "\uc9c0\uce5c \uc5bc\uad74",
      "Sleepy face": "\uc2ac\ub9ac\ud53c \uc5bc\uad74",
      "Tired face": "\ud53c\uace4 \uc5bc\uad74",
      "Grimacing face": "\uc5bc\uad74\uc744 \ucc21\uadf8\ub9b0",
      "Loudly crying face": "\ud070 \uc18c\ub9ac\ub85c \uc5bc\uad74\uc744 \uc6b8\uace0",
      "Face with open mouth": "\uc624\ud508 \uc785\uc73c\ub85c \uc5bc\uad74",
      "Hushed face": "\uc870\uc6a9\ud55c \uc5bc\uad74",
      "Face with open mouth and cold sweat": "\uc785\uc744 \uc5f4\uace0 \uc2dd\uc740 \ub540\uc73c\ub85c \uc5bc\uad74",
      "Face screaming in fear": "\uacf5\ud3ec\uc5d0 \ube44\uba85 \uc5bc\uad74",
      "Astonished face": "\ub180\ub77c \uc5bc\uad74",
      "Flushed face": "\ud50c\ub7ec\uc2dc \uc5bc\uad74",
      "Sleeping face": "\uc5bc\uad74 \uc7a0\uc790\ub294",
      "Dizzy face": "\ub514\uc9c0 \uc5bc\uad74",
      "Face without mouth": "\uc785\uc5c6\uc774 \uc5bc\uad74",
      "Face with medical mask": "\uc758\ub8cc \ub9c8\uc2a4\ud06c\ub85c \uc5bc\uad74",

      // Line breaker
      "Break": "\ub2e8\uc808",

      // Math
      "Subscript": "\uc544\ub798 \ucca8\uc790",
      "Superscript": "\uc704 \ucca8\uc790",

      // Full screen
      "Fullscreen": "\uc804\uccb4 \ud654\uba74",

      // Horizontal line
      "Insert Horizontal Line": "가로선 삽입",

      // Clear formatting
      "Clear Formatting": "\uc11c\uc2dd \uc81c\uac70",

      // Save
      "Save": "저장",

      // Undo, redo
      "Undo": "\uc2e4\ud589 \ucde8\uc18c",
      "Redo": "\ub418\ub3cc\ub9ac\uae30",

      // Select all
      "Select All": "\uc804\uccb4\uc120\ud0dd",

      // Code view
      "Code View": "\ucf54\ub4dc\ubcf4\uae30",

      // Quote
      "Quote": "\uc778\uc6a9",
      "Increase": "적용",
      "Decrease": "해제",

      // Quick Insert
      "Quick Insert": "\ube60\ub978 \uc0bd\uc785",

      // Spcial Characters
      "Special Characters": "\ud2b9\uc218 \ubb38\uc790",
      "Latin": "\ub77c\ud2f4\uc5b4",
      "Greek": "\uadf8\ub9ac\uc2a4\uc5b4",
      "Cyrillic": "\ud0a4\ub9b4 \ubb38\uc790",
      "Punctuation": "\ubb38\uc7a5\ubd80\ud638",
      "Currency": "\ud1b5\ud654",
      "Arrows": "\ud654\uc0b4\ud45c",
      "Math": "\uc218\ud559",
      "Misc": "\uadf8 \uc678",

      // Print.
      "Print": "\uc778\uc1c4",

      // Spell Checker.
      "Spell Checker": "\ub9de\ucda4\ubc95 \uac80\uc0ac\uae30",

      // Help
      "Help": "\ub3c4\uc6c0\ub9d0",
      "Shortcuts": "\ub2e8\ucd95\ud0a4",
      "Inline Editor": "\uc778\ub77c\uc778 \uc5d0\ub514\ud130",
      "Show the editor": "\uc5d0\ub514\ud130 \ubcf4\uae30",
      "Common actions": "\uc77c\ubc18 \ub3d9\uc791",
      "Copy": "\ubcf5\uc0ac\ud558\uae30",
      "Cut": "\uc798\ub77c\ub0b4\uae30",
      "Paste": "\ubd99\uc5ec\ub123\uae30",
      "Basic Formatting": "\uae30\ubcf8 \uc11c\uc2dd",
      "Increase quote level": "\uc778\uc6a9 \uc99d\uac00",
      "Decrease quote level": "\uc778\uc6a9 \uac10\uc18c",
      "Image / Video": "\uc774\ubbf8\uc9c0 / \ub3d9\uc601\uc0c1",
      "Resize larger": "\ud06c\uae30\ub97c \ub354 \ud06c\uac8c \uc870\uc815",
      "Resize smaller": "\ud06c\uae30\ub97c \ub354 \uc791\uac8c \uc870\uc815",
      "Table": "\ud45c",
      "Select table cell": "\ud45c \uc140 \uc120\ud0dd",
      "Extend selection one cell": "\uc140\uc758 \uc120\ud0dd \ubc94\uc704\ub97c \ud655\uc7a5",
      "Extend selection one row": "\ud589\uc758 \uc120\ud0dd \ubc94\uc704\ub97c \ud655\uc7a5",
      "Navigation": "\ub124\ube44\uac8c\uc774\uc158",
      "Focus popup / toolbar": "\ud31d\uc5c5 / \ud234\ubc14\ub97c \ud3ec\ucee4\uc2a4",
      "Return focus to previous position": "\uc774\uc804 \uc704\uce58\ub85c \ud3ec\ucee4\uc2a4 \ub418\ub3cc\ub9ac\uae30",

      // Embed.ly
      "Embed URL": "\uc784\ubca0\ub4dc URL",
      "Paste in a URL to embed": "\uc784\ubca0\ub4dc URL\uc5d0 \ubd99\uc5ec \ub123\uae30",

      // Word Paste.
      "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "\ubd99\uc5ec\ub123\uc740 \ubb38\uc11c\ub294 \ub9c8\uc774\ud06c\ub85c\uc18c\ud504\ud2b8 \uc6cc\ub4dc\uc5d0\uc11c \uac00\uc838\uc654\uc2b5\ub2c8\ub2e4. \ud3ec\ub9f7\uc744 \uc720\uc9c0\ud558\uac70\ub098 \uc815\ub9ac \ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?",
      "Keep": "\uc720\uc9c0",
      "Clean": "\uc815\ub9ac",
      "Word Paste Detected": "\uc6cc\ub4dc \ubd99\uc5ec \ub123\uae30\uac00 \uac80\ucd9c \ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
      // Character Counter
      'Characters': '문자',
      // More Buttons
      'More Text': '본문 더보기',
      'More Paragraph': '단락 더보기',
      'More Rich': '삽입 더보기',
      'More Misc': '기타 더보기'
    },
    direction: 'ltr'
  };

})));

