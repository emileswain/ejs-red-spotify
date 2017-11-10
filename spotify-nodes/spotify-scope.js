module.exports = function (RED) {
    function NodeFunction(config) {
        RED.nodes.createNode(this, config);
        this.scopes = config.scopes;
        var node = this;
        this.on('input', function (msg) {
            msg.ns = {
                spotify: {
                    config: { scope: node.scopes.join(' ')}
                }
            };
            node.send(msg);
        });

    }

    RED.nodes.registerType("spotify-scope", NodeFunction);
}