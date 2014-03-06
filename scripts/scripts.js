document.addEventListener("resume", onResume, false);

function onResume() {
	console.log(window.location);
    logout();
}

function logout(){
	window.localStorage.setItem("member_id","");
	window.location="#/login";	
}

function toggle_setting_zone(obj){
	var val = obj.checked;
	if(val==true){
		window.localStorage.setItem("yw_settings","0");
	}
	else{
		window.localStorage.setItem("yw_settings","1");
	}
}

function show_exclusion_vibrate_option(obj){
	var val = obj.checked;
	if(val==true){
		$('#exclusion_zone_vibrate').slideDown();
		window.localStorage.setItem("yw_exclusion_settings","0");
	}
	else{
		$('#exclusion_zone_vibrate').slideUp();
		window.localStorage.setItem("yw_exclusion_settings","1");
	}
}

function show_curfew_vibrate_option(obj){
	var val = obj.checked;
	if(val==true){
		$('#curfew_zone_vibrate').slideDown();
		window.localStorage.setItem("yw_curfew_settings","0");
	}
	else{
		$('#curfew_zone_vibrate').slideUp();
		window.localStorage.setItem("yw_curfew_settings","1");
	}
}
function toggle_exclusion_zone(obj){
	var val = obj.checked;
	if(val==true){
		window.localStorage.setItem("yw_exclusion_vibrate","0");
	}
	else{
		window.localStorage.setItem("yw_exclusion_vibrate","1");
	}
}


function toggle_curfew_zone(obj){
	var val = obj.checked;
	if(val==true){
		window.localStorage.setItem("yw_curfew_vibrate","0");
	}
	else{
		window.localStorage.setItem("yw_curfew_vibrate","1");
	}
}

function current_unix_timestamp(){
	var ts = Math.round((new Date()).getTime() / 1000);
	return ts;
}

function replaceAllBackSlash(targetStr){
      var index=targetStr.indexOf("\\");
      while(index >= 0){
          targetStr=targetStr.replace("\\","");
          index=targetStr.indexOf("\\");
      }
      return targetStr;
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
//var log_arr = window.localStorage.getArray("log");
function create_log(page){
	var t = current_unix_timestamp();
	console.log(page);
	//log_arr.push(page, t);
	//window.localStorage.getArray("log") = log_arr;
}

function notification_show(){
	 navigator.notification.alert(
            'You are in exclusion zone',  // message
            alertDismissed,         // callback
            'MAYOT Alert',            // title
            'OK'                  // buttonName
        );

}

function alertDismissed() {
            // do something
}





function notify_geoloc(){
navigator.geolocation.getCurrentPosition(alertgeo, onError, {enableHighAccuracy: true});
}

function alertgeo(position){
	//alert("My GEO LOC :"+position);
	window.plugins.statusBarNotification.notify("Test", "This is a test notification");
	navigator.notification.beep(2);
	//navigator.notification.vibrate(1000);
}



function review_cooridinates(){
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
	
}

function onSuccess(position) {
	var phoneName =  device.name+','+device.platform+','+device.version;
	var cooridinates = position.coords.latitude+","+position.coords.longitude;
	
	var exclusion_settings =window.localStorage.getItem("yw_exclusion_settings");
	var curfew_settings =window.localStorage.getItem("yw_curfew_settings");
	
	if(exclusion_settings=="0"){
		find_breach(position.coords.latitude,position.coords.longitude);
	}
	
	if(curfew_settings=="0"){
		//find_curfew(position.coords.latitude,position.coords.longitude);
	}
	
	var chk_url = url+'push_details.php?cooridinates='+cooridinates+'&device='+escape(phoneName)+'&page=APP';
	$('#show_post').load(chk_url);
}

function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

function find_breach(x,y){	

	var fetched = window.localStorage.getArray("yp_exclusion_zones");

	var breach_flag = 0;

	
		for(var each=0;each<fetched.length-1;each++){
			var current_boundaries = fetched[each];
			if(current_boundaries != ""){
			gdata = current_boundaries.split(","); 

			var X_lat='';
			var Y_lng='';
					
			for(i=0;i <= gdata.length-1; ++i){
				if(i%2 !=0)	{	
					
					if(Y_lng==''){
						Y_lng=gdata[i];
					}
					else{
						Y_lng+=','+gdata[i];
					}		
				}
				else{
					if(X_lat==''){
						X_lat=gdata[i];
					}
					else{
						X_lat+=','+gdata[i];
					}	
				}
				 
			}
		}
		
		
				X_lat_split_data = X_lat.split(",");
				Y_lng_split_data = Y_lng.split(",");
				
				
				
				var polySides  = X_lat_split_data.length;
				var polyY = new Array();
				var polyX = new Array();
				
				for(var arrayindex = 0;arrayindex<polySides;arrayindex++){
				polyX[arrayindex] = parseFloat(X_lat_split_data[arrayindex]);
				polyY[arrayindex] = parseFloat(Y_lng_split_data[arrayindex]);
				}
				
				
				var j = polySides-1 ;
				var oddNodes = 0;
				for (i=0; i<polySides; i++){
				if (polyY[i]<y && polyY[j]>=y  ||  polyY[j]<y && polyY[i]>=y){
				if (polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x){
				oddNodes=!oddNodes;
				}
				}
				j=i;
				}
				
				
				if(oddNodes){
				breach_flag = 1;
				
				}
				
				
		
		
		}

		if(breach_flag ==1){
			var coordinates = x+','+y;
			barnotification(coordinates);
		}
		else{
			//window.plugins.statusBarNotification.clear();
		}
	
}

function find_curfew(x,y){	
	
	
	var obj = window.localStorage.getArray("yp_curfew_zone");
	 
	var breach_flag = 0;
	
	if(obj.length>0){
	var curfewtime = obj[0].starttime;
	var time = moment();

	var a = moment(curfewtime, "HH:mm");
	var b = moment(time, "HH:mm");
	
	var c = a.diff(b, 'seconds');
	
	if(c<0){
		var current_boundaries = obj[0].coordinates;
	
		if(current_boundaries.length>2){
			gdata = current_boundaries.split(","); 
		
			var X_lat='';
			var Y_lng='';
					
			for(i=0;i <= gdata.length-1; ++i){
				if(i%2 !=0)	{	
					
					if(Y_lng==''){
						Y_lng=gdata[i];
					}
					else{
						Y_lng+=','+gdata[i];
					}		
				}
				else{
					if(X_lat==''){
						X_lat=gdata[i];
					}
					else{
						X_lat+=','+gdata[i];
					}	
				}
			}
		}
		
		
		X_lat_split_data = X_lat.split(",");
		Y_lng_split_data = Y_lng.split(",");
		
		
		
		var polySides  = X_lat_split_data.length;
		var polyY = new Array();
		var polyX = new Array();
		
		for(var arrayindex = 0;arrayindex<polySides;arrayindex++){
			polyX[arrayindex] = parseFloat(X_lat_split_data[arrayindex]);
			polyY[arrayindex] = parseFloat(Y_lng_split_data[arrayindex]);
		}
		
		
		var j = polySides-1 ;
		var oddNodes = 0;
		for (i=0; i<polySides; i++){
			if (polyY[i]<y && polyY[j]>=y  ||  polyY[j]<y && polyY[i]>=y){
				if (polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x){
					oddNodes=!oddNodes;
				}
			}
			j=i;
		}
		
		
		if(oddNodes){
			breach_flag = 1;
		}


		if(breach_flag==1){
			//window.plugins.statusBarNotification.clear();
		}
		else{
			var coordinates = x+','+y;
			curfew_notification(coordinates);
		}
	}
	}
}

function barnotification(coordinates){

	window.plugins.statusBarNotification.notify("Exclusion", "You are in exclusion zone");
	navigator.notification.vibrate(1000);
	
	var settings =window.localStorage.getItem("yw_exclusion_vibrate");;
	if(settings=="1"){
		navigator.notification.beep(1);
	}
	
	var member_id = window.localStorage.getItem("member_id");
	var enc_val = window.localStorage.getItem("yp_enc");
	var url1 = url+'breach.php?cooridinates='+coordinates+'&member='+member_id+'&type=1&enc_val='+enc_val;
	$('#show_post').load(url1);
	
}

function curfew_notification(coordinates){

	window.plugins.statusBarNotification.notify("Curfew", "Time to go home");
	navigator.notification.vibrate(1000);
	
	var settings =window.localStorage.getItem("yw_curfew_vibrate");;
	if(settings=="1"){
		navigator.notification.beep(1);
	}
	
	var member_id = window.localStorage.getItem("member_id");
	var enc_val = window.localStorage.getItem("yp_enc");
	var url1 = url+'breach.php?cooridinates='+coordinates+'&member='+member_id+'&type=2&enc_val='+enc_val;
	$('#show_post').load(url1);
	
}

function show_quiz(no, topic){

			var quiz = "";
			var arr = window.localStorage.getArray("quizzes")[topic];
			
			var total =arr.questions.length ;
			var answer ;
			$('#quizzes_list_info').html('');

			if(no<total){
			
			var quizzes = arr.questions;
			quizzes = quizzes[no];
			quiz = '<div class="box_holder">'+
						'<div class="box_header"><span class="important_title">'+quizzes.quiz+'</span></div>'+
						'<div class="box_content" id="show_details">';
						
					
			quiz+= '<a href="javascript:;" class="theme_button_phone" onclick="get_answer(\'true\','+topic+','+no+')">True</a>&nbsp;&nbsp;<a href="javascript:;" class="theme_button_phone" onclick="get_answer(\'false\','+topic+','+no+')">False</a>';
						
						
						
		
			
			quiz+='</div>'+
					'</div>';
			}
			else{
				quiz = '<div class="box_holder">'+
						'<div class="box_header"><span class="important_title">Questions over</span></div>'+

					'</div>';
			}
					$('#quizzes_list_info').html(quiz);
			
}

function get_answer(ans, topic, no){
	var arr = window.localStorage.getArray("quizzes")[topic];
	var total =arr.questions.length ;
	var quizzes = arr.questions[no];
	var answer = quizzes.quiz_answer;
	var desc = quizzes.quiz_description;
	if(answer==ans){
		var image = '<img src="images/icons/correct.png" width="20">';
	}
	else{
		var image = '<img src="images/icons/wrong.png" width="20">';
	}
	no = no+1;
	var html = '<p>'+image+'<b style="font-size:20px;">&nbsp;&nbsp;It\'s '+answer+'</b></p><p>'+desc+'</p>';
	
	if(total!=no){
		html+='<span class="float_right"><a href="javascript:;" class="theme_button_phone" onclick="show_quiz('+no+', '+topic+')">Next question</a></span><div class="clear"></div>';
	}
	$('#show_details').html(html);
}