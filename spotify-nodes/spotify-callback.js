module.exports = function (RED) {
    function NodeFunction(config) {
        RED.nodes.createNode(this, config);
        this.spotifyConfig = RED.nodes.getNode(config.spotifyConfig);
        var node = this;
        this.on('input', function (msg) {

            // Received from Spotify-authorise node
            var code = msg.payload.code;
            var state = msg.payload.state;
            var storedState = msg.req.cookies.spotify_auth_state;

            if(state === null || state != storedState)
            {
                node.warn("Spotify auth state did not match",msg);
                msg.url = '/spotify/'
            }else{
                msg.cookies = {spotify_auth_state:{value:null}};
                msg.url = 'https://accounts.spotify.com/api/token';
                msg.payload = {code:code,
                    redirect_uri: node.spotifyConfig.redirect_uri,
                    grant_type: 'authorization_code'
                }
                msg.headers= {"Content-Type" : "application/x-www-form-urlencoded", // This makes it work. link: stack-overflow WTF
                    "Authorization": 'Basic ' + (new Buffer(node.spotifyConfig.client_id + ':' + node.spotifyConfig.client_secret).toString('base64'))};
            }


            node.send(msg);

        });
    }

    RED.nodes.registerType("spotify-callback", NodeFunction);
}