
$(document).ready(function () {
    //Caching DOM elements
    var $rightMenu = $('#settings'),
        $rightButton = $('#btn-right'),
        $weatherMenu = $('#weather-menu'),
        $Main = $('#main'),
        $Info = $('#info-msg'),
        $InfoMsgBx = $('#info-msg .msg-box'),
        $tempDiv = $('#temp-div');

    var settingsList = $('#settings ul li, .search-container'),
        info = {
            "Loading": [
                "検索しています...", "ロード完了!"
            ]
        };
    //End Caching DOM elements
    var currentSlide = 0,
        currentSlideX = [0, 358, 718],
        $dotmenu = $('#dotmenu span');
    var temp_location,
        LoadedData;

    function WeatherIcon(d) {
        var icon = "wi ";
        switch (d) {
            case '晴れ': icon += 'wi-day-sunny'; break;
            case '曇り': icon += 'wi-cloudy'; break;
            case '雨': icon += 'wi-rain-mix'; break;
            case '雪': icon += 'wi-day-snow'; break;

            default: icon += 'wi-na';
        }
        return icon;
    }

    function SetColor(c_name) {
        //green turqoise blue purple
        $Main.removeAttr('class').addClass(c_name);
        //$('body').removeAttr('class').addClass(c_name);
    }

    function ApplyData(d) {
        // Location
        var $locspan = $('#location span'),
            $ctbicon = $('#ctbicon'),
            $ctb = $('#ctb'),
            $icontempi = $('#icon-temp i'),
            $icontempp = $('#icon-temp p');

        $locspan.text(d.location);
        // Central Info
        let currentTemp = d.now.temperature;
        let icon = WeatherIcon(d.now.weather);

        switch (d.now.weather) {
            case '晴れ':
                SetColor('skin_sunny');
                $('#central').removeAttr('class');
                break;
            case '曇り':
                SetColor('skin_cloudy');
                $('#central').removeAttr('class');
                break;
            case '雨':
                SetColor('skin_rainy');
                $('#central').removeAttr('class').addClass("weather rain");
                break;
            case '雪':
                SetColor('skin_snowy');
                $('#central').removeAttr('class').addClass("weather snow");
                break;

            default:
                SetColor('skin_snowy');
        }

        $ctbicon.text("°C");

        $ctb.text(currentTemp);
        $icontempi.removeClass().addClass(icon);
        $icontempp.text(d.now.weather);

        // 1番目の行
        var $atmli = $('#atmli'),
            $hd = $('#hd'),
            $pd = $('#pd'),
            $vd = $('#vd');


        $atmli.removeClass().addClass('aswshown');

        $hd.text(d.now.humidity + "%");
        $pd.text(d.now.precipitation + " mm");
        $vd.text(d.tips.uv.percent + "%");


        // 2番目の行
        var $windli = $('#windli'),
            $cd = $('#cd'),
            $sd = $('#sd'),
            $sd1 = $('#sd1'),
            $dd = $('#dd');


        $windli.removeClass().addClass('aswshown');

        $cd.text(d.tips.umbrella.tips);
        $dd.text(d.tips.clothing.tips);
        $sd.text(d.now.wind + "m/s");
        $sd1.text(d.now.wind_direction + "風");
        // 24時間天気
        var $24hours = $('.hour24item');
        for (var item = 0; item < $24hours.length; item++) {
            let CurrentTime = (3 * (item + 1) - 3) + "~" + (3 * (item + 1)) + "時";
            let CurrentTemp = d.today.temperature[item] + "°C";

            let CurrentIcon = WeatherIcon(d.today.weather[item]);

            $($24hours[item]).find('i').removeClass().addClass(CurrentIcon);
            $($24hours[item]).find('span').html(CurrentTime + "</br>" + CurrentTemp);
        }
    }
    function getWeather(loc) {
        let querie = 'https://ip.jb.tn/api/weather?city=' + loc;

        $.getJSON(querie, function (data) {
            LoadedData = data;
            //console.log(LoadedData);

            if (LoadedData != null) {
                //Apply data to elements
                ApplyData(LoadedData);
            }
        });
    }

    function UpdateErrorMsg(value, type) {
        $Info.addClass('show');
        $InfoMsgBx.addClass('open');

        $InfoMsgBx.find('h1').text(info[value][0]);
        $InfoMsgBx.find('p').text(info[value][1]).removeClass('loading');

        if (type === 0) {
            $InfoMsgBx.append("<div id='ok-btn'>Ok</div>");
        }
        else {
            //append loading
            $InfoMsgBx.find('.loader').remove();
            $InfoMsgBx.find('p').css("opacity", "0");
            $InfoMsgBx.append("<div class='loader'></div>");

            setTimeout(function () {
                $InfoMsgBx.find('p').addClass('loading').animate({ opacity: 1 });
                $InfoMsgBx.find('.loader').remove();
            }, 1750);

        }
    }

    function LoadIntro() {
        $rightButton.css("display", "none");
        $('#weather-menu-btn').css("display", "none");

        $('#introscreen').addClass('sunloading');
        setTimeout(function () {
            $('#introscreen').addClass('animfin');

            $rightButton.removeAttr('style');
            $('#weather-menu-btn').removeAttr('style');
        }, 750);
        setTimeout(function () {
            $('#introscreen').remove();
        }, 1350);
    }

    // Open Settings Menu
    $('#main').on('click', '#btn-right, #weather-menu-btn', function (e) {
        e.preventDefault();
        var $CurrentButton = $(this);

        if ($CurrentButton.is("#btn-right")) {
            $rightButton.toggleClass('open');
            $rightMenu.toggleClass('show');
            $('#btn-right-i').toggleClass('fa-times');

            $('body').removeAttr('class');
        }
        else if ($CurrentButton.is("#weather-menu-btn")) {
            $weatherMenu.toggleClass('show');

            if ($tempDiv.hasClass('')) {
                $tempDiv.addClass('weather-menu-show');
            }
            else {
                $tempDiv.removeClass('weather-menu-show');
            }
        }

        if ($rightMenu.hasClass('show')) {
            $rightButton.prop('disabled', true);

            $(settingsList).each(function (j) {
                setTimeout(function () {
                    $(settingsList[j]).addClass('slideAnimation');
                }, 35 * j);
            });

            setTimeout(function () {
                $rightButton.prop('disabled', false);
            }, 595);
        }
        else if ($rightMenu.hasClass('')) {
            $rightButton.prop('disabled', true);

            ApplyData(LoadedData);

            $('body').removeAttr('class');
            setTimeout(function () {
                $rightButton.prop('disabled', false);
                $(settingsList).each(function (j) {
                    $(this).removeClass('slideAnimation');
                });
            }, 595);
        }
    })

    // Change Theme
    $('.row').on('click', 'span', function (e) {
        var new_theme = $(this).attr('class').split(' ');
        if (new_theme[1] != 'current') {
            $('.row span.' + new_theme[0]).removeClass('current');
            $(this).addClass('current');

        }
        $Main.removeAttr('class').addClass(new_theme[0]);
        $('body').removeAttr('class').addClass(new_theme[0]);
    })

    // Update Button
    $('#settings').on('click', '#update-button', function (e) {
        temp_location = $('#search').val();

        if (temp_location == "") {
            temp_location = "新宿";
        }

        UpdateErrorMsg("Loading", 1);

        getWeather(temp_location);

        setTimeout(function () {
            $Info.removeClass('show');
            $InfoMsgBx.removeClass('open');
        }, 2500);

    })

    // Error Button
    $('#info-msg').on('click', '#ok-btn', function (e) {
        if ($Info.hasClass('show')) {
            $Info.removeClass('show');
            $InfoMsgBx.removeClass('open');
            $InfoMsgBx.find('#ok-btn').remove();
        }
    })


    $('#weather-menu').on('click', '.day_left, .day_right, #dotmenu span', function () {
        var $button = $(this);

        if ($button.hasClass('day_right') && currentSlide != 2) {
            currentSlide += 1;
        }
        else if ($button.hasClass('day_left') && currentSlide != 0) {
            currentSlide -= 1;
        }
        else if ($button.hasClass('')) {
            var indexbtn = $button.index();
            currentSlide = indexbtn;
        }
        $('.li_row').css('transform', 'translateX(-' + currentSlideX[currentSlide] + 'px)');
        $('.currentday').removeClass('currentday');
        $dotmenu.eq(currentSlide).addClass('currentday');

    })
    //End buttons


    // Call the functions
    SetColor('blue');
    LoadIntro();
    getWeather('東京都北区');

    console.log("loaded");
}); // End $(document).ready

