var alerts_shown = new Object();
function call_script(){
	var time_interval = refresh_time*1000; //CONVERTING TO MILLISECONDS
	

	//ONLY IF LOGGED IN
	var member_id = window.localStorage.getItem("member_id");
	if(member_id!="0" && member_id!=""){
		setTimeout('call_script()',60000);
	}
	
		//INITIALISING AN EMPTY ALERT SHOWN ARRAY
		alerts_shown = window.localStorage.getItem("alert_shown");
		if(alerts_shown==null || alerts_shown==""){

			var valueToPush = new Array();
			valueToPush["text"] = "";
			valueToPush["time"] = "";

			window.localStorage.setArray("alert_shown", valueToPush);
		}
	
	//EXCLUSION ZONE & CURFEW ALERTS
	var exclusion_settings 	=	window.localStorage.getItem("yw_exclusion_settings");
	var curfew_settings 	=	window.localStorage.getItem("yw_curfew_settings");
	if(exclusion_settings== "0" || curfew_settings == "0" ){
		review_cooridinates(); // GEO CORDINATES ARE CAPTURED ONLY IF EXCLUSION ZONE ALERTS OR CURFEW ALERTS ARE OPTED FOR
	}
	//IMPORTANTS DATE REMINDER ALERTS
	remind_review();
	
	
	//SYNC FOR EVERY ONE MINUTES EXCLUSION, CURFEW, IMPORTANT DATES
	regular_sync();
}



function regular_sync(){
	var member_id = window.localStorage.getItem("member_id");
	var enc_val 			= 	window.localStorage.getItem("yp_enc");
	$.getJSON(url+"regular_sync.php", 'member_id='+member_id+'&enc_val='+enc_val,function(response){
		if(response!=""){
			var data = response;
			var excluded_zones = data.exclusion_zones;
			 var split_excluded_coordinates = excluded_zones.split('/');
			 window.localStorage.setArray("yp_map_data", data.map_data);
			 window.localStorage.setArray("yp_curfew_map_data", data.curfew_map_data);
			 window.localStorage.setArray("yp_exclusion_zones", split_excluded_coordinates);	window.localStorage.setItem("yp_exclusion_zones_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_curfew_zone", data.curfew_zone);					window.localStorage.setItem("yp_curfew_zone_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_important_dates", data.important_dates);			window.localStorage.setItem("yp_important_dates_sync",current_unix_timestamp());
			 window.localStorage.setItem("yw_breach",data.yw_breach);
			 
			 
			 	
		}
	});
}


function sync(page){
	
	$('#force_sync_btn div').html('Syncing..Pls wait');
	
	var settings 			=	window.localStorage.getItem("yw_settings");
	var exclusion_settings 	=	window.localStorage.getItem("yw_exclusion_settings");
	var curfew_settings 	=	window.localStorage.getItem("yw_curfew_settings");
	var member_id 			= 	window.localStorage.getItem("member_id");
	var enc_val 			= 	window.localStorage.getItem("yp_enc");
	var data 				= 	'member_id='+member_id+'&enc_val='+enc_val+'&settings='+settings+'&exclusion_settings='+exclusion_settings+'&curfew_settings='+curfew_settings;
	
	$.getJSON(url+"sync.php", data ,function(response){
		if(response!=""){
			var data = response;
			var excluded_zones = data.exclusion_zones;
			 var split_excluded_coordinates = excluded_zones.split('/');
			 window.localStorage.setArray("yp_map_data", data.map_data);
			 window.localStorage.setArray("yp_curfew_map_data", data.curfew_map_data);
			 window.localStorage.setArray("yp_exclusion_zones", split_excluded_coordinates);	window.localStorage.setItem("yp_exclusion_zones_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_curfew_zone", data.curfew_zone);					window.localStorage.setItem("yp_curfew_zone_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_activities", data.activities);					window.localStorage.setItem("yp_activities_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_activities_progress", data.activities_progress);	window.localStorage.setItem("yp_activities_progress_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_important_dates", data.important_dates);			window.localStorage.setItem("yp_important_dates_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_useful_info", data.useful_info);					window.localStorage.setItem("yp_useful_info_sync",current_unix_timestamp());
			 window.localStorage.setArray("yp_contact_info", data.contact_info);				window.localStorage.setItem("yp_contact_info_sync",current_unix_timestamp());
			 window.localStorage.setItem("yw_breach",data.yw_breach);
			 window.localStorage.setArray("quizzes", data.quizzes);
			 
			 	window.localStorage.setItem("yp_name",data.yp_name);
				window.localStorage.setItem("yp_email",data.yp_email);
				window.localStorage.setItem("yp_mobile",data.yp_mobile);
				window.localStorage.setItem("yp_dob",data.yp_dob);
				window.localStorage.setItem("yot_id",data.yot_id);
				
				window.localStorage.setItem("yp_order_start_date",data.order_start_date);
				window.localStorage.setItem("yp_order_end_date",data.order_end_date);
				
				window.localStorage.setItem("yp_start_date",data.yp_start_date);
				window.localStorage.setItem("yp_end_date",data.yp_end_date);
				
				window.localStorage.setItem("yw_name",data.yw_name);
				window.localStorage.setItem("yw_mobile",data.yw_mobile);
				window.localStorage.setItem("yw_no_type",data.yw_no_type);
				
				window.localStorage.setItem("yw_settings",data.yw_settings);
				window.localStorage.setItem("yw_exclusion_settings",data.yw_exclusion_settings);
				window.localStorage.setItem("yw_curfew_settings",data.yw_curfew_settings);
				
				
				window.localStorage.setItem("yp_profile_sync",current_unix_timestamp());
			 
			
			 if(page=="home"){
				window.location="#/"+page;
			}
              $('#force_sync_btn div').html('Refresh');
		}
	});
}


function remind_review(){
	var reviews = window.localStorage.getArray("yp_important_dates");
	var hours ;
	var text ;
	var a;
	var b;
	var t;

	if(reviews.length!=0){
		$.each(reviews, function(index, review) {
			t = current_unix_timestamp();
			
			a = moment.unix(review.date);
			b = moment.unix(t);
			hours = a.diff(b, 'hours');
			
			if(hours>0 && hours<=24){
				
				text = "Reminder : "+review.description+' '+moment.unix(review.date).format('dddd, Do MMMM @ hh:mm a');
				show_reminder_reviews(text);

			}
			
		});

	}
	
	
	var obj = window.localStorage.getArray("yp_curfew_zone");	
	if(obj.length>0){
		var curfewtime = obj[0].starttime;
		var time = moment().format('HH:mm:00');
	
		var a = moment(curfewtime, "HH:mm");
		var b = moment(time, "HH:mm");
		
		var c = a.diff(b, 'seconds');
		if(c<1800 && c>0){
			text = 'Curfew :  Curfew starts @ '+curfewtime;
			show_reminder_reviews(text);
		}
	}
}




function show_reminder_reviews(text){
	


	if(alert_displayed_before(text)>=24 || alert_displayed_before(text)==0){
		window.plugins.statusBarNotification.notify("Mayot", text);
		navigator.notification.beep(2);
		navigator.notification.vibrate(1000);
		alerts_shown = window.localStorage.getArray("alert_shown");
		
		
		var valueToPush = new Object();
		valueToPush["text"] = text;
		valueToPush["time"] = current_unix_timestamp();
		alert(valueToPush);
		alerts_shown.push(valueToPush);
		window.localStorage.setArray("alert_shown", alerts_shown);
	}
		
		
}

function alert_displayed_before(text){
	var alerts_shown = window.localStorage.getArray("alert_shown");
	var reminds = alerts_shown;
	var duration = 0;
	var a;
	var b;
	var d;
	var t = current_unix_timestamp();
	if(alerts_shown!=null){
		if(alerts_shown.length!=0){
			$.each(reminds, function(index, remind) {
				console.log('duration check '+remind.text);
				if(remind.text==text){
					console.log('duration check find '+remind.time+' - '+t);
					a = moment.unix(remind.time);
					b = moment.unix(t);
					d = b.diff(a, 'hours', true);
					console.log('duration value '+d);
					duration = d;
				}
			});
		}
	}
	console.log('duration '+duration);
	return duration;
}

