window.MUSIC_DATA={};
var songsLoaded = false;
var playlistsLoaded = false;





window.onload=function(){
  var AjaxRequest = function(file,callback){
    //var xhttplist=new XMLHttpRequest();
    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
        var xhttplist=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
        var xhttplist=new ActiveXObject("Microsoft.XMLHTTP");
      }
    //xhttplist.open("GET",file,true);
    xhttplist.onreadystatechange=function(){
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);
        //console.log(this.responseText);
      }

    }
    xhttplist.open("GET",file,true);
    xhttplist.send();

  };

  AjaxRequest('/api/playlists', function(data){
    var playlistArray = JSON.parse(data);
    window.MUSIC_DATA['playlists']=playlistArray;
    playlistsLoaded = true;
    //console.log("AjaxRequest playlists");
    attemptRunApp();
  });

  AjaxRequest('/api/songs', function(data){
    var songsArray = JSON.parse(data);
    window.MUSIC_DATA['songs']=songsArray;
    songsLoaded = true;
    //console.log("AjaxRequest songs");
    attemptRunApp();
  });

}

var attemptRunApp = function(){
  if (songsLoaded==true && playlistsLoaded == true){
    runApp();
  }
}

// var AjaxPost = function(file,callback){
//     var xhttp;
//     if (window.XMLHttpRequest)
//       {// code for IE7+, Firefox, Chrome, Opera, Safari
//         xhttp=new XMLHttpRequest();
//       }
//     else
//       {// code for IE6, IE5
//         xhttp=new ActiveXObject("Microsoft.XMLHTTP");
//       }
//     xhttp.open("POST",file,true);
//     xhttp.onreadystatechange=function(){
//         console.log(xhttp);
//         console.log("in the ajaxpost"+this.responseText);
//         callback(this.responseText);
//       }
//     xhttp.setRequestHeader("Content-Type","text/json");
//     xhttp.send(new_object);
//   }
//
// var AjaxAddSong = function(file,callback){
//   var xhttp;
//   if (window.XMLHttpRequest)
//     {// code for IE7+, Firefox, Chrome, Opera, Safari
//       xhttp=new XMLHttpRequest();
//     }
//   else
//     {// code for IE6, IE5
//       xhttp=new ActiveXObject("Microsoft.XMLHTTP");
//     }
//   xhttp.open("POST",file,true);
//   xhttp.onreadystatechange=function(){
//       console.log(xhttp);
//       console.log("in the ajaxpost"+final_id);
//       callback(final_id);
//     }
//   xhttp.setRequestHeader("Content-Type","application/json");
//   xhttp.send(data);
// }

var runApp= function(){
  if(window.location.href.indexOf('/playlists') > -1){
    //console.log("first check");
    show_con();
    display_list();
    click_on_list();
    //console.log("check in playlist in runApp");
    }
  else if (window.location.href.indexOf('/library')>-1){
    show_con();
    click_library();
  }

  else if (window.location.href.indexOf('/search')>-1){
    show_con();
    click_search();
  }
}


var show_con = function(){
  document.getElementsByClassName("container")[0].style.display="block";
}


  //playlist view
  var list_rows=document.getElementsByClassName("row")[0];
  var list_butts=document.getElementsByClassName("butt")[0];
  var playlist_library=document.getElementsByClassName("each")[0];
  //library view
  var library_view=document.getElementsByClassName("lib_hidden")[0];
  //search view
  var search_view=document.getElementsByClassName("search_hidden")[0];
  //icon color
  var icon_music =document.getElementsByClassName("glyphicon-music")[0];
  var icon_list = document.getElementsByClassName("glyphicon-th-list")[0];
  var icon_search =document.getElementsByClassName("glyphicon-search")[0];
  //font color
  var lib_color=document.getElementById("greycolorlib");
  var list_color=document.getElementById("greycolorlist");
  var search_color=document.getElementById("greycolorsear");
  //define id
  var nav_library=document.getElementById("libraryy");
  var nav_playlist=document.getElementById("playlistt");
  var nav_search=document.getElementById("search");
  // popup-choose playlist
  var popup=document.getElementsByClassName("glyphicon-plus-sign");
  //var remove=document.getElementsByClassName("glyphicon-remove")[0];
  var remove=document.getElementById("remove");

  var content = document.getElementsByClassName("popup_hidden")[0];
  var each_list = document.getElementById('choose_one_list');

  // sort
  var sort_art = document.getElementById("sortartist");
  var sort_tit = document.getElementById("sorttitle");
  //click each playlist
  var display_detail=document.getElementsByClassName("playlists_detail")[0];
  var click = document.getElementsByClassName("show_list")[0];

  var input_mysearch = document.getElementById("mysearch");
  var content_search_list =document.getElementById("search_playlist");
  var content_search_list_song =document.getElementById("song_in_list");
  var content_search_song = document.getElementById("search_song");

  var song_array = [];
  //store id of songs
  var store;
  var store_list;
  var store_list2;
  var store_remove;
  var object;
  var new_object;
  var final_id;


  var display_song_playlist = function(){
      var order_string = store_list.substring(8);
      var order_num = parseInt(order_string);

      pname=MUSIC_DATA.playlists.playlists[order_num].name;
      var show_h3=document.getElementById("playlist_name");
      show_h3.innerHTML = pname;
      song_array=[];
      for(var i=0;i<MUSIC_DATA.playlists.playlists[order_num].songs.length;i++){
          var list_songID=MUSIC_DATA.playlists.playlists[order_num].songs[i];
          for(var j=0;j<MUSIC_DATA.songs.songs.length;j++){
             if (list_songID === MUSIC_DATA.songs.songs[j].id){
              song_array.push(MUSIC_DATA.songs.songs[j].id);
              playlist_library.innerHTML+=
              "<span class='glyphicon glyphicon-picture'></span>"+
              "<h4 id='LN'>"+
              "<span id='listname2'>"+ MUSIC_DATA.songs.songs[j].title +"</span>"+
              "<p id='name_for_playlist'>"+pname+"</p>"+
              "</h4>"+
              "<span class='glyphicon glyphicon-remove position'"+
              "id='remove"+ MUSIC_DATA.playlists.playlists[order_num].songs[i]+"'"+
              ">"+
              "</span>"+
              "<span class='glyphicon glyphicon-plus-sign'"+
              "id='ordrr"+ i +"'"+">"+
              "</span>"+
              "<span class='glyphicon glyphicon-play'></span>"+

              "<hr>"
              }
            }
     }
  };

  var display_list = function(){
    var list_list=document.getElementsByClassName("show_list")[0];
      for(var i=0;i<MUSIC_DATA.playlists.playlists.length;i++){
          list_list.innerHTML+=
              '<div id = "identify'+ i + '"'+'>'+
              '<span class="glyphicon glyphicon-picture"></span>'+
              '<h4>'+
              '<span id="listname">'+MUSIC_DATA.playlists.playlists[i].name+'</span>'+
              '</h4>'+
              '<span class="glyphicon glyphicon-chevron-right"></span>'+
              '<hr>'+
              '</div>';

      }
      //console.log("check in playlist in display_list");
  }

  var click_remove = function(){
  var order_string = store_list.substring(8);
  var order_num = parseInt(order_string);
  var number_songs =MUSIC_DATA.playlists.playlists[order_num].songs.length;
  var order=order_num+1;
  for(var i=0;i<number_songs;i++){
    var hi="remove"+MUSIC_DATA.playlists.playlists[order_num].songs[i];
    //console.log("hi "+hi);
    var remove_song = document.getElementById(hi);
    remove_song.onclick=function(){
          store_remove=this.id;
          var id_string = store_remove.substring(6);
          //console.log("id_string "+id_string);
          var id_num = parseInt(id_string);
          //console.log("id_num "+id_num);

          object ={
            songs:id_num
          }

          $.ajax({
            url: 'http://localhost:3000/playlists/'+(order),
            type: 'DELETE',
            data: object,
            success: function(result) {
              // Do something with the result
              window.MUSIC_DATA['playlists']=JSON.parse(result);
              display_playlists();
              console.log("responseText "+result);
            }
          });
          //display_playlists();
          alert("The song has been deleted from Playlist "+MUSIC_DATA.playlists.playlists[order_num].name);

    }
  }
}


  var click_on_list = function(){
    for(var i=0;i<MUSIC_DATA.playlists.playlists.length;i++){
      var id_num = "identify" + i;
      var identify_name = document.getElementById(id_num);
      /*identify_name.addEventListener("click",display_song_playlist,false);*/
      identify_name.onclick=function(){
          store_list=this.id;
          //alert(store_list);
        }
    }
    //console.log("check in playlist in click_on_list");
  }

  var clear_playlist=function(){
      list_rows.style.display="none";
      list_butts.style.display="none";
      playlist_library.innerHTML="";
      each_list.innerHTML="";
  };

  var display_playlists = function(){
    clear_playlist();
    display_detail.style.display="block";
    icon_list.style.color="black";
    list_color.style.color="grey";
    display_song_playlist();
    click_choose_playlist_inlist();
    click_remove();
  };
  click.addEventListener("click",display_playlists,false);


  var click_playlist=function(){
      clear_playlist();
      lib_color.style.color="grey";
      icon_list.style.color="purple";
      icon_search.style.color="grey";
      icon_music.style.color="black";
      icon_list.style.color="purple";
      icon_search.style.color="black";
      library_view.style.display="none";
      list_rows.style.display="block";
      list_butts.style.display="block";
      search_view.style.display="none";
      display_detail.style.display="none";
      window.history.pushState(null,null,'/playlists');
  };
  nav_playlist.addEventListener("click",click_playlist,false);



  var click_library = function(){

      lib_color.style.color="purple";
      icon_list.style.color="grey";
      icon_search.style.color="grey";
      icon_music.style.color="purple";
      icon_list.style.color="black";
      icon_search.style.color="black";
      library_view.style.display="block";
      list_rows.style.display="none";
      list_butts.style.display="none";
      search_view.style.display="none";
      display_detail.style.display="none";
      click_sort_by_artist();
      window.history.pushState(null,null,'/library');
  };
  nav_library.addEventListener("click",click_library,false);


  var choose_playlist =function(){
    content.style.display="block";
    show_each_list();
  };

  var click_choose_playlist_inlist = function(){
    var order_string = store_list.substring(8);
    var order_num = parseInt(order_string);
    var number_songs =MUSIC_DATA.playlists.playlists[order_num].songs.length;
    for(var i=0;i<number_songs;i++){
      var hi="ordrr"+i;
      var trya=document.getElementById(hi);
      trya.addEventListener("click",choose_playlist,false);
      trya.onclick=function(){
            store=this.id;
        }
    }
  }


  //修改
  var click_choose_playlist = function(){
    //MUSIC_DATA.songs.length
    for(var i=0;i<100;i++){
      var hi="order"+i;
      var trya=document.getElementById(hi);
      if(document.getElementById(hi)){
        trya.addEventListener("click",choose_playlist,false);
        trya.onclick=function(){
            store=this.id;
          }
      }
    }
  };


  var hide_popup = function(){
    content.style.display="none";
    each_list.innerHTML="";
  };
  remove.addEventListener("click",hide_popup,false);

  var show_each_list=function(){
    for(var i =0;i<MUSIC_DATA.playlists.playlists.length;i++){
      each_list.innerHTML +=
        '<p id="list'+i+ '"' +'>'+MUSIC_DATA.playlists.playlists[i].name+'</p>';
      var list_id=document.getElementById("list"+i);
      list_id.style.color = "#855A99";
      list_id.style.fontSize="18px";
    }
    show_each();
  }

  var show_each=function(){
    for(var i=0;i<MUSIC_DATA.playlists.playlists.length;i++){
      var list_id=document.getElementById("list"+i);
      list_id.onclick=function(){
          store_list2=this.id;
        }
    }
  }

  var click_each_list=function(){
    var order_string = store_list2.substring(4);
    var order_num = parseInt(order_string);
    var know_order_string = store.substring(5);
    var know_order = parseInt(know_order_string);
    var check=0;
    final_id=song_array[know_order];
    for (var i=0;i<MUSIC_DATA.playlists.playlists[order_num].songs.length;i++){
      if(final_id === MUSIC_DATA.playlists.playlists[order_num].songs[i]){
        alert("The song is already in the Playlist "+MUSIC_DATA.playlists.playlists[order_num].name);
        check=1;
        break;
      }
    }
    if (check === 0){
      alert("The song is added to the Playlist");
    }
    MUSIC_DATA.playlists.playlists[order_num].songs.push(final_id);
    playlists_id=order_num+1;
    hide_popup();
    tmp=MUSIC_DATA.playlists;

    var new_object={
      songs:final_id
    };

    $.post('api/playlists/'+playlists_id,new_object,function(responseText) {
      //window.MUSIC_DATA['playlists']=JSON.parse(responseText);
      //console.log("responseText "+responseText);
    })

    // AjaxAddSong('/api/playlists/:id',function(data){
    //   var x = JSON.stringify(data);
    //   console.log("inside AjaxAddSong click_each_list"+x);
    // });
  }
  each_list.addEventListener("click",click_each_list);


  ////修改
  var show_library= function(){
      var list_library=document.getElementsByClassName("list")[0];
      // MUSIC_DATA.songs.length

      for(var i=0;i<100;i++){
          song_array.push(MUSIC_DATA.songs.songs[i].id);
          list_library.innerHTML+=
            "<span class='glyphicon glyphicon-picture'></span>"+
            "<h4 id='LN'>"+
            "<span id='listname2'>"+ MUSIC_DATA.songs.songs[i].title +"</span>"+
            "<p id='albums'>" + MUSIC_DATA.songs.songs[i].album+"</p>"+
            "</h4>"+
            "<span class='glyphicon glyphicon-plus-sign'"+
            "id='order"+ i +"'"+">"+
             "</span>"+
            "<span class='glyphicon glyphicon-play'></span>"+
            "<hr>"
      }

  };
  var clear_library= function(){
    document.getElementsByClassName("list")[0].innerHTML="";
    song_array = [];
  };

  //sort by artist
  var sort_by_artist=function(){
    (MUSIC_DATA.songs).songs.sort(function(a,b){
      var x=a.artist.toLowerCase();
      var y=b.artist.toLowerCase();
      var substring_a = x.substring(0,4);
      var substring_b = y.substring(0,4);


      if(substring_a == "the "){
        x=x.substring(4);
      }
      if(substring_b == "the "){
        y=y.substring(4);
      }

      if(x<y){
        return -1;
      }
      else if(x>y){
        return 1;
      }
      return 0;
    })
  };
  var selected_art = function(){
    sort_tit.style.boxShadow = "initial";
    sort_art.style.boxShadow = "inset 0 1px 5px rgba(0,0,0,0.6)";
  };
  var click_sort_by_artist=function(){
    clear_library();
    sort_by_artist();
    show_library();
    selected_art();
    click_choose_playlist();
  }
  sort_art.addEventListener("click",click_sort_by_artist,false);

  //sort by title
  var sort_by_title=function(){
    (MUSIC_DATA.songs).songs.sort(function(a,b){

      var x=a.title.toLowerCase();
      var y=b.title.toLowerCase();
      var substring_a = x.substring(0,4);
      var substring_b = y.substring(0,4);

      if(substring_a == "the "){
        x=x.substring(4);
      }
      if(substring_b == "the "){
        y=y.substring(4);
      }

      if(x<y){
        return -1;
      }
      else if(x>y){
        return 1;
      }
      return 0;
    })
  };
  var selected_title = function(){
    sort_art.style.boxShadow = "initial";
    sort_tit.style.boxShadow = "inset 0 1px 5px rgba(0,0,0,0.6)";
  };

  var click_sort_by_title=function(){
    clear_library();
    sort_by_title();
    show_library();
    selected_title();
    click_choose_playlist();
  }
  sort_tit.addEventListener("click",click_sort_by_title,false);


  var click_search=function(){
      lib_color.style.color="grey";
      icon_list.style.color="grey";
      icon_search.style.color="purple";
      icon_music.style.color="black";
      icon_list.style.color="black";
      icon_search.style.color="purple";
      library_view.style.display="none";
      list_rows.style.display="none";
      list_butts.style.display="none";
      search_view.style.display="block";
      display_detail.style.display="none";
      window.history.pushState(null,null,'/search');
  };
  nav_search.addEventListener("click",click_search,false);



  var click_on_search =function(){
      if( input_mysearch.value === "")
      {
            content_search_list.innerHTML="";
      }

      for(var i =0; i<MUSIC_DATA.playlists.playlists.length;i++){
          var each_playlist=document.createElement("div");
          each_playlist.setAttribute("id","eachlist"+i);
          if ((MUSIC_DATA.playlists.playlists[i].name.indexOf(input_mysearch.value) > -1) && (input_mysearch.value !="")){

              content_search_list.style.display="block";
              if(!document.getElementById("eachlist"+i)){
                each_playlist.innerHTML =
                  '<span class="glyphicon glyphicon-picture"></span>'+
                  '<h4>'+
                  "<span id='listname'>"+MUSIC_DATA.playlists.playlists[i].name+ "</span>"+
                  "</h4>" +
                  '<span class="glyphicon glyphicon-chevron-right"></span>'+
                  '<hr>'
                content_search_list.appendChild(each_playlist);
                song_array=[];
                for(var k=0;k<MUSIC_DATA.playlists.playlists[i].songs.length;k++){
                    var list_songID=MUSIC_DATA.playlists.playlists[i].songs[k];
                    for(var j=0;j<MUSIC_DATA.songs.songs.length;j++){
                       if (list_songID === MUSIC_DATA.songs.songs[j].id){
                        song_array.push(MUSIC_DATA.songs.songs[j].id);
                        content_search_list_song.innerHTML+=
                        "<span class='glyphicon glyphicon-picture'></span>"+
                        "<h4 id='LN'>"+
                        "<span id='listname2'>"+ MUSIC_DATA.songs.songs[j].title +"</span>"+
                        "<p id='name_for_playlist'>"+MUSIC_DATA.playlists.playlists[i].name+"</p>"+
                        "</h4>"+
                        "<span class='glyphicon glyphicon-plus-sign'"+
                        "id='ordrr"+ k +"'"+">"+
                        "</span>"+
                        "<span class='glyphicon glyphicon-play'></span>"+
                        "<hr>"
                        }
                      }
                  }
                click_choose_playlist_inlist(i);
            }
              //document.getElementById("count").innerHTML+="break" + i +")";

              break;

            }

            else {

                //document.getElementById("count").innerHTML+=i;
                content_search_list.innerHTML="";
                content_search_list_song.innerHTML="";
            }

      }

      if((window.event.keyCode>=48 && window.event.keyCode<=90) || (window.event.keyCode >=96 && window.event.keyCode <=105) || (window.event.keyCode==8) || (window.event.keyCode==46) || (window.event.keyCode==32)){

        for(var i=0;i<100;i++){
            var each_songs_title=document.createElement("div");
            each_songs_title.setAttribute("id","eachsong"+i);
            song_array.push(MUSIC_DATA.songs.songs[i].id);
            if (((MUSIC_DATA.songs.songs[i].title.indexOf(input_mysearch.value) > -1) || (MUSIC_DATA.songs[i].artist.indexOf(input_mysearch.value) > -1)) && (input_mysearch.value !="")){

                content_search_song.style.display="block";
                if(!document.getElementById("eachsong"+i)){
                  each_songs_title.innerHTML =
                      "<span class='glyphicon glyphicon-picture'></span>"+
                      "<h4 id='LN'>"+
                      "<span id='listname2'>"+ MUSIC_DATA.songs.songs[i].title +"</span>"+
                      "<p id='albums'>" + MUSIC_DATA.songs.songs[i].album+"</p>"+
                      "</h4>"+
                      "<span class='glyphicon glyphicon-plus-sign'"+
                      "id='order"+ i +"'"+">"+
                       "</span>"+
                      "<span class='glyphicon glyphicon-play'></span>"+
                      "<hr>"
                  content_search_song.appendChild(each_songs_title);
                  click_choose_playlist2();
                }
              }
            else {
              if(document.getElementById("eachsong"+i)){
                document.getElementById("eachsong"+i).parentNode.removeChild(document.getElementById("eachsong"+i));
                song_array=[];
              }

            }
        }
    }

  }
  input_mysearch.addEventListener("keyup",click_on_search);


  var Add_list=function(){
    var new_name = prompt("Add name of playlist","playlist name");
    length=MUSIC_DATA.playlists.playlists.length;
    object = {
          "id":length,
          "name": new_name,
          "songs":[]
    };
    new_object = {
      name: new_name,
      songs: [1]
    };

    MUSIC_DATA.playlists.playlists.push(object);
    var tmp=MUSIC_DATA.playlists;
    alert("new playlist was added");
    click.innerHTML="";
    display_list();
    click_on_list();

    // var playlistTemplate = '<div id = "identify'+ length + '"'+'>'+
    // '<span class="glyphicon glyphicon-picture"></span>'+
    // '<h4>'+
    // '<span id="listname">'+'{{name}}}'+'</span>'+
    // '</h4>'+
    // '<span class="glyphicon glyphicon-chevron-right"></span>'+
    // '<hr>'+
    // '</div>';
    //
    // var html = Mustache.to_html(playlistTemplate, new_object);
    // click.appendChild(html);


    $.post('api/playlists',new_object,function(responseText) {
      //window.MUSIC_DATA['playlists']=JSON.parse(responseText);
      console.log("responseText "+responseText);
    })

    // AjaxPost('/api/playlists',function(data){
    //   // var x = JSON.stringify(data);
    //   // console.log("inside"+x);
    // });
  }
  list_butts.addEventListener("click",Add_list,false);
