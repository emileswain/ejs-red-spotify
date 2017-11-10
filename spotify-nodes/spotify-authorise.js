var request = require('request');

module.exports = function (RED) {

    function checkNested(obj,path) {
        var args = path.split('.');
        for (var i = 1; i < args.length; i++) {
            if (!obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    function NodeFunction(config) {
        RED.nodes.createNode(this, config);
        this.spotifyConfig = RED.nodes.getNode(config.spotifyConfig);

        var generateRandomString = function(length) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        var node = this;
        this.on('input', function (msg) {
            var client_id = node.spotifyConfig.client_id;
            var client_secret = node.spotifyConfig.client_secret;
            var redirect_uri = node.spotifyConfig.redirect_uri;

            var scope = '';
            // Validate scopes.
            if(checkNested(msg, "ns","msg.ns.spotify.config.scope"))
            {
                //console.log("Scopes = " + msg.ns.spotify.config.scope);
                scope = msg.ns.spotify.config.scope;
            }else{
                node.warn("No scopes defined. You will only have access to public apis.");
            }
            //var scope = node.spotifyConfig.scope || 'user-library-read user-modify-playback-state user-read-playback-state';

            var state = generateRandomString(16);
            msg.cookies = {
                spotify_auth_state: {
                    value: state
                }
            }

            msg.url = 'https://accounts.spotify.com/authorize?'
            msg.url += '&response_type=code'
            msg.url += '&client_id=' + client_id
            msg.url += '&scope=' + scope
            msg.url += '&redirect_uri=' + encodeURIComponent(redirect_uri)
            msg.url += '&state=' + encodeURIComponent(state)
            msg.url += '&state=' + 'true'

            msg.headers= {location: msg.url};

            node.send(msg);

        });
    }

    RED.nodes.registerType("spotify-authorise", NodeFunction);
}