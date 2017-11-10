module.exports = function (RED) {
    function NodeFunction(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.action = config.action;
        var node = this;
        this.on('input', function (msg) {
            var baseURL = "https://api.spotify.com";

            var actions = {
                play: {uri:"/v1/me/player/play", method:"PUT"},
                pause: {uri:"/v1/me/player/pause", method:"PUT"},
                next: {uri:"/v1/me/player/next", method:"POST"},
                search: {uri:"/v1/search", method:"GET"}, // https://developer.spotify.com/web-api/search-item/
                previous: {uri:"/v1/me/player/previous", method:"POST"},
                currentlyPlaying: {uri:"/v1/me/player/currently-playing", method:"GET"},
                track: {uri:"/v1/tracks/", method:"GET"}, // https://developer.spotify.com/web-api/get-track/
            }
            var cookies = msg.req.cookies;
            var action = actions[node.action];
            // Configure url
            msg.url = baseURL + action.uri;

            // paramters
            switch(node.action)
            {
                case 'search':
                    msg.url += "?q="+encodeURIComponent("at your door");
                    msg.url += '&type='+"track";
                    break;
                case 'play' :
                    msg.payload = {"uris":
                        ["spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"]}
                    break;
                case 'track' :
                    msg.url += msg.payload; // TODO need to consider how best to store information form subsquent queries as we pass trough nodes.
                    break;
            }

            msg.method = action.method;
            msg.headers= {
                "Authorization": 'Bearer ' + cookies.access_token
            };

            node.send(msg);
        });
    }

    RED.nodes.registerType("spotify-api", NodeFunction);
}