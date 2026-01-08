var SITE_SHOP_MYPAGE = function(){
  var $order_list;
  var $order_list_empty;
  var $order_list_more_button;
  var currentPage = 1;
  var getOrderListProgress = false;

  var $regularly_list_body;
  var $regularly_order_tab;
  var $regularly_cancel_tab;

  var $point_list;
  var $point_list_table;
  var $point_list_empty;
  var $point_list_more_button;
  var get_point_list_progress = false;

  var $order_cancel_form;
  var $order_return_form;
  var $order_exchange_form;
  var cancel_order_code = '';	/* 취소처리중인 주문코드 */
  var auto_cancel_enable = 'N';	/* 자동취소 지원 Y/N */
  var return_order_code = '';	/* 반품 진행중인 주문코드 */
  var exchange_order_code = '';	/* 교환 진행중인 주문코드 */

  var is_canceling = false; // 취소 신청 처리중 여부
  var add_member_billing_check = false; //간편결제 등록 처리중 여부
  var $changeRegularlyItemLayer;

	const handleClickOrderItemButton = async function (e) {
		try {
			const { target } = e;
			if (target instanceof Element && typeof target.dataset.dynamicImport === 'string' && target.dataset.dynamicImport.length > 0 && typeof target.dataset.dynamicImportDone === 'undefined') {
				const handleClickOrderItemButtonCallback = await import(`/_/oms-customer-fo-shop-my-page/${target.dataset.dynamicImport}.js`); 
				function handleClickOrderItemButton() {
					handleClickOrderItemButtonCallback.default(target);
				}
				e.target.addEventListener('click', handleClickOrderItemButton);
				target.dataset.dynamicImportDone = 'true';
				handleClickOrderItemButton();
			}
		} catch (error) {
			console.error(error);
		}
	}

  var initOrderList = function(){
    $order_list = $('#shop_mypage_orderlist');
    $order_list_empty = $('#shop_mypage_orderlist_empty');
    $order_list_more_button = $('#shop_mypage_orderlist_more');

		// oms 기반 다이얼로그 로딩 트리거
		$order_list.on('click', handleClickOrderItemButton);

    // 주문 타입 탭 초기화
    initOrderTypeTabs();
  };

  // 주문 타입 탭 초기화 함수
  var initOrderTypeTabs = function(){
    var urlParams = new URLSearchParams(window.location.search);
    var orderType = urlParams.get('order-type');

    // 과거 주문 개수 확인 (리다이렉트 체크 및 탭 표시)
    checkMigrationOrdersCount(orderType);
  };

  // 과거 주문 개수 확인 함수
  var checkMigrationOrdersCount = function(orderType){
    $.ajax({
      type : 'POST',
      data : {'page' : 1, 'type' : 'order', 'isMigration' : 'Y'},
      url : '/shop/oms/OMS_mypage_order_list.cm',
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg == 'SUCCESS'){
          if(result.count > 0){
            // 과거 주문이 1개 이상
            if (orderType === null) {
              // order-type 파라미터가 없는 경우 탭 표시하고 전체 주문 활성화
              $('#order_type_tabs').show();
              // 전체 주문 탭 활성화
              var $activeTab = $('#tab_all_orders');
              $activeTab.css({'color': '#15181E'});
              $activeTab.append('<div class="tab-indicator" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; border-radius: 50px; background: currentColor;"></div>');
            }
          } else {
            // 과거 주문이 0개
            if(orderType === 'migration'){
              // migration URL로 접속했는데 과거 주문이 없으면 리다이렉트
              window.location.href = window.location.pathname + '?order-type=all';
            }
          }
        }
      },
      error : function(){
        // 에러 발생 시 아무 처리 안 함
      }
    });
  };
  var initPointList = function(){
    $point_list = $('#shop_mypage_pointlist');
    $point_list_table = $('#shop_mypage_pointlist_table');
    $point_list_empty = $('#shop_mypage_pointlist_empty');
    $point_list_more_button = $('#shop_mypage_pointlist_more');
  };
  /**
   * 위시리스트 제거
   * @param prod_code
   */
  var deleteProdWish = function(prod_code){
    $.ajax({
      type : 'POST',
      data : {'type' : 'delete', 'prod_code' : prod_code},
      url : ('/shop/add_prod_wish.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.addCountUserProfileAttr('wishCount', -1);
          // window.location.reload();
          $('#wish-item-' + prod_code).remove();
          $('#wish_cnt').text($('#wish_cnt').text() - 1 > 0 ? $('#wish_cnt').text() - 1 : 0)
        }else
          alert(res.msg);
      }
    });
  };

  var deleteBookingProdWish = function(prod_code){
    $.ajax({
      type : 'POST',
      data : {'type' : 'delete', 'prod_code' : prod_code},
      url : ('/booking/add_prod_wish.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(typeof CHANNEL_PLUGIN != "undefined") CHANNEL_PLUGIN.addCountUserProfileAttr('wishCount', -1);
          window.location.reload();
        }else
          alert(res.msg);
      }
    });
  };

  var initRegularlyList = function(){
    $regularly_list_body = $('#regularly_list_body');
    $regularly_order_tab = $('#regularly_order_tab');
    $regularly_cancel_tab = $('#regularly_cancel_tab');
    getRegularlyOrderList(1);
  };

  var getRegularlyOrderList = function(page){
    $.ajax({
      type : 'POST',
      data : {'page' : page},
      url : ('/shop/mypage_regularly_order_list.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg === 'SUCCESS'){
          $regularly_list_body.html(result.html);
          $regularly_cancel_tab.removeClass('active');
          $regularly_order_tab.addClass('active');
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  }

  var getRegularlyCancelList = function(page){
    $.ajax({
      type : 'POST',
      data : {'page' : page},
      url : ('/shop/mypage_regularly_cancel_list.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg === 'SUCCESS'){
          $regularly_list_body.html(result.html);
          $regularly_order_tab.removeClass('active');
          $regularly_cancel_tab.addClass('active');
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  }

  var registerRegularlyCard = function(is_update){
    $.ajax({
      type : 'POST',
      url : ('/shop/register_payment_method.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'register_payment_method', custom_popup : result.html, pc_width : 400}, function(){
            if(add_member_billing_check) return;
            var $register_payment_method_form = $("#register_payment_method_form");
            var $num_input = $register_payment_method_form.find('input[inputmode="numeric"] , input[type=password]');
            var $auto_focus = $register_payment_method_form.find('input[type=text] , input[type=password]');
            var $agree_all_check = $('#payment_method_agree_all_check');
            var $agree = $register_payment_method_form.find('._agree');
            var $open_popup_privacy = $register_payment_method_form.find('._open_popup_privacy');
            $num_input.check_num();
            for(var i = 0; i < ($num_input.length - 1); i++){
              (function(cnt){
                $($auto_focus[cnt]).on('keyup', function(){
                  var $that = $(this);
                  if($that.val().length == $that.attr('maxlength')){
                    $($auto_focus[cnt + 1]).focus();
                  }
                });
              })(i);
            }
            $agree_all_check.off('change').on('change', function(val){
              $agree.prop('checked', $agree_all_check.prop('checked'));
            });
            $agree.off('change').on('change', function(){
              var agree_cnt = 0;
              $.each($agree, function(){
                if($(this).prop('checked')) agree_cnt++;
              })
              $agree_all_check.prop('checked', $agree.length === agree_cnt);
            });
            $open_popup_privacy.off('click').on('click', function(){
              openPopupPrivacy($(this).attr('data-type'));
            })
            $register_payment_method_form.find('input[name="card_type"]').off('click').on('click', function(){
              if($(this).hasClass('personal')){
                $register_payment_method_form.find('label[for="birthday"]').text('생년월일')
                $register_payment_method_form.find('input[name="birthday"]').attr('placeholder', '6자리 입력');
                $register_payment_method_form.find('input[name="birthday"]').attr('minlength', '6');
                $register_payment_method_form.find('input[name="birthday"]').attr('maxlength', '6');
              }else{
                $register_payment_method_form.find('label[for="birthday"]').text('사업자번호');
                $register_payment_method_form.find('input[name="birthday"]').attr('placeholder', '사업자번호 입력');
                $register_payment_method_form.find('input[name="birthday"]').attr('minlength', '9');
                $register_payment_method_form.find('input[name="birthday"]').attr('maxlength', '10');
              }
            })

            $register_payment_method_form.find("._register").click(function(){
              var data = $register_payment_method_form.serializeObject();

              var all_check = true;
              $.each(data, function(k, v){
                if(!all_check) return false;
                if($.isArray(v)){
                  $.each(v, function(index, v2){
                    if(v2 === ""){
                      all_check = false;
                      return false;
                    }
                  });
                }else{
                  if(v === ""){
                    all_check = false;
                    return false;
                  }
                }
              });

              if(!all_check){
                alert('등록정보를 모두 입력해주세요');
                return false;
              }


              var agree_count = $register_payment_method_form.find("._checkbox_group ._agree:checked").length;
              if(agree_count !== 4){
                alert('이용약관을 동의해주세요');
                return false;
              }

              data.agree = 'Y';
              data.is_update = is_update;
              add_member_billing_check = true;
              $.ajax({
                type : 'POST',
                data : data,
                url : ('/shop/add_easy_payment_card.cm'),
                dataType : 'json',
                cache : false,
                success : function(result){
                  if(result.msg == 'SUCCESS'){
                    $("#card_info_wrap_before").addClass('hide');
                    var $card_info_wrap_after = $("#card_info_wrap_after");
                    $card_info_wrap_after.removeClass('hide');
                    $card_info_wrap_after.find('._card_name').html(result.card_name);
                    $card_info_wrap_after.find('._card_no').html(result.card_no);
                    $("#card_info_wrap_after_tool").removeClass('hide');
                    $.cocoaDialog.close();
                  }else{
                    alert(result.msg);
                  }
                  add_member_billing_check = false;
                },
                error : function(){
                  alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
                }
              });
            });
          });
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  }

  var openPopupPrivacy = function(agree_type){
    var $popup_html;
    switch(agree_type){
      case 'regularly_policy_agree' :
        $popup_html = IMWEB_TEMPLATE.loadSimple('REGULARLY_POLICY_TEMPLATE');
        break;
      case 'regularly_privacy_agree' :
        $popup_html = IMWEB_TEMPLATE.loadSimple('REGULARLY_PRIVACY_TEMPLATE');
        break;
      case 'regularly_third_agree' :
        $popup_html = IMWEB_TEMPLATE.loadSimple('REGULARLY_THIRD_TEMPLATE');
        break;
      case 'regularly_payment_agree' :
        $popup_html = IMWEB_TEMPLATE.loadSimple('REGULARLY_PAYMENT_TEMPLATE');
        break;
      default :
        $popup_html = IMWEB_TEMPLATE.loadSimple('PRIVACY_TEMPLATE');
        break;
    }
    $.cocoaDialog.open({type : 'site_payment_privacy', custom_popup : $popup_html});
  }

  var deleteRegularlyCard = function(use_regularly_order){
    use_regularly_order = 'N';
    if(use_regularly_order === 'Y'){
      $.cocoaDialog.open({
        type : 'alert_responsive',
        content : getLocalizeString("설명_진행중인정기구독주문이있어카드삭제불가", "", "현재 진행 중인 정기구독 주문이 있어 카드를 삭제할 수 없습니다.<br/>카드 변경 혹은 정기구독 해지 후 카드를 삭제해 주세요."),
        confirm_text : getLocalizeString('버튼_확인', '', '확인')
      });
    }else{
      $.cocoaDialog.open({
        type : 'alert_responsive',
        content : getLocalizeString("설명_등록된자동결제카드를삭제하시겠습니까", "", "등록된 자동결제 카드를 <br class='hidden-lg hidden-md hidden-sm'/>삭제하시겠습니까?"),
        confirm_text : getLocalizeString('버튼_확인', '', '확인'),
        cancel_text : getLocalizeString('버튼_취소', '', '취소')
      }, function(){
        $.ajax({
          type : 'POST',
          url : ('/shop/delete_easy_payment_card.cm'),
          dataType : 'json',
          cache : false,
          success : function(result){
            if(result.msg == 'SUCCESS'){
              $("#card_info_wrap_before").removeClass('hide');
              $("#card_info_wrap_after").addClass('hide');
              $("#card_info_wrap_after_tool").addClass('hide');
              $.cocoaDialog.close();
            }else{
              alert(result.msg);
            }
          },
          error : function(){
            alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
          }
        });
      });
    }
  }

  var changeRegularlyCard = function(){
    registerRegularlyCard('Y');
  }

  var unsetRegularlyAllProd = function(idx){
    $.cocoaDialog.open({
      type : 'alert_responsive',
      content : getLocalizeString("설명_전체상품의정기구독을해지하시겠습니까", "", "전체 상품의 정기구독을 <br class='hidden-lg hidden-md hidden-sm'/>해지하시겠습니까?"),
      confirm_text : getLocalizeString('버튼_확인', '', '확인'),
      cancel_text : getLocalizeString('버튼_취소', '', '취소')
    }, function(){
      unsetRegularlyProd('all', idx);
    });
  };

  var unsetRegularlyProdItem = function(idx, item_code, prod_check_code, item_code_list){
    var msg = getLocalizeString("설명_해당상품의정기구독을해지하시겠습니까", "", "해당 상품의 정기구독을 <br class='hidden-lg hidden-md hidden-sm'/>해지하시겠습니까?");
    if(prod_check_code != ''){
      msg = getLocalizeString("설명_해당상품의정기구독을해지하시겠습니까선택옵션도함께", "", "해당 상품의 정기구독을 <br class='hidden-lg hidden-md hidden-sm'/>해지하시겠습니까?<br>선택옵션도 함께 해지됩니다.");
    }
    $.cocoaDialog.open({
      type : 'alert_responsive',
      content : msg,
      confirm_text : getLocalizeString('버튼_확인', '', '확인'),
      cancel_text : getLocalizeString('버튼_취소', '', '취소')
    }, function(){
      unsetRegularlyProd('item', idx, item_code, prod_check_code, item_code_list);
    });
  };

  var unsetRegularlyProd = function(type, idx, item_code, prod_check_code, item_code_list){
    $.ajax({
      type : 'POST',
      data : {
        'type' : type,
        'idx' : idx,
        'item_code' : item_code,
        'prod_check_code' : prod_check_code,
        'item_code_list' : item_code_list
      },
      url : ('/shop/update_regularly_status.cm'),
      dataType : 'json',
      cache : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){
          var location_url = '/shop_mypage/?m2=regularly';
          window.location.href = location_url;
        }else{
          alert(res.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  /**
   * 이전 구독일정 모달
   * @param regularly_code
   * @param is_multiple_prod
   */
  var showRegularlyDateList = function(regularly_code, is_multiple_prod){
    $.ajax({
      type : 'POST',
      data : {'is_multiple_prod' : is_multiple_prod},
      url : ('/shop/open_regularly_date.cm'),
      dataType : 'json',
      success : function(result){
        if(result.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'regularly_date_list', custom_popup : result.html}, function(){
            getRegularlyDateList(regularly_code, 1, is_multiple_prod);
          });
        }else{
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var getRegularlyDateList = function(regularly_code, page, is_multiple_prod){
    var $regularly_date_body = $('#regularly_date_body');
    var $regularly_date_paging = $('#regularly_date_paging');
    if($regularly_date_body.length > 0){
      $.ajax({
        type : 'GET',
        data : {'regularly_code' : regularly_code, 'page' : page, 'is_multiple_prod' : is_multiple_prod},
        url : ('/shop/regularly_date_list.cm'),
        dataType : 'json',
        cache : true,
        success : function(result){
          if(result.msg == 'SUCCESS'){
            $regularly_date_body.html(result.html);
            if(result.paging_html != ''){
              $regularly_date_paging.html(result.paging_html);
            }
          }else{
            alert(result.msg);
          }
        },
        error : function(){
          alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
        }
      });
    }
  };

  var showRegularlySelectPeriod = function(idx){
    $.ajax({
      type : 'POST',
      data : {'idx' : idx},
      url : ('/shop/regularly_select_period.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'regularly_select_period', custom_popup : result.html}, function(){
            $('#regularly_select_period_confirm').on('click', function(){
              var cycle_type = $("#cycle_type").val();
              var cycle_value = $("#cycle_value").val();
              changeRegularlyPeriod(idx, cycle_type, cycle_value);
            })
          });
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var changeRegularlyPeriod = function(idx){
    var cycle_type = $("#cycle_type").val();
    var cycle_value = $("#cycle_value").val();
    $.ajax({
      type : 'POST',
      data : {'idx' : idx, 'cycle_type' : cycle_type, 'cycle_value' : cycle_value},
      url : ('/shop/update_regularly_cycle.cm'),
      dataType : 'json',
      cache : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){
          var location_url = '/shop_mypage/?m2=regularly&idx=' + idx;
          window.location.href = location_url;
        }else{
          alert(res.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var skipRegularlyProdAll = function(idx, date_text){
    $.cocoaDialog.open({
      type : 'alert_responsive',
      content : getLocalizeString("설명_이번배송을건너뛰겠습니까다음구독일은n입니다", date_text, "이번 배송을 건너뛰겠습니까?<br/>해당 상품의 다음 구독일은 <br class='hidden-lg hidden-md'/> <strong>%1</strong> 입니다."),
      confirm_text : getLocalizeString('버튼_확인', '', '확인'),
      cancel_text : getLocalizeString('버튼_취소', '', '취소')
    }, function(){
      skipRegularlyProd('all', idx);
    });
  };

  var skipRegularlyProdItem = function(idx, item_code, date_text, prod_check_code, item_code_list){
    var msg = getLocalizeString("설명_이번배송을건너뛰겠습니까다음구독일은n입니다", date_text, "이번 배송을 건너뛰겠습니까?<br/>해당 상품의 다음 구독일은<br class='hidden-lg hidden-md'/> <strong>%1</strong> 입니다.");
    if(prod_check_code != ''){
      msg = getLocalizeString("설명_이번배송을건너뛰겠습니까다음구독일은n입니다선택옵션도함께", date_text, "이번 배송을 건너뛰겠습니까?<br/>해당 상품의 다음 구독일은<br class='hidden-lg hidden-md'/> <strong>%1</strong> 입니다.<br>선택옵션도 함께 적용됩니다.");
    }
    console.log(msg)
    $.cocoaDialog.open({
      type : 'alert_responsive',
      content : msg,
      confirm_text : getLocalizeString('버튼_확인', '', '확인'),
      cancel_text : getLocalizeString('버튼_취소', '', '취소')
    }, function(){
      skipRegularlyProd('item', idx, item_code, prod_check_code, item_code_list);
    });
  };

  var skipRegularlyProd = function(type, idx, item_code, prod_check_code, item_code_list){
    $.ajax({
      type : 'POST',
      data : {
        'type' : type,
        'idx' : idx,
        'item_code' : item_code,
        'prod_check_code' : prod_check_code,
        'item_code_list' : item_code_list
      },
      url : ('/shop/update_regularly_skip.cm'),
      dataType : 'json',
      cache : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){
          var location_url = '/shop_mypage/?m2=regularly&idx=' + idx;
          window.location.href = location_url;
        }else{
          alert(res.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var showRegularlyChangeDetail = function(idx, count, regularly_code, item_code){
    $.ajax({
      type : 'POST',
      data : {'count' : count},
      url : ('/shop/regularly_change_count.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'regularly_change_detail', custom_popup : result.html, pc_width : 400}, function(){
            var $modal_regularly_change_detail = $('.modal_regularly_change_detail');
            var $regularly_count = $modal_regularly_change_detail.find('input[name=count]');
            $('#regularly_count_minus').on('click', function(){
              if(parseInt($regularly_count.val()) > 1) $regularly_count.val(parseInt($regularly_count.val()) - 1);
            });
            $('#regularly_count_plus').on('click', function(){
              $regularly_count.val(parseInt($regularly_count.val()) + 1);
            });
            $regularly_count.change(function(){
              if(parseInt($regularly_count.val()) < 1) $regularly_count.val(1);
            });

            $('#regularly_change_count_confirm').on('click', function(){
              RegularlyChangeDetail(idx, regularly_code, item_code, $regularly_count.val());
            })
          });
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var RegularlyChangeDetail = function(idx, regularly_code, item_code, change_count){
    $.ajax({
      type : 'POST',
      data : {'regularly_code' : regularly_code, 'item_code' : item_code, 'change_count' : change_count},
      url : ('/shop/update_regularly_count.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        if(result.msg == 'SUCCESS'){
          var location_url = '/shop_mypage/?m2=regularly&idx=' + idx;
          window.location.href = location_url;
        }else{
          alert(result.msg);
        }
      },
      error : function(){
        alert(getLocalizeString('설명_잠시후다시시도해주세요', '', '잠시 후 다시 시도해주세요.'));
      }
    });
  };

  var getOrderList = function(type, is_c3 = false){
    if(getOrderListProgress) return;
    getOrderListProgress = true;

    // URL에서 order-type 쿼리 파라미터 읽기
    var urlParams = new URLSearchParams(window.location.search);
    var orderType = urlParams.get('order-type');
    var isMigration = orderType === 'migration' ? 'Y' : 'N';

    $.ajax({
      type : 'POST',
      data : {'page' : currentPage, 'type' : type, 'isMigration' : isMigration},
      url : is_c3 ? '/shop/oms/OMS_mypage_order_list.cm' : '/shop/mypage_order_list.cm',
      dataType : 'json',
      cache : false,
      success : function(result){
        getOrderListProgress = false;
        if(result.msg == 'SUCCESS'){
          if(result.count > 0){
            $order_list_empty.hide();
            $order_list.show();

            if(currentPage == 1){
              $order_list.html(result.html);
            }else{
              $order_list.append(result.html);
            }
            var viewport = window.innerWidth > 768 ? 'pc' : 'mobile';
            resizeBtnSize($order_list);
            $(window).off('resize').on('resize', function(){
              var _viewport = window.innerWidth > 768 ? 'pc' : 'mobile';
              if(viewport !== _viewport){
                viewport = _viewport;
                resizeBtnSize($order_list);
              }
            });
	          if(typeof crema !== 'undefined' && typeof crema.run === 'function'){
		          crema.run();
	          }
          }else{
            $order_list.hide();
            if(type === 'cancel'){
              $order_list_empty.text(getLocalizeString('설명_취소내역이없습니다', '', '취소 내역이 없습니다.'));
            }else{
              $order_list_empty.text(getLocalizeString('설명_주문내역이없습니다', '', '주문 내역이 없습니다.'));
            }
            $order_list_empty.show();
          }

          currentPage++;
          if(parseInt(currentPage) > parseInt(result.pageCount))
            $order_list_more_button.hide();
          else
            $order_list_more_button.show();
        }else{
          alert(result.msg);
        }
      }
    });
  };

  var resizeBtnSize = function(list){
    var window_width = window.innerWidth;
    if(window_width > 768){
      var max_width = 24;
      var $btn_tool_row = list.find('._btn_tool_row');
      $.each($btn_tool_row, function(k, v){
        if(v.offsetWidth > max_width){
          max_width = v.offsetWidth;
        }
      });
      $btn_tool_row.width(max_width);
    }else{
      var $btn_tool_row = list.find('._btn_tool_row');
      $btn_tool_row.css('width', 'auto');
    }
  };

  var getPointList = function(){
    if(get_point_list_progress) return;
    get_point_list_progress = true;
    $.ajax({
      type : 'POST',
      data : {'page' : currentPage},
      url : ('/shop/mypage_point_list.cm'),
      dataType : 'json',
      cache : false,
      success : function(result){
        get_point_list_progress = false;
        if(result.msg == 'SUCCESS'){
          if(result.count > 0){
            $point_list_table.show();
            $point_list_empty.hide();
            $point_list.append(result.html);
          }else{
            $point_list_table.hide();
            $point_list_empty.show();
          }
          currentPage++;
          if(parseInt(currentPage) > parseInt(result.pageCount)) $point_list_more_button.hide();
        }else{
          alert(result.msg);
        }
      }
    });
  };

  var trackingParcel = function(code, is_c3 = false){
    if(code == void 0 || code == ''){
      alert(LOCALIZE.설명_택배사또는송장번호가입력되지않았습니다());
      return;
    }

    $.ajax({
      type : 'POST',
      data : {'code' : code},
      url : is_c3 ? '/ajax/oms/OMS_get_parcel_info.cm' : '/ajax/get_parcel_info.cm',
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'admin', custom_popup : res.html, width : 550});
        }else{
          alert(res.msg);
        }
      }
    });
  };
	const omsTrackingParcel = async function(parcelCompanyIdx="",invoiceNo=""){
		if(parcelCompanyIdx == "" || invoiceNo == ''){
			alert(LOCALIZE.설명_택배사또는송장번호가입력되지않았습니다());
			return;
		}
		const _url = new URL('/ajax/oms/OMS_get_parcel_info.cm', window.location.href);
		_url.searchParams.append('parcelCompanyIdx', parcelCompanyIdx);
		_url.searchParams.append('invoiceNo', invoiceNo);

		const res = fetch(_url.href, {
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
			}
		});

		const json = await res.then(res => res.json()).catch(alert);
		const html = json.html;

		$.cocoaDialog.open({type : 'admin', custom_popup : html, width : 550});

	};

	const omsOrderConfirm = async function(orderCode, orderSectionCode){
		if (!window.confirm(window.LOCALIZE.설명_구매확정여부확인())) {
			return;
		}

		const { data: authData } = await axios.get(`/ajax/oms/OMS_auth.cm`);

		if (!/^Success$/i.test(authData.message)) {
			alert(authData.message);
			return;
		}

		const { data: response } = await axios.patch(`/ajax/oms/OMS_wrap_customer_v1_orders_{orderCode}_sections_purchase-confirmation.cm?orderCode=${orderCode}`, {
			orderSectionCode
		}, {
			headers: {
				'Authorization': `Bearer ${authData.token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		const { code, data: omsResponse } = response;

		if (omsResponse?.updateResult === true) {
			window.location.reload();
		} else {
			// TODO: 문구 수정 다국어로 처리 필요
			window.alert(`[${code || 'UNKNOWN'}] ${window.LOCALIZE.설명_구매확정처리실패()}`);
		}
	}

  var trackingParcelEcpay = function(code){
    if(isBlank(code)){
      return;
    }
    $.ajax({
      "type" : "POST",
      "data" : {"code" : code},
      "url" : "/shop/tracking_parcel_ecpay.cm",
      "dataType" : "JSON",
      "success" : function(res){
        $.cocoaDialog.open({type : 'admin', custom_popup : res['html'], width : 550});
      }
    });
  };

  /**
   * 취소요청 페이지 초기화
   * @param auto_cancel 자동취소지원유무 (Y/N)
   */
  var initCancelOrder = function(order_code, auto_cancel){
    $order_cancel_form = $('#order_cancel_form');
    auto_cancel_enable = auto_cancel;
    cancel_order_code = order_code;
    cancelOrderSelectProdOrder();
  };

  /* 취소요청 페이지 품목주문 전체 선택 */
  var cancelOrderSelectAllProdOrder = function(chk){
    $order_cancel_form.find("input._prodOrderCheck").prop("checked", chk);
    cancelOrderLoadRefundPriceData();
  };

  /* 취소요청 페이지 품목주문 선택 */
  var cancelOrderSelectProdOrder = function(){
    var refund_price = cancelOrderLoadRefundPriceData();
    if(auto_cancel_enable == 'Y' || refund_price == 0){	/* 전체 취소, 자동 취소 가능 */
      $('#refund_data_wrap').hide();
    }else{	/* 부분취소 */
      $('#refund_data_wrap').show();
    }
  };

  /* 취소요청 페이지에서 환불 금액 정보를 로드함 */
  var cancelOrderLoadRefundPriceData = function(){
    var refund_price = 0;
    var prod_order_code_list = [];
    $order_cancel_form.find("input._prodOrderCheck:checked").each(function(){
      prod_order_code_list.push($(this).val());
    });
    $.ajax({
      type : 'POST',
      data : {"prod_order_code_list" : prod_order_code_list, "order_code" : cancel_order_code},
      url : ('/shop/order_cancel_refund_price_data.cm'),
      dataType : 'json',
      async : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){
          auto_cancel_enable = res.auto_cancel_enable === true ? 'Y' : 'N';
          $('#refund_price_data_wrap').html(res.result_html);
          refund_price = res['refund_price'];
        }
      }
    });
    return refund_price;
  };

  /* 반품요청 페이지에서 환불 금액 정보를 로드함 */
  var returnOrderLoadRefundPriceData = function(){
    var prod_order_code_list = [];
    $order_return_form.find("input._prodOrderCheck:checked").each(function(){
      prod_order_code_list.push($(this).val());
    });

    // 반품 배송비 계산 - 전체 반품일 경우 초기 배송비도 더해서 보여준다
    $order_return_form.find('#_include_deliv_price').hide();
    var deliv_return_price = $order_return_form.find('#_deliv_refund_price').data('return_price');
    if($order_return_form.find('input._prodOrderCheck').length == $order_return_form.find('input._prodOrderCheck:checked').length){
      var deliv_price = $order_return_form.find('#_deliv_refund_price').data('deliv_price');
      var island_price = $order_return_form.find('#_deliv_refund_price').data('island_price');
      if(deliv_price == 0){
        deliv_price = deliv_return_price;
      }
      deliv_return_price += deliv_price + island_price;
      $order_return_form.find('#_include_deliv_price').show();	// 초기 배송비 포함 출력 제어
    }
    $order_return_form.find('#_deliv_refund_price').text(LOCALIZE.getCurrencyFormat(deliv_return_price));

    var return_reason = $order_return_form.find("select[name='reason']").val();
    var deliv_fee_pay_method = $order_return_form.find("select[name='deliv_fee_pay_method']").val();
    $.ajax({
      type : 'POST',
      data : {
        "prod_order_code_list" : prod_order_code_list,
        "order_code" : return_order_code,
        "deliv_fee_pay_method" : deliv_fee_pay_method,
        "return_reason" : return_reason
      },
      url : ('/shop/order_return_refund_price_data.cm'),
      dataType : 'json',
      async : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){

          $order_return_form.find('#_deliv_refund_price').text(LOCALIZE.getCurrencyFormat(res.deliv_return_price));

          auto_cancel_enable = res.auto_cancel_enable === true ? 'Y' : 'N';
          $('#refund_price_data_wrap').html(res.result_html);
        }
      }
    });

    return auto_cancel_enable;
  };

  /**
   * 취소요청 페이지 취소버튼 누를떄 처리
   * @param type shop/booking
   */
  var cancelOrder = function(type){

    if(is_canceling) return;

    $order_cancel_form = $('#order_cancel_form');
    if(type == 'shop'){
      if(!confirm(LOCALIZE.타이틀_주문취소를진행하시겠습니까())) return;
    }else if(type == 'booking'){
      if(!confirm(LOCALIZE.타이틀_예약취소를진행하시겠습니까())) return;
    }

    is_canceling = true;
    var data = $order_cancel_form.serializeObject();
    data.type = type;
    $.ajax({
      type : 'POST',
      data : data,
      url : ('/shop/order_cancel.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          alert(res.result_msg);
          if(res.ga_switch && res.ga_info.length >= 1){
            /* GA 전자상거래 회수 */
            if(typeof GOOGLE_ANAUYTICS != "undefined"){
              // GOOGLE_ANAUYTICS.Completepayment(res.ga_info[0]['id'],res.total_price);
              GOOGLE_ANAUYTICS.ReversePayment(res.ga_info);
            }
          }

          var location_url = '/shop_mypage/?m2=order';
          if(res.is_guest_login == 'Y'){
            location_url += '&guest_login=Y';
          }
          window.location.href = location_url;
        }else{
          alert(res.msg);
        }

        is_canceling = false;
      }
    });
  };

	const omsCancelTotalOrder = async function(orderCode){
		try {
			if (!confirm('전체 취소하시겠습니까?')) {
				return;
			}
			const { data: authData } = await axios.get(`/ajax/oms/OMS_auth.cm`);
			if (!/^Success$/i.test(authData.msg)) {
				throw new Error(authData.msg);
			}
			const { data } = await axios.patch(
				`/ajax/oms/OMS_wrap_customer_v1_orders_{orderCode}_unpaid-deposit-order_cancel.cm?orderCode=${orderCode}`,
				null,
				{
					headers: {
						Authorization: `Bearer ${authData.token}`,
					}
				}
				);
			if (!/^Success$/i.test(data.message)) {
				throw new Error(data.message);
			}
			alert('취소가 완료되었습니다.');
			window.location.reload();
		} catch (error) {
			alert('취소에 실패하였습니다.\n' + error.message);
		}
	}

  /* 반품/교환 페이지 품목주문 전체 선택 */
  var returnOrderSelectAllProdOrder = function(chk){
    $order_return_form.find("input._prodOrderCheck").prop("checked", chk);
    returnOrderLoadRefundPriceData();
  };
  var exchangeOrderSelectAllProdOrder = function(chk){
    $order_exchange_form.find("input._prodOrderCheck").prop("checked", chk);
  };

  /* 반품/교환 페이지 품목주문 선택 */
  var returnOrderSelectProdOrder = function(){
    returnOrderLoadRefundPriceData();
    if(auto_cancel_enable == 'Y'){	/* 전체 취소, 자동 취소 가능 */
      $('#refund_data_wrap').hide();
    }else{	/* 부분취소 */
      $('#refund_data_wrap').show();
    }
  };
  var exchangeOrderSelectProdOrder = function(){
    if($order_exchange_form.find("input._prodOrderCheck:not(:checked)").length == 0 && auto_cancel_enable == 'Y'){	/* 전체 취소, 자동 취소 가능 */
      $('#refund_data_wrap').hide();
    }else{	/* 부분취소 */
      $('#refund_data_wrap').show();
    }
  };

  /* 반품 수거 방법 변경 */
  var changeReturnCollectMethod = function(collect_method){
    $('._collect_method_wrap').hide();
    $('._collect_address_wrap').hide();

    switch(collect_method){
      case 'RETURN_DESIGNATED':
        /* 지정 반품택배 */
        $('input[name="collect_method_type"][value="RETURN_DESIGNATED"]:radio').prop('checked', true);
        $('#collect_method_designated_wrap').show();
        $('._collect_address_wrap').show();
        break;
      case 'RETURN_DIRECT':
      case 'RETURN_PARCEL':
        $('input[name="collect_method_type"][value="RETURN_PARCEL"]:radio').prop('checked', true);
        /* 직접 발송 */
        $('#collect_method_direct_wrap').show();
        $('._collect_address_wrap').show();
        $('#collect_method').val(collect_method);
        if(collect_method == 'RETURN_PARCEL'){	//택배로 발송
          $('#collect_deliv_company').show();
          $('#collect_tracking_number').show();
          $('._form_select_wrap').show();
          $('#collect_msg').hide();
        }else{	/* 직접전달 */
          $('#collect_deliv_company').hide();
          $('#collect_tracking_number').hide();
          $('._form_select_wrap').hide();
          $('#collect_msg').show();
        }
        break;
      case 'RETURN_LGST_ORDER':
        $('input[name="collect_method_type"][value="RETURN_LGST_ORDER"]:radio').prop('checked', true);
        $('#collect_method_ecpay_api_wrap').show();
        $('#collect_method').val(collect_method);
        break;

    }
  };
  /* 반품 수거 방법 변경 (교환시) */
  var changeExchangeCollectMethod = function(collect_method){
    if(collect_method == 'RETURN_DESIGNATED'){	/* 지정 반품택배 */
      $("#collect_method_type_RETURN_DESIGNATED").prop('checked', true);
      $('#collect_method_direct_wrap').hide();
      $('#collect_method_designated_wrap').show();
    }else{	/* 직접 발송 */
      $("#collect_method_type_RETURN_PARCEL").prop('checked', true);
      $('#collect_method_direct_wrap').show();
      $('#collect_method_designated_wrap').hide();
      $('#collect_method').val(collect_method);
      if(collect_method == 'RETURN_PARCEL'){	//택배로 발송
        $('#collect_deliv_company').show();
        $('#collect_tracking_number').show();
        $('#collect_msg').hide();
      }else{	/* 직접전달 */
        $('#collect_deliv_company').hide();
        $('#collect_tracking_number').hide();
        $('#collect_msg').show();
      }
    }
  };

  /**
   * 교환상세 다이얼로그 띄우기
   */
  var showExchangeDetail = function(exchange_idx){
    $.ajax({
      type : 'POST',
      data : {'exchange_idx' : exchange_idx},
      url : ('/shop/order_exchange_detail.cm'),
      dataType : 'html',
      success : function(html){
        $.cocoaDialog.open({type : 'order_exchange_detail', custom_popup : html});
      }
    });
  };

  /**
   * 반품상세 다이얼로그 띄우기
   */
  var showReturnDetail = function(return_idx){
    $.ajax({
      type : 'POST',
      data : {'return_idx' : return_idx},
      url : '/shop/order_return_detail.cm',
      dataType : 'html',
      success : function(html){
        $.cocoaDialog.open({type : 'order_return_detail', custom_popup : html});
      }
    });
  };

  const omsShowReturnDetail = async function(order_no, order_section_no, order_section_item_code){
	const _url = new URL('/shop/oms/OMS_order_return_detail.cm', window.location.origin);
	const _queries = new URLSearchParams();
	_queries.append('order_no', order_no);
	_queries.append('order_section_no', order_section_no);
	_queries.append('order_section_item_code', order_section_item_code);
	const res = fetch (_url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		body: _queries,
	});

	const html = await res.then(res => res.text());

	$.cocoaDialog.open({type : 'order_return_detail', custom_popup : html});
  }
	const omsShowExchangeDetail = async function(order_no, order_section_no, order_section_item_code){
		const _url = new URL('/shop/oms/OMS_order_exchange_detail.cm', window.location.origin);
		const _queries = new URLSearchParams();
		_queries.append('order_no', order_no);
		_queries.append('order_section_no', order_section_no);
		_queries.append('order_section_item_code', order_section_item_code);
		const res = fetch (_url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			body: _queries,
		});

		const html = await res.then(res => res.text());

		$.cocoaDialog.open({type : 'order_return_detail', custom_popup : html});
	}

  /**
   *  취소상세 다이얼로그 띄우기
   * @param cancel_idx
   */
  var showCancelDetail = function(cancel_idx){
    $.ajax({
      type : 'POST',
      data : {'cancel_idx' : cancel_idx },
      url : '/shop/order_cancel_detail.cm',
      dataType : 'html',
      success : function(html){
        $.cocoaDialog.open({type : 'order_cancel_detail', custom_popup : html});
      }
    });
  };

  const omsShowCancelDetail = async function(order_no, order_section_no, order_section_item_code){
	const _url = new URL('/shop/oms/OMS_order_cancel_detail.cm', window.location.origin);
	const _queries = new URLSearchParams();
	_queries.append('order_no', order_no);
	_queries.append('order_section_no', order_section_no);
	_queries.append('order_section_item_code', order_section_item_code);
	const res = fetch (_url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		body: _queries,
	});

	const html = await res.then(res => res.text());

	$.cocoaDialog.open({type : 'order_cancel_detail', custom_popup : html});
  }

  /**
   * 반품요청 페이지 신청하기 누를떄 처리
   */
  var returnOrder = function(){
    if(!confirm(getLocalizeString('타이틀_반품신청을진행하시겠습니까', '', '반품 신청을 진행하시겠습니까?'))) return;
    var data = $order_return_form.serializeObject();
    $.ajax({
      type : 'POST',
      data : data,
      url : ('/shop/order_return.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(res.result_msg != '') alert(res.result_msg);
          window.location.href = '/shop_mypage/?m2=cancel';
        }else{
          alert(res.msg);
        }
      }
    });
  };

  /**
   * 교환요청 페이지 신청하기 누를떄 처리
   */
  var exchangeOrder = function(){
    if(!confirm(getLocalizeString('타이틀_교환신청을진행하시겠습니까', '', '교환 신청을 진행하시겠습니까?'))) return;
    var data = $order_exchange_form.serializeObject();
    $.ajax({
      type : 'POST',
      data : data,
      url : ('/shop/order_exchange.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(res.result_msg != '') alert(res.result_msg);
          if(res.deliv_fee > 0){	/* 교환배송비가 있을경우 교환비용결제화면으로 이동 */
            window.location.href = '/shop_mypage/?m2=exchange_pay&idx=' + res.order_idx + '&exchange_idx=' + res.prod_order_idx;
          }else
            window.location.href = '/shop_mypage/?m2=cancel';
        }else{
          alert(res.msg);
        }
      }
    });
  };
  /**
   * 교환요청 페이지 신청하기 누를떄 처리
   */
  var showSippingAddress = function(shipping_place_code){
    $.ajax({
      type : 'POST',
      data : {'shipping_place_code' : shipping_place_code},
      url : ('/shop/get_shipping_place_data.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          $('._return_address_wrap').text(res.addreess);
          $('._return_address_call_num').text(res.call_num);
        }else{
          alert(res.msg);
        }
      }
    });
  };

  /**
   * 교환비용 결제 페이지 확인 누를떄 처리
   */
  var exchangeOrderPay = function(){
    $order_exchange_form = $('#order_exchange_form');
    if(!confirm(getLocalizeString('타이틀_교환비용결제를진행하시겠습니까', '', '교환 비용결제를 진행하시겠습니까?'))) return;
    var data = $order_exchange_form.serializeObject();
    $.ajax({
      type : 'POST',
      data : data,
      url : ('/shop/order_exchange_pay.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          window.location.href = '/shop_mypage/?m2=order';
        }else{
          alert(res.msg);
        }
      }
    });
  };

  /**
   * 반품철회 누를떄 처리
   */
  var withdrawReturnOrder = function(return_idx, is_c3){
    if(!confirm(getLocalizeString('타이틀_반품신청을철회하시겠습니까', '', '반품신청을 철회하시겠습니까?'))) return;

    $.ajax({
      type : 'POST',
      data : {"return_idx" : return_idx},
      url : is_c3 ? '/shop/oms/OMS_order_return_withdraw.cm' : '/shop/order_return_withdraw.cm',
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(res.result_msg != '') alert(res.result_msg);
          window.location.href = '/shop_mypage/?m2=order';
        }else{
          alert(res.msg);
        }
      }
    });
  };
  /**
   * OMS; 반품철회, 교환철회 누를떄 처리
   */
	const omsWithdrawReturnOrder = function({qty=0,orderCode,orderSectionCode,orderSectionItemCode,flag=false}) {
		if (!qty) {
			alert('철회할 상품의 수량을 입력해주세요.');
			return;
		}

		const localizeCode = (flag) ? "타이틀_교환신청을철회하시겠습니까" : "타이틀_반품신청을철회하시겠습니까";
	    const defaultString = flag ? "해당 상품을 반품을 철회 하시겠습니까?" : "해당 상품을 반품을 철회 하시겠습니까?";

		if(confirm(getLocalizeString(localizeCode, '', defaultString))){
			const orderSectionItemCodes = {
				orderSectionItemCode :orderSectionItemCode,
				qty:Number(qty)
			};
			const targetItemInformation = [];
			targetItemInformation.push(orderSectionItemCodes)
			const requestData = {
				orderSectionCode : orderSectionCode,
				targetItemInformation:targetItemInformation,
			}
			const sectionManageUrl = new URL(`/customer/v1/orders/${orderCode}/sections/revert-return-request`,
				window.TEST_SERVER === true ? 'https://api.oms.imstage.me' : 'https://api.oms.imweb.me'
			)
			return fetch('/ajax/oms/OMS_auth.cm', { credentials: 'include' })
			  .then(res => res.json())
				.then(json => json.msg === 'SUCCESS' ? json.token : Promise.reject(json.msg))
				.then(token => fetch(sectionManageUrl.href, {
					method: 'PATCH',
					body: JSON.stringify(requestData),
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				}))
				.then(res => res.json())
				.then(json => {
					if(json.statusCode !== 200) {
						return Promise.reject(
							typeof window.LOCALIZE[`E_${json.code}`] === 'function' ?
								window.LOCALIZE[`E_${json.code}`]() :
								undefined
						)
					}
					if (!json.data.updateResult) {
						return Promise.reject()
					}
				})
				.catch(err => alert(err || window.LOCALIZE.타이틀_일시적인서비스장애()))
				.finally(() => window.location.reload());
		}
	}
	/**
	 * OMS; 취소철회 누를떄 처리
	 */
	const omsWithdrawCancelOrder = function({qty=0,orderCode,orderSectionCode,orderSectionItemCode}) {
		if (!qty) {
			alert('취소할 상품의 수량을 입력해주세요.');
			return;
		}

		if(confirm(getLocalizeString('타이틀_취소신청을철회하시겠습니까', '', '취소신청을 철회 하시겠습니까?'))){
			const orderSectionItemCodes = {
				orderSectionItemCode :orderSectionItemCode,
				qty:Number(qty)
			};
			const targetItemInformation = [];
			targetItemInformation.push(orderSectionItemCodes)
			const requestData = {
				orderSectionCode : orderSectionCode,
				targetItemInformation:targetItemInformation,
			}
			const sectionManageUrl = new URL(`/customer/v1/orders/${orderCode}/sections/revert-cancel-request`,
				window.TEST_SERVER === true ? 'https://api.oms.imstage.me' : 'https://api.oms.imweb.me'
			)
			return fetch('/ajax/oms/OMS_auth.cm', { credentials: 'include' })
			  .then(res => res.json())
				.then(json => json.msg === 'SUCCESS' ? json.token : Promise.reject(json.msg))
				.then(token => fetch(sectionManageUrl.href, {
					method: 'PATCH',
					body: JSON.stringify(requestData),
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				}))
				.then(res => res.json())
				.then(json => {
					if(json.statusCode !== 200) {
						return Promise.reject(
							typeof window.LOCALIZE[`E_${json.code}`] === 'function' ?
								window.LOCALIZE[`E_${json.code}`]() :
								undefined
						)
					}
					if (!json.data.updateResult) {
						return Promise.reject()
					}
				})
				.catch(err => alert(err || window.LOCALIZE.타이틀_일시적인서비스장애()))
				.finally(() => window.location.reload());
		}
	}
  /**
   * 교환철회 누를떄 처리
   */
  var withdrawExchangeOrder = function(exchange_idx){
    if(!confirm(getLocalizeString('타이틀_교환신청을철회하시겠습니까', '', '교환신청을 철회하시겠습니까?'))) return;
    $.ajax({
      type : 'POST',
      data : {"exchange_idx" : exchange_idx},
      url : ('/shop/order_exchange_withdraw.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(res.result_msg != '') alert(res.result_msg);
          window.location.href = '/shop_mypage/?m2=order';
        }else{
          alert(res.msg);
        }
      }
    });
  };

  /**
   * 취소철회 누를떄 처리
   */
  var withdrawCancelOrder = function(cancel_idx, is_c3 = false){
    if(!confirm(getLocalizeString('타이틀_취소신청을철회하시겠습니까', '', '취소신청을 철회하시겠습니까?'))) return;
    $.ajax({
      type : 'POST',
      data : {"cancel_idx" : cancel_idx},
      url : is_c3 ? '/shop/oms/OMS_order_cancel_withdraw.cm' : '/shop/order_cancel_withdraw.cm',
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          if(res.result_msg != '') alert(res.result_msg);
          window.location.href = '/shop_mypage/?m2=order';
        }else{
          alert(res.msg);
        }
      }
    });
  };

  /* TODO 묶음배송 - deprecated 처리 */
  var openMobileOrder = function(idx){
    $.ajax({
      type : 'POST',
      data : {'idx' : idx},
      url : ('/dialog/order_history.cm'),
      dataType : 'html',
      success : function(html){
        $.cocoaDialog.open({type : 'admin_order_history', custom_popup : html});
      }
    });
  };

  /**
   * 반품 페이지 초기화
   * @param auto_cancel 자동취소지원유무 (Y/N)
   */
  var initReturnOrder = function(order_code, auto_cancel){
    $order_return_form = $('#order_return_form');
    auto_cancel_enable = auto_cancel;
    return_order_code = order_code;
    returnOrderSelectProdOrder();
    changeReturnCollectMethod($('input[name="collect_method_type"]:radio:checked').val());
  };

  /**
   * 교환 페이지 초기화
   */
  var initExchangeOrder = function(order_code, auto_cancel){
    $order_exchange_form = $('#order_exchange_form');
    auto_cancel_enable = auto_cancel;
    exchange_order_code = order_code;
    exchangeOrderSelectProdOrder();
  };

  var requestCashReceipt = function(q, mode){
    if(!q || !mode){
      alert(getLocalizeString('설명_주문번호혹은모드가없습니다', '', '주문번호 혹은 모드가 없습니다.'));
      return false;
    }
    $.ajax({
      type : 'POST',
      data : {'q' : q, 'mode' : mode},
      url : ('/shop/request_cash_receipt.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          $.cocoaDialog.open({type : 'request_cash_receipt', custom_popup : res.html})
        }else{
          alert(res.msg);
        }
      }
    });
  };

  var requestCashReceiptProc = function(q, cash_receipt_type, cash_receipt_value){
    $.ajax({
      type : 'POST',
      data : {'q' : q, 'cash_receipt_type' : cash_receipt_type, 'cash_receipt_value' : cash_receipt_value},
      url : ('/shop/request_cash_receipt_proc.cm'),
      dataType : 'json',
      success : function(res){
        if(res.msg == 'SUCCESS'){
          alert(getLocalizeString('설명_현금영수증신청이완료되었습니다', '', '현금영수증 신청이 완료되었습니다.'));
          window.location.reload();
        }else{
          alert(res.msg);
        }
      }
    });
  };

  var mod_order_no = '';
  var openChangeOrderAddress = function(q){
    $.ajax({
      type : 'POST',
      data : {'q' : q},
      url : ('/shop/change_order_address.cm'),
      dataType : 'html',
      success : function(html){
        $.cocoaDialog.open({type : 'change_order_address', custom_popup : html})
        var $form = $('#modify_address_form');
        mod_order_no = $form.find("input[name='order_no']").val();
        $form.find('._add_btn').on('click', function(){
          $.ajax({
            type : 'POST',
            data : $form.serialize(),
            url : ('/shop/change_order_address_proc.cm'),
            dataType : 'json',
            async : false,
            cache : false,
            success : function(res2){
              if(res2.msg == 'SUCCESS'){
                $.cocoaDialog.close();
                mod_order_no = '';
                location.reload();
              }else{
                var msg = res2.msg;
                if(res2.code){
                  msg += ' (' + res2.code + ')';
                }
                alert(msg);
              }
            }
          });
        });
      }
    });
  };

  var changeDelivAddressCountrySelect = function(q){
    var $form = $('#modify_address_form');

    $.ajax({
      type : 'POST',
      data : {'q' : q},
      url : ('/shop/change_order_address_form.cm'),
      dataType : 'json',
      async : false,
      cache : false,
      success : function(res){
        if(res.msg == 'SUCCESS'){
          var $_address_wrap = $form.find('._deliv_address_wrap').find('._address_wrap');
          $_address_wrap.html(res.html);

          if(res.use_daum_api == 'Y'){
            var addr_daum = new ZIPCODE_DAUM();
            addr_daum.init({
              'addr_container' : $('#order_find_address'),
              'addr_pop' : $('#address_search_popup .search_popup_body'),
              'post_code' : $('#order_postcode_input'),
              'addr' : $('#order_address_input'),
              'onStart' : function(){
              },
              'onComplete' : function(key){
                $('#order_address_detail_input').focus();
                address = key.jibunAddressEnglish;
                splitAddress = address.split(',');

                if(key.addressEnglish != "undefined"){
                  address = key.addressEnglish;
                  splitAddress = address.split(',');
                  if(splitAddress.length > 5){
                    street = splitAddress[0] + " " + splitAddress[1];
                    city = splitAddress[2] + " " + splitAddress[3];
                    state = splitAddress[4];
                  }else{
                    street = splitAddress[0] + " " + splitAddress[1];
                    city = splitAddress[2];
                    state = splitAddress[3];
                  }
                }else if(key.jibunAddressEnglish != "undefined"){
                  address = key.jibunAddressEnglish;
                  splitAddress = address.split(',');
                  if(splitAddress.length > 5){
                    street = splitAddress[0] + " " + splitAddress[1];
                    city = splitAddress[2] + " " + splitAddress[3];
                    state = splitAddress[4];
                  }else{
                    street = splitAddress[0] + " " + splitAddress[1];
                    city = splitAddress[2];
                    state = splitAddress[3];
                  }
                }

                $("input[name='address_street']").val(street);
                $("input[name='address_city']").val(city);
                $("input[name='address_state']").val(state);
                $("input[name='address_zipcode']").val(key.zonecode);
              },
              'onShow' : function(){
                $('#address_search_popup').show();
              },
              'onClose' : function(){
                $('#address_search_popup').hide();
              }
            });
          }
        }
      }
    });
  };

  var openChangeCVSAddress = function(cvs, order_no){
    var popname = 'change_emap';

    var popup_w = 400;
    var popup_h = 600;
    var popup_top = Math.ceil((window.screen.height - popup_h) / 2);
    var popup_left = Math.ceil((window.screen.width - popup_w) / 2);

    var popup_style = '';
    popup_style += 'top=' + popup_top + ',';
    popup_style += 'left=' + popup_left + ',';
    popup_style += 'height=' + popup_h + 'px,';
    popup_style += 'width=' + popup_w + 'px';

    var url = '/ajax/change_cvs_address_popup.cm?cvs=' + cvs + '&order_no=' + order_no;
    window.open(url, popname, 'toolbar=no, channelmode=no, location=no, directories=no, menubar=no, scrollbars=yes, resizable=yes, status=yes, ' + popup_style);
  };

  var updateCVSAddress = function(address_data){
    if(mod_order_no === '') return;
    if(typeof address_data == "undefined") return;
    if(mod_order_no != address_data['mod_order_no']) return;

    var $form = $('#modify_address_form');
    $form.find('._deliv_address_wrap').find('.cvs_address_info').html(address_data['address_str']).addClass('text-danger');

    for(var _key in address_data){
      if($form.find('input[name="' + _key + '"]').length > 0){
        $form.find('input[name="' + _key + '"]').val(address_data[_key]);
      }
    }
    $form.find('.cvs_list_wrapper').hide();
  };

  var digitalFileDownload = function(prod_no, order_idx, is_expired){
    if(is_expired){
      alert(getLocalizeString('설명_다운로드만료안내', '', "다운로드 가능 기간 또는 횟수가 초과되었습니다. \n재 구매 후 다시 시도 바랍니다."));
      return false;
    }
    if(!prod_no){
      alert(getLocalizeString('설명_다운로드불가안내', '', "다운로드 가능한 파일이 없습니다. \n관리자에게 문의해 주세요."));
      return false;
    }
    $.ajax({
      "type" : "POST",
      "data" : {"prod_no" : prod_no, "order_idx" : order_idx, "mode" : "mypage"},
      "url" : "/ajax/shop_digital_prod_download.cm",
      "dataType" : "JSON",
      "success" : function(res){
        if(res['msg'] == 'SUCCESS'){
          if(res['download_info_msg'].trim() == '' || confirm(res['download_info_msg'])){
            location.href = res['file_url'];
          }
        }else{
          alert(res['msg']);
        }
      }
    });
  };


  var digitalFileDownloadByProdOrder = function(prod_no, prod_order_no, is_expired){
    if(is_expired){
      alert(getLocalizeString('설명_다운로드만료안내', '', "다운로드 가능 기간 또는 횟수가 초과되었습니다. \n재 구매 후 다시 시도 바랍니다."));
      return false;
    }
    if(!prod_no || !prod_order_no){
      alert(getLocalizeString('설명_다운로드불가안내', '', "다운로드 가능한 파일이 없습니다. \n관리자에게 문의해 주세요."));
      return false;
    }

    $.ajax({
      "type" : "POST",
      "data" : {"mode" : "mypage", "prod_no" : prod_no, "prod_order_no" : prod_order_no},
      "url" : "/ajax/shop_digital_prod_download.cm",
      "dataType" : "JSON",
      "success" : function(res){
        if(res['msg'] == 'SUCCESS'){
          if(res['download_info_msg'].trim() == '' || confirm(res['download_info_msg'])){
            location.href = res['file_url'];
          }
        }else{
          alert(res['msg']);
        }
      }
    });
  };
  const siteRegularChangeAddressDropDown = () => {
    const site_my_page_dropdown_btn = document.querySelector('#site_my_page-dropdown_btn');
    const site_my_page_dropdown_container = document.querySelector('#site_my_page-dropdown_container');
    const memo_dropdown_btn = document.querySelector('#memo_dropdown_btn');
    const memo_dropdown_container = document.querySelector('#memo_dropdown_container');
    let click_flag = false;
    const hideAndShowAddressDropDown = (trigger, target) => {
      if(trigger){
        trigger.addEventListener('click', () => {
          click_flag = true
          target.classList.toggle('tw-hidden');
        })
        window.addEventListener('click',(e)=>{
          if(click_flag && !e.target.classList.contains('_address_drop_down')){
            target.classList.add('tw-hidden');
          }  
        })
      }
    }
    hideAndShowAddressDropDown(site_my_page_dropdown_btn, site_my_page_dropdown_container);
    hideAndShowAddressDropDown(memo_dropdown_btn, memo_dropdown_container);
  }
  const isDefaultAddress = () =>{
    const default_regularly_address_text = document.querySelector("._default_regularly_address_text");
    const latest_regularly_address_text = document.querySelector("._latest_regularly_address_text");
    if(document.querySelector('input[name=container_input]:checked')){
      const regularly_address_list_checked = document.querySelector('input[name=container_input]:checked').nextElementSibling;
      if(regularly_address_list_checked){
        const checked_shipping_data = {
          'deliv_name' : regularly_address_list_checked.querySelector('input[name=deliv_name]').value,
          'deliv_call' : regularly_address_list_checked.querySelector('input[name=deliv_call]').value,
          'deliv_postcode' : regularly_address_list_checked.querySelector('input[name=deliv_postcode]').value,
          'deliv_address' : regularly_address_list_checked.querySelector('input[name=deliv_address]').value,
          'deliv_address_detail' : regularly_address_list_checked.querySelector('input[name=deliv_address_detail]').value,
          'is_default' : regularly_address_list_checked.querySelector('input[name=is_default]').value,
          'is_latest' : regularly_address_list_checked.querySelector('input[name=is_latest]').value,
        }
        const regularly_shipping_data = {
          'deliv_name' : document.querySelector('input[name=regularly_value_check-deliv_name]').value,
          'deliv_call' : document.querySelector('input[name=regularly_value_check-deliv_call]').value,
          'deliv_postcode' : document.querySelector('input[name=regularly_value_check-deliv_postcode]').value,
          'deliv_address' : document.querySelector('input[name=regularly_value_check-deliv_address]').value,
          'deliv_address_detail' : document.querySelector('input[name=regularly_value_check-deliv_address_detail]').value,
        }
        const match_array = [];
        let i = 0;
        for (const key in regularly_shipping_data) {
          if(checked_shipping_data[key] == regularly_shipping_data[key]){
            match_array[i] = true;
          } else {
            match_array[i] = false;
          }
          i ++;
        }
        if(match_array.every((item)=> item === true)){
          if(checked_shipping_data['is_default'] === "1"){
            default_regularly_address_text.classList.remove('tw-hidden');
          } else {
            default_regularly_address_text.classList.add('tw-hidden');
          }
          if(checked_shipping_data['is_latest'] === "1"){
            latest_regularly_address_text.classList.remove('tw-hidden');
          } else {
            latest_regularly_address_text.classList.add('tw-hidden');
          }
        } else {
          default_regularly_address_text.classList.add('tw-hidden');
        }
      }
    }
    
    
  }
  const setRegularlyAddressMemo = (...props) =>{
    const form_memo = document.querySelector('#regularly_address_form-memo');
    const btn_memo_submit = document.querySelector('#regularly_memo_manually_select_btn');
    if(form_memo){
      let memo_data = {
        'deliv_name' : form_memo.querySelector('input[name=deliv_name]').value, 
        'deliv_call' : form_memo.querySelector('input[name=deliv_call]').value, 
        'deliv_postcode' : form_memo.querySelector('input[name=deliv_postcode]').value, 
        'deliv_address' : form_memo.querySelector('input[name=deliv_address]').value, 
        'deliv_address_detail' : form_memo.querySelector('input[name=deliv_address_detail]').value,
        'deliv_address_detail' : form_memo.querySelector('input[name=deliv_address_detail]').value,
        'deliv_memo':  $("input[name=deliv_memo]:checked").val(),
        'regularly_code': document.querySelector('input[name=regularly_code]').value,
        'request_type': 'update',
      }
      let memo_check_data = {
        'deliv_name' : form_memo.querySelector('input[name=deliv_name]').value, 
        'deliv_call' : form_memo.querySelector('input[name=deliv_call]').value, 
        'deliv_postcode' : form_memo.querySelector('input[name=deliv_postcode]').value, 
        'deliv_address' : form_memo.querySelector('input[name=deliv_address]').value, 
        'deliv_address_detail' : form_memo.querySelector('input[name=deliv_address_detail]').value,
        'deliv_address_detail' : form_memo.querySelector('input[name=deliv_address_detail]').value,
        'deliv_memo':  $("input[name=deliv_memo]:checked").val(),
        'regularly_code': document.querySelector('input[name=regularly_code]').value,
        'request_type': 'check_deliv_price',
      }
      if($('input[name=deliv_memo]:checked').val() === "직접입력"){
        $('#regularly_memo_contents_container').removeClass('tw-hidden');
        $('#regularly_memo_contents_span').html($('input[name=deliv_memo]:checked').val());
        $('#regularly_memo_contents_input').focus();
        btn_memo_submit.addEventListener('click',()=>{
          memo_data.deliv_memo = $('#regularly_memo_contents_input').val();
          if(memo_data.deliv_memo === ""){
            alert(getLocalizeString('설명_배송메모를입력해주세요', '', '배송메모를 입력해 주세요.'));
          } else {
            axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', memo_check_data)
            .then(res => {
              if(res.status === 200 ){
                const msg_split = res.data.confirm_msg.split(' ', );
                const variant_text = getLocalizeString('설명_'.concat(msg_split[1].substring(1,2),'요일약자'),'','요일');
                const msg_text = msg_split[0].concat(' (',variant_text,') ',getLocalizeString('설명_주문부터적용됩니다수정하시겠습니까', '', '주문부터 적용됩니다. 수정하시겠습니까?'));
                if(confirm(msg_text)){
                  axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', memo_data)
                  .then(res => {
                    if(res.status === 200 ){
                      console.log(res);
                      location.reload();
                    }
                  })
                }
              } else {
                alert('잠시 후 다시 시도해주세요.');
                console.log(res.data);
              }
            })
          }
        })
      } else {
        $('#regularly_memo_contents_container').addClass('tw-hidden');
        $('#regularly_memo_contents_span').html($('input[name=deliv_memo]:checked').val());
        axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', memo_check_data)
        .then(res => {
          if(res.status === 200 ){
            const msg_split = res.data.confirm_msg.split(' ', );
            const variant_text = getLocalizeString('설명_'.concat(msg_split[1].substring(1,2),'요일약자'),'','요일');
            const msg_text = msg_split[0].concat(' (',variant_text,') ',getLocalizeString('설명_주문부터적용됩니다수정하시겠습니까', '', '주문부터 적용됩니다. 수정하시겠습니까?'));
            if(confirm(msg_text)){
              axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', memo_data)
              .then(res => {
                if(res.status === 200 ){
                  console.log(res);
                  location.reload();
                }
              })
            }
          } else {
            alert('잠시 후 다시 시도해주세요.');
            console.log(res.data);
          }
        })
      }
    }
  }
  
  const changeRegularlyAddressInDropDown = (...props) =>{
    const target_id = `#regularly_address_form_id-${props[0]['idx']}`
    const regularly_address_form_id = document.querySelector(target_id);
    const deliv_name = document.querySelector(`#regularly_address_form_id-${props[0]['idx']} > input[name=deliv_name]`).value;
    const deliv_call = document.querySelector(`#regularly_address_form_id-${props[0]['idx']} > input[name=deliv_call]`).value;
    const deliv_postcode = document.querySelector(`#regularly_address_form_id-${props[0]['idx']} > input[name=deliv_postcode]`).value;
    const deliv_address = document.querySelector(`#regularly_address_form_id-${props[0]['idx']} > input[name=deliv_address]`).value;
    const deliv_address_detail = document.querySelector(`#regularly_address_form_id-${props[0]['idx']} > input[name=deliv_address_detail]`).value;
    const regularly_code = document.querySelector(`input[name=regularly_code]`).value;
    let check_data = {'deliv_name':deliv_name,'deliv_call':deliv_call,'deliv_postcode':deliv_postcode,'deliv_address':deliv_address,'deliv_address_detail':deliv_address_detail,'request_type':'check_deliv_price','regularly_code':regularly_code};
    let submit_data = {'deliv_name':deliv_name,'deliv_call':deliv_call,'deliv_postcode':deliv_postcode,'deliv_address':deliv_address,'deliv_address_detail':deliv_address_detail,'request_type':'update','regularly_code':regularly_code};
    axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', check_data)
    .then(res => {
      if (res.status === 200 && res.data.msg === 'SUCCESS') {
        const msg_split = res.data.confirm_msg.split(' ', );
        const variant_text = getLocalizeString('설명_'.concat(msg_split[1].substring(1,2),'요일약자'),'','요일');
        const msg_text = msg_split[0].concat(' (',variant_text,') ',getLocalizeString('설명_주문부터적용됩니다수정하시겠습니까', '', '주문부터 적용됩니다. 수정하시겠습니까?'));
        if(confirm(msg_text)){
          axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', submit_data)
          .then(res => {
            if (res.status === 200) {
              if (res.data.msg === 'SUCCESS') {
                location.reload();
              } else {
                console.log(res.data.msg);
              }
            } else {
              alert(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err)
          })
          return;
        }
      } else {
        if(res.data.msg === "변경사항이 없습니다."){
          alert('동일한 배송지 입니다.')
        } else {
          alert(res.data.msg);
        }
      }
    })
    .catch(err => {
      console.log(err)
    }) 
  }

  /**
   * SITE_SHOP_MYPAGE.showModifyRegularAddressModal(props)
   * props : {};
   * props keys : add_or_list ,  idx
   * add_or_list : 'list' / 'add' <string>
   * idx : <number>
   * */
  const showModifyRegularAddressModal = (...props) => {
    const data = {
      'idx' : props[0].idx,
      'addOrList' : props[0].addOrList,
    }
    $.ajax({
      type : "POST",
      url : "/ajax/regularly/site_modify_regularly_address.cm",
      data : data,
      dataType : "JSON",
      success : function(res){
        $.cocoaDialog.open({type : 'admin', custom_popup : res.html, max_width : 540, min_width: 375}, function(){
          SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents({'addOrList' : props[0].addOrList});
          SITE_SHOP_MYPAGE.toggleRegularAddressListAddSection({'addOrList' : props[0].addOrList});
          SITE_SHOP_MYPAGE.updateRegularlyAddressAjax();
        });
      },
      error : function(res){
        console.log(res);
        console.log('error');
      }
    })
  }

  /**
   * Usages :  SITE_SHOP_MYPAGE.toggleRegularAddressListAddSection();
   * */
  const toggleRegularAddressListAddSection = (...props) => {
    const add_regularly_address_btn = document.querySelector('#add_regularly_address_btn');
    const list_regularly_address_btn = document.querySelector('#list_regularly_address_btn');
    const add_regularly_address_header = document.querySelector('#add_regularly_address_header');
    const list_regularly_address_header = document.querySelector('#list_regularly_address_header');
    add_regularly_address_btn.addEventListener('click', () => {
      add_regularly_address_header.classList.add('regularly_border-b','tw-font-bold','text-brand');
      list_regularly_address_header.classList.remove('regularly_border-b','tw-font-bold','text-brand');
      SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents({'addOrList' : 'add'});
    })
    list_regularly_address_btn.addEventListener('click', () => {
      add_regularly_address_header.classList.remove('regularly_border-b','tw-font-bold','text-brand');
      list_regularly_address_header.classList.add('regularly_border-b','tw-font-bold','text-brand');
      SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents({'addOrList' : 'list'});
    })
  }
  /**
   * Usages :  SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents(...props);
   * props : Object
   * */
  const renderRegularlyAddressModalContents = (...props) => {
    const contents_body = document.querySelector('#contents-body');
    let url = '';
    let data = {};
    switch(props[0].addOrList){
      case 'list' :{
        url = "/ajax/regularly/modal_site_list_regularly_address.cm";
        data = {'addOrList' : 'list'};
        $("._list_show_more").addClass('tw-mb-[56px]');
      }
        break;
      case 'add' :{
        url = "/ajax/regularly/modal_site_add_regularly_address.cm";
        data = {'addOrList' : 'add'};
      }
        break;
    }
    $.ajax({
      type : "POST",
      url : url,
      data : data,
      dataType : "JSON",
      success : function(res){
        contents_body.innerHTML = res.html;
        getKakaoAddressAPI();
        if(props[0].addOrList === 'list') {
          SITE_SHOP_MYPAGE.loadMoreAddressList();
          document.querySelector('#update_regularly_address_btn').disabled = false;
        } else {
          document.querySelector('#update_regularly_address_btn').disabled = true;
          SITE_SHOP_MYPAGE.addRegularlyAddressValidation();
        }
        if($("#update_regularly_address_btn_container").hasClass('tw-hidden')){
          $("#update_regularly_address_btn_container").removeClass('tw-hidden');  
        }
      },
      error : function(res){
        console.log(res);
      }
    })
  }
  const getKakaoApiInput = (...props) => {
    let add_regularly_address_form = '';
    if(props.length === 0 || props === undefined){
      add_regularly_address_form = '#add_regularly_address_form';
    }else{
      add_regularly_address_form = `#add_regularly_address_form_${props[0].idx}`;
    }
    $.ajax({
      type : "POST",
      url : "/ajax/regularly/get_kakao_api_input.cm",
      data : props[0],
      dataType : "JSON",
      success : function(res){
        $(add_regularly_address_form).html(res.html);
        $('input[name=deliv_name]').val(props[0]['deliv_name']);
        $('input[name=deliv_call]').val(props[0]['deliv_call']);
        $('input[name=deliv_address]').val(props[0]['deliv_address']);
        $('input[name=deliv_address_detail]').val(props[0]['deliv_address_detail']);
        $('input[name=deliv_zipcode]').val(props[0]['deliv_postcode']);
        if(props[0]['is_default']){
          $('input[name=is_default_shipping]').prop("checked", true);
        }
        getKakaoAddressAPI();
        $('input[name=deliv_address]').on('click',()=>{
          $('input[name=deliv_zipcode]').val(null);
          $('input[name=deliv_address]').val(null);
          $('input[name=deliv_address_detail]').val(null);
        })
        $('#open_kakao_address').on('click',()=>{
          $('input[name=deliv_zipcode]').val(null);
          $('input[name=deliv_address]').val(null);
          $('input[name=deliv_address_detail]').val(null);
        })
      },
      error : function(res){
        console.log(res);
      }
    })
  }
  const getKakaoAddressAPI = () => {
    var addr_daum = new ZIPCODE_DAUM();
    addr_daum.init({
      'addr_container' : $('#address_search_popup'),
      'addr_pop' : $('#address_search_popup .search_popup_body'),
      'post_code' : $('#order_postcode_input'),
      'addr' : $('#order_address_input'),
      'open_button': $('#open_kakao_address'),
      'onStart' : function(){
      },
      'onComplete' : function(key){
        $('input[name=deliv_address_detail]').focus();
        $("input[name='deliv_address']").val(key.address);
        $("input[name='deliv_zipcode']").val(key.zonecode);
      },
      'onShow' : function(){
        $('#address_search_popup').css({"border":"1px","border-style":"solid","border-color":"black","margin-bottom":"10px"})
        $('#add_regular_address_container').scrollTop(60);
        $('#open_kakao_address').hide();
        $('#close_kakao_address').show();
      },
      'onClose' : function(){
        $('#address_search_popup').hide();
        $('#open_kakao_address').show();
        $('#close_kakao_address').hide();
        $('#address_search_popup').css({"border":"none","margin-bottom":"0px"})
      }
    });
  }
  /**
   * SITE_SHOP_MYPAGE.openUpdateRegularlyAddress(props)
   * 모달창의 배송지 목록탭 오른쪽 배송지 수정 버튼을 눌렀을 때
   * */
  const openUpdateRegularlyAddress = (...props) => {
    const update_container = `#update_regularly_address_container_${props[0].idx}`
    const data_container = `#data_regularly_address_container_${props[0].idx}`
    const _update_item_input = `#data_regularly_address_container_${props[0].idx} > label > input`
    const update_regularly_address_container = document.querySelector(update_container);
    const data_regularly_address_container = document.querySelector(data_container);
    const update_item_input = document.querySelector(_update_item_input);
    update_regularly_address_container.classList.remove('tw-hidden');
    data_regularly_address_container.classList.add('tw-hidden');
    update_item_input.checked = true;
    SITE_SHOP_MYPAGE.disableOtherItems(...props);
    $("#update_regularly_address_btn_container").addClass('tw-hidden');
    $("._list_show_more").removeClass('tw-mb-[56px]')
    getKakaoApiInput(...props);
  }
  /**
   * SITE_SHOP_MYPAGE.updateRegularlyAddressAjax(props)
   * 정기구독 주소지 변경 버튼 눌렀을 때
   * axios
   * */
  const updateRegularlyAddressAjax = () =>{
    const update_regularly_address_btn = document.querySelector('#update_regularly_address_btn');
    let check_regularly_shipping_data = {};
    let add_regularly_shipping_data = {};
    let add_shipping_data = {};
    let is_temp = "";
    update_regularly_address_btn.addEventListener('click',()=>{
      const add_regularly_address_form = document.querySelector('#add_regularly_address_form');
      update_regularly_address_btn.disabled = true;
      if($("input[name=is_add_shipping]:checked").val() === 'Y'){
        is_temp = 'N';
      } else {
        is_temp = 'Y';
      }
      if(add_regularly_address_form){
        check_regularly_shipping_data = {
          'deliv_name': $("#add_regularly_address_form input[name=deliv_name]").val(),
          'deliv_call': $("#add_regularly_address_form input[name=deliv_call]").val(),
          'deliv_postcode': $("#add_regularly_address_form input[name=deliv_postcode]").val(),
          'deliv_address': $("#add_regularly_address_form input[name=deliv_address]").val(),
          'deliv_address_detail': $("#order_address_detail_input").val(),
          'regularly_code': $("input[name=regularly_code]").val(),
          'request_type': 'check_deliv_price',
        }
        add_regularly_shipping_data = {
          'deliv_name': $("#add_regularly_address_form  input[name=deliv_name]").val(),
          'deliv_call': $("#add_regularly_address_form  input[name=deliv_call]").val(),
          'deliv_postcode': $("#add_regularly_address_form  input[name=deliv_postcode]").val(),
          'deliv_address': $("#add_regularly_address_form  input[name=deliv_address]").val(),
          'deliv_address_detail': $("#order_address_detail_input").val(),
          'regularly_code': $("input[name=regularly_code]").val(),
          'request_type': 'update',
        }
        add_shipping_data = {
          'shipping_country': 'KR',
          'is_temp': is_temp,
          'is_default': $("#add_regularly_address_form input[name=is_default_shipping]:checked").val(),
          'address_data' :{
            'deliv_name': $("#add_regularly_address_form input[name=deliv_name]").val(),
            'deliv_call': $("#add_regularly_address_form input[name=deliv_call]").val(),
            'deliv_postcode': $("#add_regularly_address_form input[name=deliv_postcode]").val(),
            'deliv_address': $("#add_regularly_address_form input[name=deliv_address]").val(),
            'deliv_address_detail': $("#order_address_detail_input").val(),
            'regularly_code': $("#add_regularly_address_form  input[name=regularly_code]").val(),
            'is_add_shipping': $("#add_regularly_address_form  input[name=is_add_shipping]:checked").val(),
          }
        }
      } else {
        check_regularly_shipping_data = {
          'deliv_name': $("input[name=deliv_name]").val(),
          'deliv_call': $("input[name=deliv_call]").val(),
          'deliv_postcode': $("input[name=deliv_postcode]").val(),
          'deliv_address': $("input[name=deliv_address]").val(),
          'deliv_address_detail': $("#order_address_detail_input").val(),
          'regularly_code': $("input[name=regularly_code]").val(),
          'request_type': 'check_deliv_price',
        }
        add_regularly_shipping_data = {
          'deliv_name': $("input[name=deliv_name]").val(),
          'deliv_call': $("input[name=deliv_call]").val(),
          'deliv_postcode': $("input[name=deliv_postcode]").val(),
          'deliv_address': $("input[name=deliv_address]").val(),
          'deliv_address_detail': $("#order_address_detail_input").val(),
          'regularly_code': $("input[name=regularly_code]").val(),
          'request_type': 'update',
        }
        add_shipping_data = {
          'shipping_country': 'KR',
          'is_temp': is_temp,
          'is_default': $("input[name=is_default_shipping]:checked").val(),
          'address_data' :{
            'deliv_name': $("input[name=deliv_name]").val(),
            'deliv_call': $("input[name=deliv_call]").val(),
            'deliv_postcode': $("input[name=deliv_postcode]").val(),
            'deliv_address': $("input[name=deliv_address]").val(),
            'deliv_address_detail': $("#order_address_detail_input").val(),
            'deliv_memo': $("#add_deliv_memo").val(),
            'regularly_code': $("input[name=regularly_code]").val(),
            'is_add_shipping': $("input[name=is_add_shipping]:checked").val(),
          }
        }
      }
      JS_DELAY('postDelay',function(){
        axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', check_regularly_shipping_data)
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.msg === 'SUCCESS') {
              update_regularly_address_btn.disabled = false;
              if(res.data.confirm_msg){
                const msg_split = res.data.confirm_msg.split(' ', );
                const variant_text = getLocalizeString('설명_'.concat(msg_split[1].substring(1,2),'요일약자'),'','요일');
                const msg_text = msg_split[0].concat(' (',variant_text,') ',getLocalizeString('설명_주문부터적용됩니다수정하시겠습니까', '', '주문부터 적용됩니다. 수정하시겠습니까?'));
                if(confirm(msg_text)){
                  axios.post('/ajax/regularly/site_update_modify_regularly_address.cm', add_regularly_shipping_data)
                  .then(res =>{
                    if($("input[name=is_add_shipping]:checked").val() === 'Y'){
                      addOrUpdateShippingAddressAjax(add_shipping_data);
                      location.reload();
                    } else {
                      location.reload();
                    }
                  })
                }
              }
            } else {
              alert(res.data.msg);
            }
          } else {
            alert(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err)
        })  
      }).throttling(2000)
    })
  }
  const addRegularlyAddressValidation = () =>{
    const add_regularly_address_form = document.querySelector('#add_regularly_address_form');
    if(add_regularly_address_form){
      const inputData = {
        "name" : document.querySelector('#add_regularly_address-deliv_name-input'),
        "call" : document.querySelector('#add_regularly_address-deliv_call-input'),
        "address" : document.querySelector('#order_address_input'),
        "detail" : document.querySelector('#order_address_detail_input'),
        "button" : document.querySelector('#update_regularly_address_btn'),
      }
      
      const triggerEvent = (event,target,returnArr=[]) =>{
        target.addEventListener(event,()=>{
          returnArr[0] = inputData.name.value;
          returnArr[1] = inputData.call.value;
          returnArr[2] = inputData.address.value;
          returnArr[3] = inputData.detail.value;
          if(returnArr[0] !== "" && returnArr[1] !== "" && returnArr[2] !== ""&& returnArr[3] !== ""){
            inputData.button.disabled = false;
          } else {
            inputData.button.disabled = true;
          }
        })
      }
      let returnArr = [];
      for (let inputDataKey in inputData) {
        triggerEvent('keydown',inputData[inputDataKey],returnArr);
        triggerEvent('click',inputData[inputDataKey],returnArr);
        triggerEvent('change',inputData[inputDataKey],returnArr);
        triggerEvent('blur',inputData[inputDataKey],returnArr);
      }
    }
  }
  const addOrUpdateShippingAddressAjax = (add_shipping_data) =>{
    $.ajax({
      type: "POST",
      url: "/ajax/shipping/add_address.cm",
      data: add_shipping_data,
      dataType: "JSON",
      success: function (res) {
        if(res.msg !== "SUCCESS"){
          alert(res.msg)
        }
      },
      error : function (res){
        alert(res.msg);
        console.log(res);
      },
      complete: function(){
        // location.reload();
      }
    })
  }
  /**
   * usage: SITE_SHOP_MYPAGE.checkAddShippingList()
   * */
  const checkAddShippingList = () =>{
    const add_shipping_list_input = document.querySelector('input[name=is_add_shipping]');
    const is_default_shipping = document.querySelector('._is_default_shipping');
    if(add_shipping_list_input){
      if(add_shipping_list_input.checked){
        is_default_shipping.classList.remove('!tw-hidden');  
      } else {
        is_default_shipping.classList.add('!tw-hidden');
      }
    }
  }
  /**
   * 배송지 목록 관리 탭
   * usage : SITE_SHOP_MYPAGE.disableOtherItems(uid,index);
   * uid : 
   * index
   * */
  const disableOtherItems = (...props) =>{
    const address_list_item_container = document.querySelectorAll('._address_list_item_container');
    const address_list_input = document.querySelectorAll('input[name=address_list]');
    const btn_update_shipping_item = document.querySelectorAll('._btn_update_shipping_item');
    const btn_delete_shipping_item = document.querySelectorAll('._btn_delete_shipping_item');
    const show_more_items_btn = document.querySelector('#show_more_items_btn');
    if(show_more_items_btn){
      show_more_items_btn.disabled = true;
    }
    btn_update_shipping_item.forEach((el,index)=>{
      el.setAttribute('disabled','');
      btn_delete_shipping_item[index].setAttribute('disabled','');
    })
    address_list_item_container.forEach((el,index)=>{
      if(!el.classList.contains(`_list_${props[0]['idx']}`)){
        el.style.opacity = "0.3";
        address_list_input[index].setAttribute('disabled','');
      } else {
        el.removeAttribute('disabled');
        address_list_input[index].removeAttribute('disabled');
      }
    })
  }
  /**
   * usage : SITE_SHOP_MYPAGE.updateShippingAddress(props);
   * 수정완료 버튼을 눌렀을 경우 
   * */
  const updateShippingAddress = (...props)=>{
    const update_shipping_data = {
      'code' : props[0]['code'],
      'shipping_country' : 'KR',
      'is_default' : $("input[name=is_default_shipping]:checked").val(),
      'address_data' : {
        'deliv_name' : $('#deliv_name').val(),
        'deliv_call' : $('#deliv_call').val(),
        'deliv_postcode' : $("input[name=deliv_zipcode]").val(),
        'deliv_address' : $("input[name=deliv_address]").val(),
        'deliv_address_detail' : $('#order_address_detail_input').val(),
        'regularly_code' : $("input[name=regularly_code]").val(),
      }
    }
    JS_DELAY('postDelay',function(){
      addOrUpdateShippingAddressAjax(update_shipping_data);
      SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents({'addOrList' : 'list'});  
    }).throttling(2000);
  } 
  /**
   * usage : SITE_SHOP_MYPAGE.deleteShippingAddress(props);
   * */
  const deleteShippingAddress = (...props) =>{
    // 기본 배송지의 경우
    if(props[0]['is_default']){
      alert(getLocalizeString('설명_기본배송지는삭제할수없습니다','','기본 배송지는 삭제할 수 없습니다.'));
      return;
    }
    // shippinglist가 한개 일 경우
    if(props[0]['list'] === 1){
      alert(getLocalizeString('설명_기본배송지는삭제할수없습니다','','기본 배송지는 삭제할 수 없습니다.'));
      return;
    }
    if(confirm(getLocalizeString('설명_배송지를삭제하시겠습니까','','배송지를 삭제하시겠습니까?'))){
      $.ajax({
        type: "POST",
        url: "/ajax/shipping/delete_address.cm",
        data: props[0],
        dataType: "JSON",
        success: function (res) {
          console.log(res);
        },
        error : function (res){
          console.log(res);
        },
        complete: function(){
          SITE_SHOP_MYPAGE.renderRegularlyAddressModalContents({'addOrList' : 'list'});
        }
      })  
    }
  }
  /**
   * usage : SITE_SHOP_MYPAGE.loadMoreAddressList();
   * */
  const loadMoreAddressList = () =>{
    const show_more_items_btn = document.querySelector('#show_more_items_btn');
    const address_root = document.querySelector('#address_root');
    let click_count = 0;
    if(show_more_items_btn){
      JS_DELAY('click',function(){
        show_more_items_btn.addEventListener('click',()=>{
          click_count ++;
          $.ajax({
            type: "POST",
            url: "/ajax/regularly/get_regularly_address_list.cm",
            data: {'click_count':click_count},
            dataType: "JSON",
            success: function (res) {
              if(res.msg !== "No more List"){
                address_root.innerHTML += res.html;
              }
            },
            error : function (res){
              console.log(res);
            }
          })
          // address 리스트가 마지막인지 확인용
          $.ajax({
            type: "POST",
            url: "/ajax/regularly/get_regularly_address_list.cm",
            data: {'click_count':click_count + 1},
            dataType: "JSON",
            success: function (response) {
              if(response.msg === "No more List"){
                $("#show_more_items_btn").addClass('tw-hidden');
                $("#regularly_address_list_container").addClass('tw-mb-[45px]');
                $("#regularly_address_list_container").removeClass('tw-mb-0');
              } else {
                $("#show_more_items_btn").removeClass('tw-hidden');
                $("#regularly_address_list_container").removeClass('tw-mb-[45px]');
                $("#regularly_address_list_container").addClass('tw-mb-0');
              }
            },
            error : function (res){
              console.log(res);
            }
          })
        })  
      }).throttling(2000);
    }
  }
  return {
    initPointList : function(){
      initPointList();
    },
    initOrderList : function(){
      initOrderList();
    },
    getOrderList : function(type){
      getOrderList(type);
    },
    resizeBtnSize : function(list){
      resizeBtnSize(list);
    },
    getPointList : function(){
      getPointList();
    },
    deleteProdWish : function(prod_code){
      deleteProdWish(prod_code);
    },
    deleteBookingProdWish : function(prod_code){
      deleteBookingProdWish(prod_code);
    },
    'initRegularlyList': function(){
      initRegularlyList();
    },
    'getRegularlyOrderList': function(page){
      getRegularlyOrderList(page);
    },
    'getRegularlyCancelList': function(page){
      getRegularlyCancelList(page)
    },
    'registerRegularlyCard': function(is_update){
      registerRegularlyCard(is_update);
    },
    'deleteRegularlyCard': function(use_regularly_order){
      deleteRegularlyCard(use_regularly_order);
    },
    'changeRegularlyCard': function(){
      changeRegularlyCard();
    },
    'unsetRegularlyAllProd': function(idx){
      unsetRegularlyAllProd(idx);
    },
    'unsetRegularlyProdItem': function(idx, item_code,prod_check_code,item_code_list){
      unsetRegularlyProdItem(idx, item_code,prod_check_code,item_code_list)
    },
    'unsetRegularlyProd': function(type,idx, item_code,prod_check_code,item_code_list){
      unsetRegularlyProd(type,idx, item_code,prod_check_code,item_code_list);
    },
    'showRegularlyDateList': function(regularly_code,is_multiple_prod) {
      showRegularlyDateList(regularly_code,is_multiple_prod);
    },
    'getRegularlyDateList': function(regularly_code, page,is_multiple_prod){
      getRegularlyDateList(regularly_code, page,is_multiple_prod);
    },
    'showRegularlySelectPeriod': function(idx) {
      showRegularlySelectPeriod(idx);
    },
    'skipRegularlyProdAll': function(idx,date_text) {
      skipRegularlyProdAll(idx,date_text);
    },
    'skipRegularlyProdItem': function(idx, item_code,date_text,prod_check_code,item_code_list){
      skipRegularlyProdItem(idx, item_code,date_text,prod_check_code,item_code_list);
    },
    'skipRegularlyProd': function(type,idx, item_code,prod_check_code,item_code_list){
      skipRegularlyProd(type,idx, item_code,prod_check_code,item_code_list);
    },
    'showRegularlyChangeDetail' : function(idx,count,regularly_code,item_code){
      showRegularlyChangeDetail(idx,count,regularly_code,item_code);
    },
    'RegularlyChangeDetail' : function(idx,regularly_code,item_code,change_count){
      RegularlyChangeDetail(idx,regularly_code,item_code,change_count);
    },
    'trackingParcel' : function(code, no){
      trackingParcel(code, no, false);
    },
    'trackingParcelEcpay': function(code){
      trackingParcelEcpay(code);
    },
    'openMobileOrder' : function(no){
      openMobileOrder(no);
    },
    'initCancelOrder': function(order_code, auto_cancel_enable){
      initCancelOrder(order_code, auto_cancel_enable);
    },
    'cancelOrder': function(type){
      cancelOrder(type);
    },
    'returnOrder': function(){
      returnOrder();
    },
    'showExchangeDetail': function(exchange_idx){
      showExchangeDetail(exchange_idx);
    },
    'showReturnDetail': function(return_idx){
      showReturnDetail(return_idx, false);
    },
    'showCancelDetail' : function(cancel_idx){
      showCancelDetail(cancel_idx, false);
    },
    'exchangeOrder': function(){
      exchangeOrder();
    },
    'showSippingAddress':function(shipping_place_code){
      showSippingAddress(shipping_place_code);
    },
    'exchangeOrderPay': function(){
      exchangeOrderPay();
    },
    'withdrawReturnOrder': function(return_idx){
      withdrawReturnOrder(return_idx);
    },
    'withdrawExchangeOrder': function(exchange_idx){
      withdrawExchangeOrder(exchange_idx);
    },
    'withdrawCancelOrder': function(cancel_idx){
      withdrawCancelOrder(cancel_idx, false);
    },
    'cancelOrderSelectAllProdOrder': function(chk){
      cancelOrderSelectAllProdOrder(chk);
    },
    'cancelOrderSelectProdOrder': function(){
      cancelOrderSelectProdOrder();
    },
    'initReturnOrder': function(order_code, auto_cancel_enable){
      initReturnOrder(order_code, auto_cancel_enable);
    },
    'returnOrderSelectAllProdOrder': function(chk){
      returnOrderSelectAllProdOrder(chk);
    },
    'returnOrderSelectProdOrder': function(){
      returnOrderSelectProdOrder();
    },
    'returnOrderLoadRefundPriceData': function(){
      return returnOrderLoadRefundPriceData();
    },
    'changeReturnCollectMethod': function(collect_method){
      changeReturnCollectMethod(collect_method);
    },
    'changeExchangeCollectMethod': function(collect_method){
      changeExchangeCollectMethod(collect_method);
    },
    'initExchangeOrder': function(order_code, auto_cancel_enable){
      initExchangeOrder(order_code, auto_cancel_enable);
    },
    'exchangeOrderSelectAllProdOrder': function(chk){
      exchangeOrderSelectAllProdOrder(chk);
    },
    'requestCashReceipt' : function(order_no, mode){
      requestCashReceipt(order_no, mode);
    },
    'requestCashReceiptProc' : function(q, cash_receipt_type, cash_receipt_value){
      requestCashReceiptProc(q, cash_receipt_type, cash_receipt_value);
    },

    'openChangeOrderAddress': function(q) {
      openChangeOrderAddress(q);
    },
    'changeDelivAddressCountrySelect' : function(q) {
      changeDelivAddressCountrySelect(q);
    },
    "openChangeCVSAddress": function(cvs, order_no){
      openChangeCVSAddress(cvs, order_no);
    },
    "updateCVSAddress": function(data){
      updateCVSAddress(data);
    },
    "digitalFileDownload": function(prod_no, order_idx, is_expired) {
      digitalFileDownloadByProdOrder(prod_no, order_idx, is_expired);
    },
    siteRegularChangeAddressDropDown: function() {
      siteRegularChangeAddressDropDown();
    },
    isDefaultAddress: function() {
      isDefaultAddress();
    },
    setRegularlyAddressMemo: function(...props) {
      setRegularlyAddressMemo(...props);
    },
    changeRegularlyAddressInDropDown: function(...props) {
      changeRegularlyAddressInDropDown(...props);
    },
    showModifyRegularAddressModal: function(...props) {
      showModifyRegularAddressModal(...props);
    },
    renderRegularlyAddressModalContents: function(...props) {
      renderRegularlyAddressModalContents(...props);
    },
    toggleRegularAddressListAddSection: function(...props) {
      toggleRegularAddressListAddSection(...props);
    },
    openUpdateRegularlyAddress: function(...props) {
      openUpdateRegularlyAddress(...props);
    },
    updateRegularlyAddressAjax: function() {
      updateRegularlyAddressAjax();
    },
    disableOtherItems: function(...props) {
      disableOtherItems(...props);
    },
    checkAddShippingList: function() {
      checkAddShippingList();
    },
    updateShippingAddress: function(...props) {
      updateShippingAddress(...props);
    },
    deleteShippingAddress: function(...props) {
      deleteShippingAddress(...props);
    },
    loadMoreAddressList: function() {
      loadMoreAddressList();
    },
    addRegularlyAddressValidation: function() {
      addRegularlyAddressValidation();
    },
    C3_getOrderList : function(type){
        getOrderList(type, true);
    },

    C3_withdrawExchangeOrder: function({orderCode,orderSectionCode,orderSectionItemCode,qty}){
        // 교환요청 철회
		omsWithdrawReturnOrder({orderCode,orderSectionCode,orderSectionItemCode,qty,flag:true});
    },
    C3_withdrawReturnOrder: function({orderCode,orderSectionCode,orderSectionItemCode,qty}){
        // 반품요청 철회
	    omsWithdrawReturnOrder({orderCode,orderSectionCode,orderSectionItemCode,qty});
    },
    C3_withdrawCancelOrder: function({orderCode,orderSectionCode,orderSectionItemCode,qty}){
	  	// 취소요청 철회
	    omsWithdrawCancelOrder({orderCode,orderSectionCode,orderSectionItemCode,qty});
		},
    C3_showExchangeDetail: function(order_no, order_section_no, order_section_item_code){
        // 교환상세
	    omsShowExchangeDetail(order_no, order_section_no, order_section_item_code);
    },
    C3_showReturnDetail: function(order_no, order_section_no, order_section_item_code){
        // 반품상세
        omsShowReturnDetail(order_no, order_section_no, order_section_item_code);
    },
    C3_showCancelDetail : function(order_no, order_section_no, order_section_item_code){
        // 취소상세
		omsShowCancelDetail(order_no, order_section_no, order_section_item_code);
    },
    C3_digitalFileDownload: function(prod_no, order_idx, is_expired) {
        alert('Not implemented yet'); return;
    },
    C3_trackingParcel : function(parcelCompanyIdx,invoiceNo){
	    omsTrackingParcel(parcelCompanyIdx,invoiceNo);
    },
    C3_trackingParcelEcpay: function(code){
        alert('Not implemented yet'); return;
    },
	C3_orderConfirm: function(order_code, order_section_code){
		omsOrderConfirm(order_code, order_section_code);
	}
  }
}();