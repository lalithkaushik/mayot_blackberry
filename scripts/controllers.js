var phonecatControllers = angular.module('phonecatControllers', []);
//var url="http://lalithkaushik.com/mayot_admin_new/services/";
var url="https://mayot.mdx.ac.uk/services/";

//REFRESH TIME IN SECONDS
var refresh_time = 60;

var current_version = '1.4';//14.10.2013

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

phonecatControllers.controller('IndexCtrl', ['$scope',
function($scope) {

	
		var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)==member_id && parseInt(member_id)>0 ){
			window.location = '#/home';	
		}
		else{
			window.location = '#/login';	
		}

}]);


phonecatControllers.controller('LoginCtrl', ['$scope',
function($scope) {
	
	var local_id = window.localStorage.getItem("yid");
    console.log(local_id);
                                             
	if(local_id=="" || local_id=="0" || local_id==null){
		$('#login_wrapper').show();
	}
	else{
		$scope.yp_name=window.localStorage.getItem("yp_name");
		$('#password_wrapper').show();
				
	}
	
		
	
	create_log('1');
	$scope.login = function(){

			var flag=0;
			var email_mobile=$('#email_mobile').val();
			var pwd=$('#pwd').val();
			
			if(email_mobile=='')
			{
				flag=1;
				$('#email_mobile').css('border-color','#F00');
			}
			else
			{
				flag=0;
				$('#email_mobile').css('border-color','#CCC');
			}
			
			if(pwd=='')
			{
				flag=1;
				$('#pwd').css('border-color','#F00');
			}
			else
			{
				flag=0;
				$('#pwd').css('border-color','#CCC');
			}
			
			
			if(flag==1)
			{
				alert("Please enter the highlighted fields");
			}
			else
			{
				$('#validating_div div').html('Validating...');
				
		
				var network = navigator.connection.type;
				network = ""+network;
				if(network=="none"){
					$scope.local_validation(email_mobile, pwd);
				}
				else{
					$scope.server_validation(email_mobile, pwd);
				}
		
			}
	}


	
	$scope.server_validation= function (email_mobile, pwd){
		$.getJSON(url+"verify.php?email_mobile="+email_mobile+"&pwd="+pwd ,function(response){
			var yp_info = response;
			
			if(yp_info.yp_id !="0"){
				
				window.localStorage.setItem("member_id",yp_info.yp_id);
				window.localStorage.setItem("yp_enc",yp_info.yp_enc);
				
			 
				window.localStorage.setItem("un",email_mobile);
				window.localStorage.setItem("ps",pwd);
				window.localStorage.setItem("yid",yp_info.yp_id);
				
				
				window.location="#/sync/home";
				create_log('1.1');
			}
			else{
				$('#validating_div div').html('Login');
				document.login_frm.reset();
				alert("invalid Username/Mobile and Password");
			}
	
		});
	}

	$scope.local_validation = function(email_mobile, pwd){
		var user = window.localStorage.getItem("un");
		var pass = window.localStorage.getItem("ps");
		
		if(user==email_mobile && pwd==pass){
			 var id = window.localStorage.getItem("yid");
			 window.localStorage.setItem("member_id",id);
			 window.location="#/home";
			 create_log('1.2');
		}
		else{
			$('#validating_div div').html('Login');
			document.login_frm.reset();
			alert("invalid Username/Mobile and Password");
		}
		
	}
	
	
	$scope.password_validation = function(){
		var pwd = $('#pwd_only').val();
		var pass = window.localStorage.getItem("ps");
		
		if(pwd==pass){
			 var id = window.localStorage.getItem("yid");
			 window.localStorage.setItem("member_id",id);
			 window.location="#/home";
		}
		else{
			$('#validating_div div').html('Login');
			document.login_frm.reset();
			alert("invalid Password");
		}
		
	}

}]);


phonecatControllers.controller('HomeCtrl', ['$scope',
function($scope) {

		


		var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';	
		}
		create_log('2');
	
}]);   
  		
		
phonecatControllers.controller('AboutCtrl', ['$scope',
function($scope) {
	
	create_log('3');
	var no_type = window.localStorage.getItem("yw_no_type");
	$scope.yp_name=window.localStorage.getItem("yp_name");
	$scope.yw_name=window.localStorage.getItem("yw_name");
	$scope.yw_mobile=window.localStorage.getItem("yw_mobile");
	var mobile = window.localStorage.getItem("yw_mobile");
	
	var button_info = '<a href="tel:'+mobile+'" class="theme_button_half float_left">CALL NOW</a>';
	if(no_type=="1"){
		button_info+='<a href="sms:'+mobile+'" class="theme_button_half float_right">SEND SMS</a>';
	}
	document.getElementById('about_buttons').innerHTML=button_info;
		
	
	if(window.localStorage.getItem("yp_order_start_date")==""){
	
	document.getElementById('progress_holder').style.display="none";
	document.getElementById('case_worker_info').style.display="none";
	}
	
	
	
	
	if(window.localStorage.getItem("yp_order_start_date")!=""){
	var breach = window.localStorage.getItem("yw_breach");
	
	var sdate = window.localStorage.getItem("yp_order_start_date");
	var edate = window.localStorage.getItem("yp_order_end_date");
	var start_date = moment.unix(sdate);
	var end_date = moment.unix(edate);
	
	
	var today = moment.unix(current_unix_timestamp());
	var remind_days = end_date.diff(today, 'days');
	
	var total_days = end_date.diff(start_date, 'days');
	var days_lapsed = today.diff(start_date, 'days');
	var progress = parseInt(days_lapsed)/ parseInt(total_days) 
	progress = Math.ceil(progress*100);
	
	
	
		if(progress>100)
		progress = 100;
		
 		document.getElementById('about_progress_meter').style.width = progress+'%';
		
		if(remind_days>=0){
		document.getElementById('about_remind_days_left').innerHTML=' (Days Left : '+remind_days+')';
		}
		else{
		remind_days = remind_days * -1
		document.getElementById('about_remind_days_left').innerHTML='Order ended '+remind_days+' days before';	
		}
		
		
		$('.'+breach).removeClass('inactive');
	
	}

	


			

}]);


phonecatControllers.controller('InterventionCtrl', ['$scope',
  function ($scope) {
    


		var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			create_log('4');
			var target_details = "";
			$('#targets_holder').html('');
			var activities = window.localStorage.getArray("yp_activities");
			if(activities.length!=0){
				var t=0;
				$.each(activities, function(index, activity) {
					var perc = (activity.progress)*10;
					t++;
					target_details = '<div class="each_target">'
										+'<p><b class="bold_font">Target '+t+':</b> '+activity.description+'</p>'
									+'</div>';
					$('#targets_holder').append(target_details);
				});
			}
			
			
			var important_dates = "";
			$('#list_dates').html('');
			var class_val = '';
			var importants = window.localStorage.getArray("yp_important_dates");
			if(importants.length!=0){
				var d=0;
				$.each(importants, function(index, important) {
					if(important.type){
						d++;
						class_val = 'odd';
						if(d%2==0){
							class_val = 'even';
						}
						
						important_dates = '<div class="everyline '+class_val+'">'
											+'<b class="bold_font">'+moment.unix(important.date).format('dddd, Do MMMM YYYY')+'</b>'
											+'<span class="subtext">'+important.description+'</span>'
										  +'</div>';
						$('#list_dates').append(important_dates);
					}
				});
				
			}
			
			
		}
		
		
		var sdate = window.localStorage.getItem("yp_start_date");
		var edate = window.localStorage.getItem("yp_end_date");
		
					var start_date = moment.unix(sdate);
					var end_date = moment.unix(edate);
					var total_days = end_date.diff(start_date, 'days');
					
					$scope.total_days=total_days;
					$scope.sdate=moment.unix(sdate).format('DD.MM.YYYY');
					$scope.edate=moment.unix(edate).format('DD.MM.YYYY');
					$scope.yp_name=window.localStorage.getItem("yp_name");
					$scope.yw_name=window.localStorage.getItem("yw_name");
					$scope.yw_mobile=window.localStorage.getItem("yw_mobile");
					
					var no_type = window.localStorage.getItem("yw_no_type");
			var mobile = window.localStorage.getItem("yw_mobile");
			var button_info = '<a href="tel:'+mobile+'" class="theme_button_half float_left">CALL NOW</a>';
			if(no_type=="1"){
				button_info+='<a href="sms:'+mobile+'" class="theme_button_half float_right">SEND SMS</a>';
			}
			$scope.button_info;
			
			
			if(window.localStorage.getItem("yp_start_date")==""){
		 document.getElementById('target_holder').style.display="none";
		 document.getElementById('plan_holder').style.display="none";
		 document.getElementById('review_holder').style.display="none";
		 document.getElementById('case_worker_info').style.display="none";
		 
		 document.getElementById('no_info_received').style.display=""; 
	 }
	 
	 if(window.localStorage.getItem("yp_start_date")!=""){
		var today = moment.unix(current_unix_timestamp());
		var days_lapsed = today.diff(start_date, 'days');
		var remind_days = end_date.diff(today, 'days');
		var progress = parseInt(days_lapsed)/ parseInt(total_days) 
		progress = Math.ceil(progress*100);
		
		if(progress>100)
		progress = 100;
 		document.getElementById('progress_meter').style.width = progress+'%';
		
		
		if(remind_days>=0){
		document.getElementById('remind_days_left').innerHTML=' (Days Left : '+remind_days+')';
		}
		else{
		remind_days = remind_days * -1
		document.getElementById('remind_days_left').innerHTML='Order ended '+remind_days+' days before';	
		}
		
		 
		
}
}]);


phonecatControllers.controller('ActivityCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			
			create_log('5');
			var activiy_bar = "";
			$('#activities_content').html('');
			var activities = window.localStorage.getArray("yp_activities");
			var activities_progress = window.localStorage.getArray("yp_activities_progress");
			var act_id = 0;
			var a=0;
			if(activities.length!=0){
				$.each(activities, function(index, activity) {
					var progress;
					var color;
					act_id = activity.activity_id;
					$.each(activities_progress, function(index, activity_detail) {
						if(activity_detail.activity_id==act_id){
							
							progress = activity_detail.progress;
							color = activity_detail.color;
						}
					});
					a++;
					var perc = progress*10;
					
					if(perc>100)
					perc = 100;
					
					activiy_bar = '<div class="everyline">'+
									'<div class="stat">'+
										'<small class="stat-left">'+a+'. '+activity.description+'</small>'+
										'<span class="stat-background">'+
										'<span class="stat-cleaner"></span>'+
										'<span class="percent '+color+'" style="width:'+perc+'%"></span>'+
										'</span>'+
									'</div>'+	
								  '</div>';
					$('#activities_content').append(activiy_bar);
				});
			}
		
		}

			 if(window.localStorage.getItem("yp_start_date")==""){
		 document.getElementById('activities_holder').style.display="none"; 
		 document.getElementById('no_info_received').style.display=""; 
	 }	

}]);


phonecatControllers.controller('CalendarCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			create_log('6');
			$.getJSON(url+"help_exists.php", 'page=ImportantDates' ,function(response){
				var data = response;
				var status = data.status;
				if(status=="1")
				$('#help_button').show();
				else
				$('#help_button').hide();
			});
			
			var important_dates = "";
			$('#list_dates').html('');
			var curTime = current_unix_timestamp();
			var importants = window.localStorage.getArray("yp_important_dates");
			if(importants.length!=0){
				$.each(importants, function(index, important) {
					if(important.date>curTime){
						important_dates = '<div class="box_holder">'+
												'<div class="box_header">'+
												'<span class="important_title">'+moment.unix(important.date).format('dddd, Do MMMM YYYY')+'</span>'+
												'<p>'+moment.unix(important.date).fromNow()+' '+
												'  <br>Time : '+important.time+'</p>'+
												'<p>'+important.description+'</p>'+
												'</div>'+
											'</div>';
						$('#list_dates').append(important_dates);
					}
				});
				
				$.each(importants, function(index, important) {
					if(important.date<curTime){
						important_dates = '<div class="box_holder">'+
												'<div class="box_header">'+
												'<span class="important_title">'+moment.unix(important.date).format('dddd, Do MMMM YYYY')+'</span>'+
												'<p>'+moment.unix(important.date).fromNow()+' '+
												'  <br>Time : '+important.time+'</p>'+
												'<p>'+important.description+'</p>'+
												'</div>'+
											'</div>';
						$('#list_dates_past').prepend(important_dates);
					}
				});
				
			}
			
		}
		
		if(window.localStorage.getItem("yp_start_date")==""){
		 document.getElementById('no_info_received').style.display=""; 
	 }
}]);


phonecatControllers.controller('ExclusionCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
	if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
		window.location = '#/index';}
	else{
		
	}
	create_log('7');
	
	var str = window.localStorage.getItem("yp_map_data");
	str = replaceAllBackSlash(str);
	var string = str.substr(1);
	string = string.substr(0,string.length-1);
	
	document.getElementById('mapDataExclusion').value=string;

	if(string!=""){
		BlitzMap.setMap('myMapExclusion', true, 'mapDataExclusion');
		BlitzMap.init();
	}
	else{
		document.getElementById('myMapExclusion').style.display="none";
		document.getElementById('no_info_received').style.display=""; 
	}
	
	
	var curfew = window.localStorage.getArray("yp_curfew_zone");
	
	if(curfew.length>0){
		var curfewtime = curfew[0].starttime;
		curfewtime = curfewtime.substr(0,5);
		document.getElementById('starttime').innerHTML=''+curfewtime;
	}
	else{
	document.getElementById('map_cover').style.display="none";
	document.getElementById('no_curfew_zone').style.display="";
	}
}]);


phonecatControllers.controller('UsefulCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			create_log('8');
			var useful = "";
			$('#list_info').html('');
			var useful_infos = window.localStorage.getArray("yp_useful_info");
			if(useful_infos.length!=0){
				$.each(useful_infos, function(index, useful_info) {
					useful = '<div class="box_holder">'+
								'<div class="box_header">'+
								'<a href="#/useful_info_details/'+useful_info.resource_id+'"><span class="important_title">'+useful_info.description+'</span></a>'+
								'</div>'+
							'</div>';
					$('#list_info').append(useful);
				});
				
			}
		}
}]);

phonecatControllers.controller('UsefuldetailsCtrl', ['$scope','$routeParams',
function($scope, $routeParams) {
			create_log('8.1');
			var useful = "";
			$('#list_info_details').html('');
			var resource_id = $routeParams.param1;
			var useful_infos = window.localStorage.getArray("yp_useful_info");
			if(useful_infos.length!=0){
				$.each(useful_infos, function(index, useful_info) {
					
					if(useful_info.resource_id==resource_id)
					{
						useful = '<div class="box_holder">'+
									'<div class="box_header">'+
									'<span class="important_title">'+useful_info.description+'</span>'+
									'<p>'+useful_info.desc+'</p>'+
									'</div>'+
								'</div>';
						$('#list_info_details').append(useful);
						return;
					}
				});
				
			}
	
}]);


phonecatControllers.controller('SettingsCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			
		
		}
	create_log('9');
	/*var settings =window.localStorage.getItem("yw_settings");
	if(settings=="0" || settings==""){

		document.getElementById('setting_btn').checked=true;
	}
	else{

		document.getElementById('setting_btn').checked=false;
	}*/
	
	var exclusion_settings =window.localStorage.getItem("yw_exclusion_settings");
	if(exclusion_settings=="0" || exclusion_settings==""){
		document.getElementById('exclusion_zone').checked=true;
		$('#exclusion_zone_vibrate').show();
	}
	else{
		document.getElementById('exclusion_zone').checked=false;
		$('#exclusion_zone_vibrate').hide();
	}
	
	
	var curfew_settings =window.localStorage.getItem("yw_curfew_settings");
	if(curfew_settings=="0" || curfew_settings==""){
		document.getElementById('curfew_zone').checked=true;
		$('#curfew_zone_vibrate').show();
	}
	else{
		document.getElementById('curfew_zone').checked=false;
		$('#curfew_zone_vibrate').hide();
	}
	
	
	var exclusion_vibrate_settings =window.localStorage.getItem("yw_exclusion_vibrate");
	if(exclusion_vibrate_settings=="0" || exclusion_vibrate_settings==""){
		document.getElementById('setting_exclusion_btn').checked=true;
	}
	else{
		document.getElementById('setting_exclusion_btn').checked=false;
	}
	
	
	var curfew_vibrate_settings =window.localStorage.getItem("yw_curfew_vibrate");
	if(curfew_vibrate_settings=="0" || curfew_vibrate_settings==""){
		document.getElementById('setting_curfew_btn').checked=true;
	}
	else{
		document.getElementById('setting_curfew_btn').checked=false;
	}
	
	Custom.init();
}]);


phonecatControllers.controller('ContactCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';}
		else{
			create_log('10');
			$.getJSON(url+"help_exists.php", 'page=Contact' ,function(response){
				var data = response;
				var status = data.status;
				if(status=="1")
				$('#help_button').show();
				else
				$('#help_button').hide();
			});
			
			var contacts = "";
			var details ;
			var info_type ;
			$('#contact_list_info').html('');
			var contact_infos = window.localStorage.getArray("yp_contact_info");
			
			if(contact_infos.length>0){
				$.each(contact_infos, function(index, contact_info) {
					contacts = '<div class="box_holder">'+
								'<div class="box_header"><span class="important_title">'+contact_info.person+'</span></div>'+
								'<div class="box_content">';
								
							details = contact_info.details;
							$.each(details, function(index, detail) {
								if(detail.type=="1")
								info_type = '<a href="tel:'+detail.information+'" class="theme_button_phone">CALL</a>&nbsp;<a href="sms:'+detail.information+'" class="theme_button_phone">SMS</a>';
								else if(detail.type=="2")
								info_type = '<a href="tel:'+detail.information+'" class="theme_button_phone">CALL</a>';
								else if(detail.type=="3")
								info_type = '<a href="mailto:'+detail.information+'" class="theme_button_phone">EMAIL</a>';
								
								contacts+='<div class="everyline_contact"><span class="float_left">'+info_type+'</span></div>';
							});
					
					contacts+='</div>'+
							'</div>';
					$('#contact_list_info').append(contacts);
				});
				
			}
			
		}
		
		var contacts = window.localStorage.getItem("yp_contact_info");
	 if(contacts.length<=2){
		 document.getElementById('contact_list_info').innerHTML="No contacts found";
	 }
}]);


phonecatControllers.controller('QuizCtrl', ['$scope',
function($scope) {
	
	var member_id = window.localStorage.getItem("member_id");
	if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
		window.location = '#/index';}
	else{
		create_log('11');
		$.getJSON(url+"help_exists.php", 'page=Quizzes' ,function(response){
				var data = response;
				var status = data.status;
				if(status=="1")
				$('#help_button').show();
				else
				$('#help_button').hide();
		});
			
	
			var quizzes = window.localStorage.getItem("quizzes");
			if(quizzes.length<=2){
				quizzes.getElementById('quizzes_topic_list_info').innerHTML="No quizzes found";
			}
			else{
				//show_quiz(0);
				
				var topics = "";
				$('#quizzes_topic_list_info').html('');
				var quizzes = window.localStorage.getArray("quizzes");
				if(quizzes.length!=0){
					$.each(quizzes, function(index, quiz) {
						topics = '<a href="#/quiztopic/'+index+'" style="text-decoration:none"><div class="box_holder">'+
									'<div class="box_header">'+
									'<span class="important_title">'+quiz.topic+'</span>'+
									'</div>'+
								'</div></a>';
						$('#quizzes_topic_list_info').append(topics);
					});
					
				}
			}
	}
}]);

phonecatControllers.controller('QuizTopicCtrl', ['$scope','$routeParams',
function($scope, $routeParams) {



		var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';	
		}
		create_log('11.1');
		var no = $routeParams.param1;
		var quizzes = window.localStorage.getArray("quizzes")[no];
		$('#quiz_topic').html(quizzes.topic);
		show_quiz(0, no);
}]);

  

phonecatControllers.controller('HelpCtrl', ['$scope','$routeParams',
function($scope, $routeParams) {
			var page = $routeParams.param1;
			$.getJSON(url+"help_content.php", 'page='+page ,function(response){
			var data = response;
			var content = data.content;
			$('#list_info').html(content);
			create_log('12');
	});
	
}]);


phonecatControllers.controller('SyncCtrl', ['$scope','$routeParams',
function($scope, $routeParams) {



		var member_id = window.localStorage.getItem("member_id");
		if(parseInt(member_id)!= member_id || parseInt(member_id)==0 || member_id ==""){
			window.location = '#/index';	
		}
		var page = $routeParams.param1;

		sync(page);
		create_log('13');
}]); 
