var Choropleth = {};
Choropleth.Map = React.createClass({
    getDefaultProps: function() {
        return {
            width: 960,
            height: 500
        };
    },
    getInitialState: function() {
        return {
            counties: [],
            states: {},
            rateById: d3.map()
        };
    },
    componentWillMount: function() {
        this.refresh();
    },
    refresh: function() {
      var cmp = this;

      queue()
          .defer(d3.json, "us.json")
          .defer(d3.tsv, "unemployment.tsv")
          .await(function(error, us, unemployment) {
            var u = d3.map();
            unemployment.forEach(function(county) {
              u.set(county.id, county.rate);
            });
            u.set(8075, (.15 * Math.random()));
            u.set(13095, (.15 * Math.random()));
            u.set(18177, (.15 * Math.random()));
            cmp.replaceState({rateById: null});
              cmp.setState({
                  counties: topojson.feature(us, us.objects.counties).features,
                  states: topojson.mesh(us, us.objects.states, function(a, b) {
                      return a !== b;
                  }),
                  rateById: u
              });
          });
    },
    quantize: d3.scale.quantize()
        .domain([0, 0.15])
        .range(d3.range(9).map(function(i) {
            return "q" + i + "-9";
        })),
    render: function() {
        var cmp = this;
        var svg = React.DOM.svg;
        var g = React.DOM.g;
        var path = React.DOM.path;
        var pathGenerator = d3.geo.path();

        return svg({
                className: "choropleth Blues",
                width: this.props.width,
                height: this.props.height
            },
            g({
                    className: "counties"
                },
                _.map(this.state.counties, function(county) {
                    return path({
                        className: cmp.quantize(cmp.state.rateById.get(county.id)),
                        d: pathGenerator(county)
                    });
                })),
            path({
                className: "states",
                d: pathGenerator(this.state.states)
            }));
    }
});