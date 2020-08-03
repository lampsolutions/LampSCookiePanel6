

if( document.readyState !== 'loading' ) {
    lampCookieInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        lampCookieInitCode();
    });
}

function lampCookieOpen(){
    //timeout, so the user can see the page before he get the nice cookie panel
    setTimeout(function () {
        var lampCookiePanel = document.querySelectorAll('[data-lamp-cookie-panel]')[0];
        lampCookiePanel.classList.toggle('active');
    },200);

}

function lampCookieInitCode(){

    var lampCookieGroups = JSON.parse(document.getElementById('lamp-cookie-consent').innerHTML);

    var lampCookieEnableCookieGrp = function (groupKey){
        if(lampCookieGroups[groupKey] !== undefined){
            for (var key in lampCookieGroups[groupKey]) {
                // skip loop if the property is from prototype
                if (!lampCookieGroups[groupKey].hasOwnProperty(key)) continue;
                var obj = lampCookieGroups[groupKey][key];

                //set the cookie html
                for (var prop in obj) {
                    // skip loop if the property is from prototype
                    if (!obj.hasOwnProperty(prop)) continue;

                    if(Array.isArray(obj[prop])){
                        var content = '';
                        //get the html content
                        obj[prop].forEach(function (htmlContent) {
                            content += htmlContent
                        });
                        var range = document.createRange();
                        if(prop === 'header'){
                            // add the html to header
                            range.selectNode(document.getElementsByTagName('head')[0]);
                            var documentFragHead = range.createContextualFragment(content);
                            document.getElementsByTagName('head')[0].appendChild(documentFragHead);
                        }else{
                            //add the html to body
                            range.selectNode(document.getElementsByTagName('body')[0]);
                            var documentFragBody = range.createContextualFragment(content);
                            document.getElementsByTagName('body')[0].appendChild(documentFragBody);
                        }
                    }
                }
            }
            //remove the group so we don't set it again
            delete lampCookieGroups[groupKey];
        }
    };


    //activates the groups
    var lampCookieSaveAction = function() {
        action = this.getAttribute('data-lamp-cookie-panel-save');
        var checkboxes = document.querySelectorAll('[data-lamp-cookie-panel-grp]');
        var i;
        var cookie = '';
        switch (action) {
            case 'all':
                for (i = 0; i < checkboxes.length; i++) {
                    lampCookieEnableCookieGrp(checkboxes[i].value);
                    cookie += checkboxes[i].value + '.1,';
                    checkboxes[i].checked = true;
                }
                break;
            case 'save':
                for (i = 0; i < checkboxes.length; i++) {
                    if(checkboxes[i].checked === true){
                        lampCookieEnableCookieGrp(checkboxes[i].value);
                        cookie += checkboxes[i].value + '.1,';
                    }else{
                        cookie += checkboxes[i].value + '.0,';
                    }
                }
                break;
            case 'min':
                break;
        }
        cookie += 'dismiss';
        lampCookieUtility.setCookie('lampCookieConsent',cookie,364);


        setTimeout(function () {
            document.querySelectorAll('[data-lamp-cookie-panel]')[0].classList.toggle('active');
        },350)

    };


    var lampCookieUtility = {
        getCookie: function(name) {
            var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        },
        setCookie: function(name, value, days) {
            var d = new Date;
            d.setTime(d.getTime() + 24*60*60*1000*days);
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        },
        deleteCookie: function(name){ setCookie(name, '', -1); }
    };

    $('.individuell').on( 'click', function () {

        $(".om-cookie-panel.active").css("max-height","unset");
        $( ".cookie-details" ).show().animate({
            height: "100%"
        }, "slow" );
        $( "#cookie-hint-main" ).hide().animate({
            height: "0%"
        }, "slow" );
    });

    $('#coockie-button-back').on( 'click', function () {
        $( ".cookie-details" ).hide().animate({
            height: "0%"
        }, "slow" );
        $( "#cookie-hint-main" ).show().animate({
            height: "100%"
        }, "slow" );
    });
    $('.cookie-center').on( 'click', function (e) {
        $(this).next('.cookie-details-row').toggle();
        e.preventDefault();
    });


    var panelButtons = document.querySelectorAll('[data-lamp-cookie-panel-save]');
    var openButtons = document.querySelectorAll('[data-lamp-cookie-panel-show]');
    var i;
    var lampCookiePanel = document.querySelectorAll('[data-lamp-cookie-panel]')[0];

    if(lampCookiePanel === undefined) return;
    var openCookiePanel = true;


    var cookieConsentData = lampCookieUtility.getCookie('lampCookieConsent');

    if(cookieConsentData !== null && cookieConsentData.length > 0){
        //dont open the panel if we have the cookie
        openCookiePanel = false;
        var checkboxes = document.querySelectorAll('[data-lamp-cookie-panel-grp]');
        var cookieConsentGrps = cookieConsentData.split(',');
        var cookieConsentActiveGrps = '';

        for(i = 0; i < cookieConsentGrps.length; i++){
            if(cookieConsentGrps[i] !== 'dismiss'){
                var grpSettings = cookieConsentGrps[i].split('.');
                if(parseInt(grpSettings[1]) === 1){
                    lampCookieEnableCookieGrp(grpSettings[0]);
                }
            }
        }
    }

    var url = window.location.href;
    var arr = url.split("/");
    if(arr[3]==(lampCookieGroups.config.about_link).replace(/^\/+/, '') || arr[3]==(lampCookieGroups.config.privacy_link).replace(/^\/+/, '')){
        openCookiePanel=false;
        if(lampCookieGroups.config.show_impressum=="1"){
            openCookiePanel=true;
        }
    }

    if(openCookiePanel === true){
        //timeout, so the user can see the page before he get the nice cookie panel
        setTimeout(function () {
            lampCookiePanel.classList.toggle('active');
        },1000);
    }

    //check for button click
    for (i = 0; i < panelButtons.length; i++) {
        panelButtons[i].addEventListener('click', lampCookieSaveAction, false);
    }
    for (i = 0; i < openButtons.length; i++) {
        openButtons[i].addEventListener('click', function () {
            lampCookiePanel.classList.toggle('active');
        }, false);
    }

}





