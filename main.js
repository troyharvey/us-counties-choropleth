var r = React.renderComponent(Choropleth.Map(), document.getElementById("react"));

window.setInterval(function(){
  r.refresh();
}, 1000);