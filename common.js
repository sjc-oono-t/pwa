// const storage = localStorage;
// ページ読み込み時
window.onload = function(){
  // var current_page = localStorage.getItem("current_page")
  localStorage.setItem("current_page", location.href);
  // if (current_page && current_page != location.href) {
  //   window.location.href = current_page;
  // }
}
